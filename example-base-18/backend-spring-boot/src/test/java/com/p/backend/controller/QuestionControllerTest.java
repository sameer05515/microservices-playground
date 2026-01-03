package com.p.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.p.backend.dto.QuestionRequest;
import com.p.backend.dto.QuestionResponse;
import com.p.backend.service.QuestionService;
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

@WebMvcTest(QuestionController.class)
class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionService questionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateQuestion_Success() throws Exception {
        // Given
        QuestionRequest request = QuestionRequest.builder()
                .questionText("What is this?")
                .description("Test description")
                .answer("This is a test")
                .parentId("dir1")
                .parentType("directory")
                .tags(new ArrayList<>())
                .build();

        QuestionResponse response = QuestionResponse.builder()
                .id("q1")
                .questionText("What is this?")
                .description("Test description")
                .answer("This is a test")
                .parentId("dir1")
                .parentType("directory")
                .createdAt(LocalDateTime.now())
                .build();

        when(questionService.createQuestion(any(QuestionRequest.class)))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.questionText").value("What is this?"))
                .andExpect(jsonPath("$.parentType").value("directory"));
    }

    @Test
    void testGetQuestionById_Success() throws Exception {
        // Given
        QuestionResponse response = QuestionResponse.builder()
                .id("q1")
                .questionText("What is this?")
                .parentId("dir1")
                .parentType("directory")
                .createdAt(LocalDateTime.now())
                .build();

        when(questionService.getQuestionById("q1"))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/questions/q1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("q1"))
                .andExpect(jsonPath("$.questionText").value("What is this?"));
    }

    @Test
    void testGetQuestionsByDirectory_Success() throws Exception {
        // Given
        List<QuestionResponse> responses = new ArrayList<>();
        responses.add(QuestionResponse.builder()
                .id("q1")
                .questionText("Question 1?")
                .parentId("dir1")
                .parentType("directory")
                .createdAt(LocalDateTime.now())
                .build());

        when(questionService.getQuestionsByDirectory("dir1"))
                .thenReturn(responses);

        // When & Then
        mockMvc.perform(get("/api/questions/directory/dir1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].questionText").value("Question 1?"));
    }

    @Test
    void testUpdateQuestion_Success() throws Exception {
        // Given
        com.p.backend.dto.UpdateQuestionRequest request = 
            com.p.backend.dto.UpdateQuestionRequest.builder()
                .questionText("Updated Question?")
                .answer("Updated Answer")
                .build();

        QuestionResponse response = QuestionResponse.builder()
                .id("q1")
                .questionText("Updated Question?")
                .answer("Updated Answer")
                .parentId("dir1")
                .parentType("directory")
                .createdAt(LocalDateTime.now())
                .build();

        when(questionService.updateQuestion(anyString(), any()))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/questions/q1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionText").value("Updated Question?"));
    }
}

