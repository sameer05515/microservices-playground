package com.p.backend.service;

import com.p.backend.dto.QuestionRequest;
import com.p.backend.dto.QuestionResponse;
import com.p.backend.entity.Directory;
import com.p.backend.entity.Question;
import com.p.backend.repository.DirectoryRepository;
import com.p.backend.repository.QuestionRepository;
import com.p.backend.repository.TopicRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private DirectoryRepository directoryRepository;

    @Mock
    private TopicRepository topicRepository;

    @InjectMocks
    private QuestionService questionService;

    private Question testQuestion;
    private Directory testDirectory;
    private QuestionRequest questionRequest;

    @BeforeEach
    void setUp() {
        testDirectory = Directory.builder()
                .id("dir1")
                .name("Test Directory")
                .deleted(false)
                .build();

        testQuestion = Question.builder()
                .id("q1")
                .questionText("What is this?")
                .description("Test description")
                .answer("This is a test")
                .tags(new ArrayList<>())
                .directory(testDirectory)
                .directoryId("dir1")
                .topicId(null)
                .parentType("directory")
                .parentId("dir1")
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        questionRequest = QuestionRequest.builder()
                .questionText("New Question?")
                .description("New description")
                .answer("New answer")
                .parentId("dir1")
                .parentType("directory")
                .tags(new ArrayList<>())
                .build();
    }

    @Test
    void testCreateQuestion_WithDirectory_Success() {
        // Given
        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.of(testDirectory));
        when(questionRepository.save(any(Question.class))).thenReturn(testQuestion);

        // When
        QuestionResponse response = questionService.createQuestion(questionRequest);

        // Then
        assertNotNull(response);
        assertEquals("What is this?", response.getQuestionText());
        verify(questionRepository, times(1)).save(any(Question.class));
    }

    @Test
    void testCreateQuestion_InvalidParentType_ThrowsException() {
        // Given
        QuestionRequest invalidRequest = QuestionRequest.builder()
                .questionText("Question?")
                .parentId("dir1")
                .parentType("invalid")
                .build();

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            questionService.createQuestion(invalidRequest);
        });
    }

    @Test
    void testGetQuestionById_Success() {
        // Given
        when(questionRepository.findByIdAndDeletedFalse("q1"))
                .thenReturn(Optional.of(testQuestion));
        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.of(testDirectory));

        // When
        QuestionResponse response = questionService.getQuestionById("q1");

        // Then
        assertNotNull(response);
        assertEquals("What is this?", response.getQuestionText());
    }

    @Test
    void testGetQuestionsByDirectory_Success() {
        // Given
        List<Question> questions = new ArrayList<>();
        questions.add(testQuestion);
        when(questionRepository.findByDirectoryIdAndDeletedFalse("dir1"))
                .thenReturn(questions);
        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.of(testDirectory));

        // When
        List<QuestionResponse> responses = questionService.getQuestionsByDirectory("dir1");

        // Then
        assertNotNull(responses);
        assertEquals(1, responses.size());
    }

    @Test
    void testUpdateQuestion_Success() {
        // Given
        when(questionRepository.findByIdAndDeletedFalse("q1"))
                .thenReturn(Optional.of(testQuestion));
        when(questionRepository.save(any(Question.class))).thenReturn(testQuestion);
        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.of(testDirectory));

        // When
        QuestionResponse response = questionService.updateQuestion("q1",
            com.p.backend.dto.UpdateQuestionRequest.builder()
                .questionText("Updated Question?")
                .answer("Updated Answer")
                .build());

        // Then
        assertNotNull(response);
        verify(questionRepository, times(1)).save(any(Question.class));
    }

    @Test
    void testDeleteQuestion_Success() {
        // Given
        when(questionRepository.findByIdAndDeletedFalse("q1"))
                .thenReturn(Optional.of(testQuestion));

        // When
        questionService.deleteQuestion("q1");

        // Then
        verify(questionRepository, times(1)).save(any(Question.class));
        assertTrue(testQuestion.isDeleted());
    }
}

