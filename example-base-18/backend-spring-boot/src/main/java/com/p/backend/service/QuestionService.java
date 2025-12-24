package com.p.backend.service;

import com.p.backend.dto.QuestionRequest;
import com.p.backend.dto.QuestionResponse;
import com.p.backend.dto.UpdateQuestionRequest;
import com.p.backend.entity.Directory;
import com.p.backend.entity.Question;
import com.p.backend.entity.Topic;
import com.p.backend.repository.DirectoryRepository;
import com.p.backend.repository.QuestionRepository;
import com.p.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final DirectoryRepository directoryRepository;
    private final TopicRepository topicRepository;

    public QuestionResponse createQuestion(QuestionRequest request) {
        Directory directory = null;
        Topic topic = null;
        String parentName = "";

        if ("directory".equalsIgnoreCase(request.getParentType())) {
            directory = directoryRepository.findByIdAndDeletedFalse(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Directory not found"));
            parentName = directory.getName();
        } else if ("topic".equalsIgnoreCase(request.getParentType())) {
            topic = topicRepository.findByIdAndDeletedFalse(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Topic not found"));
            parentName = topic.getTitle();
        } else {
            throw new RuntimeException("Invalid parent type. Must be 'directory' or 'topic'");
        }

        Question question = Question.builder()
                .questionText(request.getQuestionText())
                .description(request.getDescription())
                .answer(request.getAnswer())
                .tags(request.getTags() != null ? request.getTags() : new java.util.ArrayList<>())
                .directory(directory)
                .directoryId(directory != null ? directory.getId() : null)
                .topic(topic)
                .topicId(topic != null ? topic.getId() : null)
                .parentType(request.getParentType().toLowerCase())
                .parentId(request.getParentId())
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        question = questionRepository.save(question);
        return mapToResponse(question);
    }

    public QuestionResponse getQuestionById(String id) {
        Question question = questionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return mapToResponse(question);
    }

    public List<QuestionResponse> getQuestionsByDirectory(String directoryId) {
        List<Question> questions = questionRepository.findByDirectoryIdAndDeletedFalse(directoryId);
        return questions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<QuestionResponse> getQuestionsByTopic(String topicId) {
        List<Question> questions = questionRepository.findByTopicIdAndDeletedFalse(topicId);
        return questions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<QuestionResponse> getQuestionsByParent(String parentId) {
        List<Question> questions = questionRepository.findByParentIdAndDeletedFalse(parentId);
        return questions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public QuestionResponse updateQuestion(String id, UpdateQuestionRequest request) {
        Question question = questionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setQuestionText(request.getQuestionText());
        question.setDescription(request.getDescription());
        question.setAnswer(request.getAnswer());
        question.setTags(request.getTags() != null ? request.getTags() : new java.util.ArrayList<>());
        question.setUpdatedAt(LocalDateTime.now());

        question = questionRepository.save(question);
        return mapToResponse(question);
    }

    @Transactional
    public void deleteQuestion(String id) {
        Question question = questionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setDeleted(true);
        question.setDeletedAt(LocalDateTime.now());
        questionRepository.save(question);
    }

    @Transactional
    public void deleteQuestionsByParent(String parentId) {
        List<Question> questions = questionRepository.findByParentIdAndDeletedFalse(parentId);
        for (Question question : questions) {
            question.setDeleted(true);
            question.setDeletedAt(LocalDateTime.now());
            questionRepository.save(question);
        }
    }

    public List<QuestionResponse> searchQuestions(String query) {
        List<Question> questions = questionRepository.searchByQuestionText(query);
        return questions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private QuestionResponse mapToResponse(Question question) {
        String path = buildPath(question);
        String parentName = "";
        
        if (question.getDirectory() != null) {
            Directory dir = directoryRepository.findByIdAndDeletedFalse(question.getDirectoryId())
                    .orElse(null);
            parentName = dir != null ? dir.getName() : "";
        } else if (question.getTopic() != null) {
            Topic top = topicRepository.findByIdAndDeletedFalse(question.getTopicId())
                    .orElse(null);
            parentName = top != null ? top.getTitle() : "";
        }

        return QuestionResponse.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .description(question.getDescription())
                .answer(question.getAnswer())
                .tags(question.getTags() != null ? question.getTags() : new java.util.ArrayList<>())
                .directoryId(question.getDirectoryId())
                .directoryName(question.getDirectory() != null ? question.getDirectory().getName() : null)
                .topicId(question.getTopicId())
                .topicName(question.getTopic() != null ? question.getTopic().getTitle() : null)
                .parentType(question.getParentType())
                .parentId(question.getParentId())
                .parentName(parentName)
                .path(path)
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }

    private String buildPath(Question question) {
        List<String> pathParts = new java.util.ArrayList<>();
        
        if (question.getDirectory() != null) {
            Directory directory = directoryRepository.findByIdAndDeletedFalse(question.getDirectoryId())
                    .orElse(null);
            if (directory != null) {
                // Build path from directory hierarchy
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
            }
        } else if (question.getTopic() != null) {
            Topic topic = topicRepository.findByIdAndDeletedFalse(question.getTopicId())
                    .orElse(null);
            if (topic != null) {
                // Build path from topic's directory hierarchy
                Directory directory = directoryRepository.findByIdAndDeletedFalse(topic.getDirectoryId())
                        .orElse(null);
                if (directory != null) {
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
                }
                pathParts.add(topic.getTitle());
            }
        }
        
        pathParts.add("Q: " + question.getQuestionText());
        return String.join(" / ", pathParts);
    }
}

