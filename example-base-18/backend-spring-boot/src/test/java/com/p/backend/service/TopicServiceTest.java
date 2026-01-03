package com.p.backend.service;

import com.p.backend.dto.TopicRequest;
import com.p.backend.dto.TopicResponse;
import com.p.backend.entity.Directory;
import com.p.backend.entity.Topic;
import com.p.backend.repository.DirectoryRepository;
import com.p.backend.repository.TopicRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TopicServiceTest {

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private DirectoryRepository directoryRepository;

    @InjectMocks
    private TopicService topicService;

    private Topic testTopic;
    private Directory testDirectory;
    private TopicRequest topicRequest;

    @BeforeEach
    void setUp() {
        testDirectory = Directory.builder()
                .id("dir1")
                .name("Test Directory")
                .deleted(false)
                .build();

        testTopic = Topic.builder()
                .id("topic1")
                .title("Test Topic")
                .content("Test Content")
                .directory(testDirectory)
                .directoryId("dir1")
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        topicRequest = TopicRequest.builder()
                .title("New Topic")
                .content("New Content")
                .directoryId("dir1")
                .build();
    }

    @Test
    void testCreateTopic_Success() {
        // Given
        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.of(testDirectory));
        when(topicRepository.save(any(Topic.class))).thenReturn(testTopic);

        // When
        TopicResponse response = topicService.createTopic(topicRequest);

        // Then
        assertNotNull(response);
        assertEquals("Test Topic", response.getTitle());
        verify(topicRepository, times(1)).save(any(Topic.class));
    }

    @Test
    void testCreateTopic_DirectoryNotFound_ThrowsException() {
        // Given
        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            topicService.createTopic(topicRequest);
        });
    }

    @Test
    void testGetTopicById_Success() {
        // Given
        when(topicRepository.findByIdAndDeletedFalse("topic1"))
                .thenReturn(Optional.of(testTopic));
        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.of(testDirectory));

        // When
        TopicResponse response = topicService.getTopicById("topic1");

        // Then
        assertNotNull(response);
        assertEquals("Test Topic", response.getTitle());
    }

    @Test
    void testUpdateTopic_Success() {
        // Given
        when(topicRepository.findByIdAndDeletedFalse("topic1"))
                .thenReturn(Optional.of(testTopic));
        when(topicRepository.save(any(Topic.class))).thenReturn(testTopic);

        // When
        TopicResponse response = topicService.updateTopic("topic1", 
            com.p.backend.dto.UpdateTopicRequest.builder()
                .title("Updated Title")
                .content("Updated Content")
                .build());

        // Then
        assertNotNull(response);
        verify(topicRepository, times(1)).save(any(Topic.class));
    }

    @Test
    void testDeleteTopic_Success() {
        // Given
        when(topicRepository.findByIdAndDeletedFalse("topic1"))
                .thenReturn(Optional.of(testTopic));

        // When
        topicService.deleteTopic("topic1");

        // Then
        verify(topicRepository, times(1)).save(any(Topic.class));
        assertTrue(testTopic.isDeleted());
    }
}

