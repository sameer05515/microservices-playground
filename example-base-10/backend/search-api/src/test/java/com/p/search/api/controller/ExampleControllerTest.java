package com.p.search.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.p.search.api.pojo.CategoryV2;
import com.p.search.api.service.RestAPIInvokerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ExampleController Tests")
class ExampleControllerTest {

    @Mock
    private RestAPIInvokerService restAPIInvokerService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private ExampleController exampleController;

    private String exampleJsonResponse;
    private String tagsJsonResponse;
    private List<CategoryV2> categoryList;

    @BeforeEach
    void setUp() {
        exampleJsonResponse = "{\"id\":1,\"title\":\"test\"}";
        tagsJsonResponse = "[{\"id\":1,\"name\":\"tag1\"}]";
        
        categoryList = new ArrayList<>();
        CategoryV2 category = CategoryV2.builder()
                .uniqueId("cat-1")
                .name("Test Category")
                .build();
        categoryList.add(category);
    }

    @Test
    @DisplayName("Should return example data successfully")
    void getExample_Success() {
        // Given
        when(restAPIInvokerService.getExample()).thenReturn(exampleJsonResponse);

        // When
        ResponseEntity<String> response = exampleController.getExample();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(exampleJsonResponse, response.getBody());
        verify(restAPIInvokerService, times(1)).getExample();
    }

    @Test
    @DisplayName("Should propagate exception when service throws exception")
    void getExample_ServiceException() {
        // Given
        RestClientException exception = new RestClientException("Service error");
        when(restAPIInvokerService.getExample()).thenThrow(exception);

        // When & Then
        assertThrows(RestClientException.class, () -> exampleController.getExample());
        verify(restAPIInvokerService, times(1)).getExample();
    }

    @Test
    @DisplayName("Should return formatted tags JSON successfully")
    void getAllTags_Success() throws JsonProcessingException {
        // Given
        ObjectMapper realMapper = new ObjectMapper();
        JsonNode jsonNode = realMapper.readTree(tagsJsonResponse);
        when(restAPIInvokerService.getAllTags()).thenReturn(tagsJsonResponse);
        when(objectMapper.readTree(tagsJsonResponse)).thenReturn(jsonNode);

        // When
        ResponseEntity<String> response = exampleController.getAllTags();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(restAPIInvokerService, times(1)).getAllTags();
        verify(objectMapper, times(1)).readTree(tagsJsonResponse);
    }

    @Test
    @DisplayName("Should return NO_CONTENT when tags response is empty")
    void getAllTags_EmptyResponse() {
        // Given
        when(restAPIInvokerService.getAllTags()).thenReturn("");

        // When
        ResponseEntity<String> response = exampleController.getAllTags();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertEquals("No tags found", response.getBody());
        verify(restAPIInvokerService, times(1)).getAllTags();
        verifyNoInteractions(objectMapper);
    }

    @Test
    @DisplayName("Should return NO_CONTENT when tags response is null")
    void getAllTags_NullResponse() {
        // Given
        when(restAPIInvokerService.getAllTags()).thenReturn(null);

        // When
        ResponseEntity<String> response = exampleController.getAllTags();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertEquals("No tags found", response.getBody());
        verify(restAPIInvokerService, times(1)).getAllTags();
    }

    @Test
    @DisplayName("Should handle JSON processing exception")
    void getAllTags_JsonProcessingException() throws JsonProcessingException {
        // Given
        when(restAPIInvokerService.getAllTags()).thenReturn(tagsJsonResponse);
        when(objectMapper.readTree(tagsJsonResponse))
                .thenThrow(new JsonProcessingException("Invalid JSON") {});

        // When
        ResponseEntity<String> response = exampleController.getAllTags();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Error processing tags"));
        verify(restAPIInvokerService, times(1)).getAllTags();
        verify(objectMapper, times(1)).readTree(tagsJsonResponse);
    }

    @Test
    @DisplayName("Should return categories successfully")
    void getAllCategory_Success() {
        // Given
        when(restAPIInvokerService.getAllCategory()).thenReturn(categoryList);

        // When
        ResponseEntity<List<CategoryV2>> response = exampleController.getAllCategory();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("cat-1", response.getBody().get(0).getUniqueId());
        verify(restAPIInvokerService, times(1)).getAllCategory();
    }

    @Test
    @DisplayName("Should return empty list when no categories found")
    void getAllCategory_EmptyList() {
        // Given
        when(restAPIInvokerService.getAllCategory()).thenReturn(new ArrayList<>());

        // When
        ResponseEntity<List<CategoryV2>> response = exampleController.getAllCategory();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
        verify(restAPIInvokerService, times(1)).getAllCategory();
    }

    @Test
    @DisplayName("Should propagate exception when service throws exception")
    void getAllCategory_ServiceException() {
        // Given
        RestClientException exception = new RestClientException("Service error");
        when(restAPIInvokerService.getAllCategory()).thenThrow(exception);

        // When & Then
        assertThrows(RestClientException.class, () -> exampleController.getAllCategory());
        verify(restAPIInvokerService, times(1)).getAllCategory();
    }
}

