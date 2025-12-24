package com.p.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.p.backend.dto.DirectoryRequest;
import com.p.backend.dto.DirectoryResponse;
import com.p.backend.service.DirectoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DirectoryController.class)
class DirectoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DirectoryService directoryService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateDirectory_Success() throws Exception {
        // Given
        DirectoryRequest request = DirectoryRequest.builder()
                .name("Test Directory")
                .description("Test Description")
                .build();

        DirectoryResponse response = DirectoryResponse.builder()
                .id("dir1")
                .name("Test Directory")
                .description("Test Description")
                .createdAt(LocalDateTime.now())
                .subDirectoryCount(0)
                .topicCount(0)
                .build();

        when(directoryService.createDirectory(any(DirectoryRequest.class)))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/directories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Directory"))
                .andExpect(jsonPath("$.description").value("Test Description"));
    }

    @Test
    void testGetDirectoryById_Success() throws Exception {
        // Given
        DirectoryResponse response = DirectoryResponse.builder()
                .id("dir1")
                .name("Test Directory")
                .createdAt(LocalDateTime.now())
                .subDirectoryCount(0)
                .topicCount(0)
                .build();

        when(directoryService.getDirectoryById("dir1"))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/directories/dir1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("dir1"))
                .andExpect(jsonPath("$.name").value("Test Directory"));
    }

    @Test
    void testGetRootDirectories_Success() throws Exception {
        // Given
        List<DirectoryResponse> responses = new ArrayList<>();
        responses.add(DirectoryResponse.builder()
                .id("dir1")
                .name("Root Directory")
                .createdAt(LocalDateTime.now())
                .subDirectoryCount(0)
                .topicCount(0)
                .build());

        when(directoryService.getRootDirectories())
                .thenReturn(responses);

        // When & Then
        mockMvc.perform(get("/api/directories/roots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Root Directory"));
    }

    @Test
    void testUpdateDirectory_Success() throws Exception {
        // Given
        com.p.backend.dto.UpdateDirectoryRequest request = 
            com.p.backend.dto.UpdateDirectoryRequest.builder()
                .name("Updated Directory")
                .description("Updated Description")
                .build();

        DirectoryResponse response = DirectoryResponse.builder()
                .id("dir1")
                .name("Updated Directory")
                .description("Updated Description")
                .createdAt(LocalDateTime.now())
                .subDirectoryCount(0)
                .topicCount(0)
                .build();

        when(directoryService.updateDirectory(anyString(), any()))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/directories/dir1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Directory"));
    }

    @Test
    void testDeleteDirectory_Success() throws Exception {
        // Given
        doNothing().when(directoryService).deleteDirectory("dir1");

        // When & Then
        mockMvc.perform(delete("/api/directories/dir1"))
                .andExpect(status().isNoContent());
    }
}

