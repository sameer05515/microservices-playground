package com.p.backend.service;

import com.p.backend.dto.DirectoryRequest;
import com.p.backend.dto.DirectoryResponse;
import com.p.backend.dto.UpdateDirectoryRequest;
import com.p.backend.entity.Directory;
import com.p.backend.repository.DirectoryRepository;
import com.p.backend.repository.TopicRepository;
import com.p.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DirectoryService {

    private final DirectoryRepository directoryRepository;
    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;

    public DirectoryResponse createDirectory(DirectoryRequest request) {
        // Validate uniqueness at same level
        validateUniqueName(request.getName(), request.getParentId());

        Directory parent = null;
        if (request.getParentId() != null && !request.getParentId().isEmpty()) {
            parent = directoryRepository.findByIdAndDeletedFalse(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent directory not found"));
        }

        Directory directory = Directory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .parent(parent)
                .parentId(request.getParentId())
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        directory = directoryRepository.save(directory);
        return mapToResponse(directory);
    }

    public DirectoryResponse getDirectoryById(String id) {
        Directory directory = directoryRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Directory not found"));
        return mapToResponse(directory);
    }

    public List<DirectoryResponse> getRootDirectories() {
        List<Directory> directories = directoryRepository.findByParentIdIsNullAndDeletedFalse();
        return directories.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DirectoryResponse> getSubDirectories(String parentId) {
        List<Directory> directories = directoryRepository.findByParentIdAndDeletedFalse(parentId);
        return directories.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DirectoryResponse getHierarchy(String id) {
        Directory directory = directoryRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Directory not found"));
        return buildHierarchy(directory);
    }

    public List<DirectoryResponse> getFullHierarchy() {
        List<Directory> rootDirectories = directoryRepository.findByParentIdIsNullAndDeletedFalse();
        return rootDirectories.stream()
                .map(this::buildHierarchy)
                .collect(Collectors.toList());
    }

    public DirectoryResponse updateDirectory(String id, UpdateDirectoryRequest request) {
        Directory directory = directoryRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Directory not found"));

        // Check if name changed and validate uniqueness
        if (!directory.getName().equals(request.getName())) {
            validateUniqueName(request.getName(), directory.getParentId());
        }

        directory.setName(request.getName());
        directory.setDescription(request.getDescription());
        directory.setUpdatedAt(LocalDateTime.now());

        directory = directoryRepository.save(directory);
        return mapToResponse(directory);
    }

    @Transactional
    public void deleteDirectory(String id) {
        Directory directory = directoryRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Directory not found"));

        // Soft delete directory and all children recursively
        softDeleteDirectory(directory);
    }

    private void softDeleteDirectory(Directory directory) {
        // Soft delete all sub-directories
        List<Directory> children = directoryRepository.findByParentIdAndDeletedFalse(directory.getId());
        for (Directory child : children) {
            softDeleteDirectory(child);
        }

        // Soft delete all topics in this directory
        List<com.p.backend.entity.Topic> topics = topicRepository.findByDirectoryIdAndDeletedFalse(directory.getId());
        for (com.p.backend.entity.Topic topic : topics) {
            // Soft delete all questions in this topic
            List<com.p.backend.entity.Question> topicQuestions = questionRepository.findByTopicIdAndDeletedFalse(topic.getId());
            for (com.p.backend.entity.Question question : topicQuestions) {
                question.setDeleted(true);
                question.setDeletedAt(LocalDateTime.now());
                questionRepository.save(question);
            }
            topic.setDeleted(true);
            topic.setDeletedAt(LocalDateTime.now());
            topicRepository.save(topic);
        }

        // Soft delete all questions in this directory
        List<com.p.backend.entity.Question> directoryQuestions = questionRepository.findByDirectoryIdAndDeletedFalse(directory.getId());
        for (com.p.backend.entity.Question question : directoryQuestions) {
            question.setDeleted(true);
            question.setDeletedAt(LocalDateTime.now());
            questionRepository.save(question);
        }

        // Soft delete this directory
        directory.setDeleted(true);
        directory.setDeletedAt(LocalDateTime.now());
        directoryRepository.save(directory);
    }

    public List<DirectoryResponse> searchDirectories(String namePattern) {
        List<Directory> directories = directoryRepository.searchByName(namePattern);
        return directories.stream()
                .map(this::mapToResponseWithPath)
                .collect(Collectors.toList());
    }

    private void validateUniqueName(String name, String parentId) {
        Optional<Directory> existing;
        if (parentId == null || parentId.isEmpty()) {
            existing = directoryRepository.findByNameAndParentIdIsNullAndDeletedFalse(name);
        } else {
            existing = directoryRepository.findByNameAndParentIdAndDeletedFalse(name, parentId);
        }

        if (existing.isPresent()) {
            throw new RuntimeException("Directory with name '" + name + "' already exists at this level");
        }
    }

    private DirectoryResponse mapToResponse(Directory directory) {
        long subDirCount = directoryRepository.countByParentIdAndDeletedFalse(directory.getId());
        long topicCount = topicRepository.countByDirectoryIdAndDeletedFalse(directory.getId());

        return DirectoryResponse.builder()
                .id(directory.getId())
                .name(directory.getName())
                .description(directory.getDescription())
                .parentId(directory.getParentId())
                .parentName(directory.getParent() != null ? directory.getParent().getName() : null)
                .createdAt(directory.getCreatedAt())
                .updatedAt(directory.getUpdatedAt())
                .subDirectoryCount(subDirCount)
                .topicCount(topicCount)
                .path(buildPath(directory))
                .build();
    }

    private DirectoryResponse mapToResponseWithPath(Directory directory) {
        DirectoryResponse response = mapToResponse(directory);
        response.setPath(buildPath(directory));
        return response;
    }

    private DirectoryResponse buildHierarchy(Directory directory) {
        DirectoryResponse response = mapToResponse(directory);
        
        List<Directory> children = directoryRepository.findByParentIdAndDeletedFalse(directory.getId());
        List<DirectoryResponse> childResponses = new ArrayList<>();
        
        for (Directory child : children) {
            childResponses.add(buildHierarchy(child));
        }
        
        response.setChildren(childResponses);
        return response;
    }

    private String buildPath(Directory directory) {
        List<String> pathParts = new ArrayList<>();
        Directory current = directory;
        
        while (current != null) {
            pathParts.add(0, current.getName());
            if (current.getParent() != null) {
                current = directoryRepository.findByIdAndDeletedFalse(current.getParentId())
                        .orElse(null);
            } else {
                current = null;
            }
        }
        
        return String.join(" / ", pathParts);
    }
}

