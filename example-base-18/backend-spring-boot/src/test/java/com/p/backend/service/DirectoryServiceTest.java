package com.p.backend.service;

import com.p.backend.dto.DirectoryRequest;
import com.p.backend.dto.DirectoryResponse;
import com.p.backend.entity.Directory;
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
class DirectoryServiceTest {

    @Mock
    private DirectoryRepository directoryRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private DirectoryService directoryService;

    private Directory testDirectory;
    private DirectoryRequest directoryRequest;

    @BeforeEach
    void setUp() {
        testDirectory = Directory.builder()
                .id("dir1")
                .name("Test Directory")
                .description("Test Description")
                .parentId(null)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        directoryRequest = DirectoryRequest.builder()
                .name("New Directory")
                .description("New Description")
                .parentId(null)
                .build();
    }

    @Test
    void testCreateDirectory_Success() {
        // Given
        when(directoryRepository.findByNameAndParentIdIsNullAndDeletedFalse(anyString()))
                .thenReturn(Optional.empty());
        when(directoryRepository.save(any(Directory.class))).thenReturn(testDirectory);
        when(topicRepository.countByDirectoryIdAndDeletedFalse(anyString())).thenReturn(0L);
        when(directoryRepository.countByParentIdAndDeletedFalse(anyString())).thenReturn(0L);

        // When
        DirectoryResponse response = directoryService.createDirectory(directoryRequest);

        // Then
        assertNotNull(response);
        assertEquals("Test Directory", response.getName());
        verify(directoryRepository, times(1)).save(any(Directory.class));
    }

    @Test
    void testCreateDirectory_DuplicateName_ThrowsException() {
        // Given
        when(directoryRepository.findByNameAndParentIdIsNullAndDeletedFalse(anyString()))
                .thenReturn(Optional.of(testDirectory));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            directoryService.createDirectory(directoryRequest);
        });
    }

    @Test
    void testGetDirectoryById_Success() {
        // Given
        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.of(testDirectory));
        when(topicRepository.countByDirectoryIdAndDeletedFalse(anyString())).thenReturn(0L);
        when(directoryRepository.countByParentIdAndDeletedFalse(anyString())).thenReturn(0L);

        // When
        DirectoryResponse response = directoryService.getDirectoryById("dir1");

        // Then
        assertNotNull(response);
        assertEquals("Test Directory", response.getName());
    }

    @Test
    void testGetDirectoryById_NotFound_ThrowsException() {
        // Given
        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            directoryService.getDirectoryById("dir1");
        });
    }

    @Test
    void testGetRootDirectories_Success() {
        // Given
        List<Directory> directories = new ArrayList<>();
        directories.add(testDirectory);
        when(directoryRepository.findByParentIdIsNullAndDeletedFalse())
                .thenReturn(directories);
        when(topicRepository.countByDirectoryIdAndDeletedFalse(anyString())).thenReturn(0L);
        when(directoryRepository.countByParentIdAndDeletedFalse(anyString())).thenReturn(0L);

        // When
        List<DirectoryResponse> responses = directoryService.getRootDirectories();

        // Then
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Test Directory", responses.get(0).getName());
    }

    @Test
    void testDeleteDirectory_CascadesToChildren() {
        // Given
        Directory childDirectory = Directory.builder()
                .id("dir2")
                .name("Child Directory")
                .parentId("dir1")
                .deleted(false)
                .build();

        when(directoryRepository.findByIdAndDeletedFalse("dir1"))
                .thenReturn(Optional.of(testDirectory));
        when(directoryRepository.findByParentIdAndDeletedFalse("dir1"))
                .thenReturn(List.of(childDirectory));
        when(topicRepository.findByDirectoryIdAndDeletedFalse(anyString()))
                .thenReturn(new ArrayList<>());
        when(questionRepository.findByDirectoryIdAndDeletedFalse(anyString()))
                .thenReturn(new ArrayList<>());

        // When
        directoryService.deleteDirectory("dir1");

        // Then
        verify(directoryRepository, times(2)).save(any(Directory.class)); // Parent + child
    }
}

