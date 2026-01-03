package com.p.backend.service;

import com.p.backend.dto.TopicRequest;
import com.p.backend.dto.TopicResponse;
import com.p.backend.dto.UpdateTopicRequest;
import com.p.backend.entity.Directory;
import com.p.backend.entity.Topic;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final TopicRepository topicRepository;
    private final DirectoryRepository directoryRepository;
    private final QuestionRepository questionRepository;

    public TopicResponse createTopic(TopicRequest request) {
        Directory directory = directoryRepository.findByIdAndDeletedFalse(request.getDirectoryId())
                .orElseThrow(() -> new RuntimeException("Directory not found"));

        Topic topic = Topic.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .directory(directory)
                .directoryId(request.getDirectoryId())
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        topic = topicRepository.save(topic);
        return mapToResponse(topic);
    }

    public TopicResponse getTopicById(String id) {
        Topic topic = topicRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        return mapToResponse(topic);
    }

    public List<TopicResponse> getTopicsByDirectory(String directoryId) {
        List<Topic> topics = topicRepository.findByDirectoryIdAndDeletedFalse(directoryId);
        return topics.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TopicResponse updateTopic(String id, UpdateTopicRequest request) {
        Topic topic = topicRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        topic.setTitle(request.getTitle());
        topic.setContent(request.getContent());
        topic.setUpdatedAt(LocalDateTime.now());

        topic = topicRepository.save(topic);
        return mapToResponse(topic);
    }

    @Transactional
    public void deleteTopic(String id) {
        Topic topic = topicRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        // Soft delete all questions in this topic
        List<com.p.backend.entity.Question> questions = questionRepository.findByTopicIdAndDeletedFalse(id);
        for (com.p.backend.entity.Question question : questions) {
            question.setDeleted(true);
            question.setDeletedAt(LocalDateTime.now());
            questionRepository.save(question);
        }

        topic.setDeleted(true);
        topic.setDeletedAt(LocalDateTime.now());
        topicRepository.save(topic);
    }

    public List<TopicResponse> searchTopics(String titlePattern) {
        List<Topic> topics = topicRepository.searchByTitle(titlePattern);
        return topics.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TopicResponse mapToResponse(Topic topic) {
        String path = buildPath(topic);
        
        return TopicResponse.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .content(topic.getContent())
                .directoryId(topic.getDirectoryId())
                .directoryName(topic.getDirectory() != null ? topic.getDirectory().getName() : null)
                .path(path)
                .createdAt(topic.getCreatedAt())
                .updatedAt(topic.getUpdatedAt())
                .build();
    }

    private String buildPath(Topic topic) {
        if (topic.getDirectory() == null) {
            return topic.getTitle();
        }

        Directory directory = directoryRepository.findByIdAndDeletedFalse(topic.getDirectoryId())
                .orElse(null);

        if (directory == null) {
            return topic.getTitle();
        }

        // Build path from directory hierarchy
        List<String> pathParts = new ArrayList<>();
        Directory current = directory;

        while (current != null) {
            pathParts.add(0, current.getName());
            if (current.getParentId() != null && !current.getParentId().isEmpty()) {
                current = directoryRepository.findByIdAndDeletedFalse(current.getParentId())
                        .orElse(null);
            } else {
                current = null;
            }
        }

        pathParts.add(topic.getTitle());
        return String.join(" / ", pathParts);
    }
}

