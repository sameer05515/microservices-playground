package com.p.search.api.service;

import com.p.search.api.pojo.AnswerV2;
import com.p.search.api.pojo.CategoryV1;
import com.p.search.api.pojo.CategoryV2;
import com.p.search.api.pojo.QuestionV2;
import com.p.search.api.pojo.V1ToV2Mapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RestAPIInvokerService Tests")
class RestAPIInvokerServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private V1ToV2Mapper v1ToV2Mapper;

    @InjectMocks
    private RestAPIInvokerService restAPIInvokerService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(restAPIInvokerService, "exampleUrl", "http://example.com/api");
        ReflectionTestUtils.setField(restAPIInvokerService, "tagsUrl", "http://example.com/tags");
        ReflectionTestUtils.setField(restAPIInvokerService, "categoriesUrl", "http://example.com/categories");
        ReflectionTestUtils.setField(restAPIInvokerService, "createCategoryUrl", "http://example.com/create-category");
        ReflectionTestUtils.setField(restAPIInvokerService, "createQuestionUrl", "http://example.com/create-question");
        ReflectionTestUtils.setField(restAPIInvokerService, "createAnswerUrl", "http://example.com/create-answer");
    }

    @Test
    @DisplayName("Should fetch example data successfully")
    void getExample_Success() {
        // Given
        String expectedResponse = "{\"id\":1}";
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenReturn(expectedResponse);

        // When
        String result = restAPIInvokerService.getExample();

        // Then
        assertNotNull(result);
        assertEquals(expectedResponse, result);
        verify(restTemplate, times(1)).getForObject(anyString(), eq(String.class));
    }

    @Test
    @DisplayName("Should throw exception when example API fails")
    void getExample_RestClientException() {
        // Given
        when(restTemplate.getForObject(anyString(), eq(String.class)))
                .thenThrow(new RestClientException("API Error"));

        // When & Then
        assertThrows(RestClientException.class, () -> restAPIInvokerService.getExample());
        verify(restTemplate, times(1)).getForObject(anyString(), eq(String.class));
    }

    @Test
    @DisplayName("Should fetch all tags successfully")
    void getAllTags_Success() {
        // Given
        String expectedResponse = "[{\"id\":1,\"name\":\"tag1\"}]";
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenReturn(expectedResponse);

        // When
        String result = restAPIInvokerService.getAllTags();

        // Then
        assertNotNull(result);
        assertEquals(expectedResponse, result);
        verify(restTemplate, times(1)).getForObject(anyString(), eq(String.class));
    }

    @Test
    @DisplayName("Should throw exception when tags API fails")
    void getAllTags_RestClientException() {
        // Given
        when(restTemplate.getForObject(anyString(), eq(String.class)))
                .thenThrow(new RestClientException("API Error"));

        // When & Then
        assertThrows(RestClientException.class, () -> restAPIInvokerService.getAllTags());
        verify(restTemplate, times(1)).getForObject(anyString(), eq(String.class));
    }

    @Test
    @DisplayName("Should migrate categories successfully")
    @SuppressWarnings("unchecked")
    void getAllCategory_Success() {
        // Given
        CategoryV1 categoryV1 = createMockCategoryV1();
        List<CategoryV1> categoryV1List = List.of(categoryV1);
        CategoryV2 categoryV2 = createMockCategoryV2();
        QuestionV2 questionV2 = createMockQuestionV2();
        AnswerV2 answerV2 = createMockAnswerV2();

        ResponseEntity<List<CategoryV1>> categoriesResponse = 
                new ResponseEntity<>(categoryV1List, HttpStatus.OK);
        ResponseEntity<CategoryV1> categoryResponse = 
                new ResponseEntity<>(categoryV1, HttpStatus.OK);
        ResponseEntity<CategoryV1.QuestionV1> questionResponse = 
                new ResponseEntity<>(categoryV1.getQuestions().get(0), HttpStatus.OK);
        ResponseEntity<CategoryV2> createCategoryResponse = 
                new ResponseEntity<>(categoryV2, HttpStatus.OK);
        ResponseEntity<QuestionV2> createQuestionResponse = 
                new ResponseEntity<>(questionV2, HttpStatus.OK);
        ResponseEntity<AnswerV2> createAnswerResponse = 
                new ResponseEntity<>(answerV2, HttpStatus.OK);

        when(restTemplate.exchange(eq("http://example.com/categories"), eq(HttpMethod.GET), 
                isNull(), any(ParameterizedTypeReference.class)))
                .thenReturn(categoriesResponse);
        when(restTemplate.exchange(contains("/categories/"), eq(HttpMethod.GET), 
                isNull(), any(ParameterizedTypeReference.class)))
                .thenReturn(categoryResponse);
        when(restTemplate.exchange(contains("/questions/"), eq(HttpMethod.GET), 
                isNull(), any(ParameterizedTypeReference.class)))
                .thenReturn(questionResponse);
        when(restTemplate.exchange(eq("http://example.com/create-category"), eq(HttpMethod.POST), 
                any(), eq(CategoryV2.class)))
                .thenReturn(createCategoryResponse);
        when(restTemplate.exchange(eq("http://example.com/create-question"), eq(HttpMethod.POST), 
                any(), eq(QuestionV2.class)))
                .thenReturn(createQuestionResponse);
        when(restTemplate.exchange(eq("http://example.com/create-answer"), eq(HttpMethod.POST), 
                any(), eq(AnswerV2.class)))
                .thenReturn(createAnswerResponse);

        when(v1ToV2Mapper.convertToCategory(any(CategoryV1.class))).thenReturn(categoryV2);
        when(v1ToV2Mapper.convertToQuestion(any(), anyString())).thenReturn(questionV2);
        when(v1ToV2Mapper.convertToAnswer(any(), anyString())).thenReturn(answerV2);

        // When
        List<CategoryV2> result = restAPIInvokerService.getAllCategory();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(restTemplate, atLeastOnce()).exchange(
                anyString(), 
                eq(HttpMethod.GET), 
                isNull(), 
                any(ParameterizedTypeReference.class)
        );
        verify(v1ToV2Mapper, atLeastOnce()).convertToCategory(any());
    }

    @Test
    @DisplayName("Should return empty list when no categories found")
    @SuppressWarnings("unchecked")
    void getAllCategory_EmptyList() {
        // Given
        ResponseEntity<List<CategoryV1>> emptyResponse = 
                new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);

        when(restTemplate.exchange(eq("http://example.com/categories"), eq(HttpMethod.GET), 
                isNull(), any(ParameterizedTypeReference.class)))
                .thenReturn(emptyResponse);

        // When
        List<CategoryV2> result = restAPIInvokerService.getAllCategory();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Should return empty list when categories response is null")
    @SuppressWarnings("unchecked")
    void getAllCategory_NullResponse() {
        // Given
        ResponseEntity<List<CategoryV1>> nullResponse = 
                new ResponseEntity<>(null, HttpStatus.OK);

        when(restTemplate.exchange(eq("http://example.com/categories"), eq(HttpMethod.GET), 
                isNull(), any(ParameterizedTypeReference.class)))
                .thenReturn(nullResponse);

        // When
        List<CategoryV2> result = restAPIInvokerService.getAllCategory();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Should skip null categories")
    @SuppressWarnings("unchecked")
    void getAllCategory_SkipNullCategories() {
        // Given
        List<CategoryV1> categoriesWithNull = new ArrayList<>();
        categoriesWithNull.add(null);
        categoriesWithNull.add(CategoryV1.builder().uniqueId("cat-1").build());

        ResponseEntity<List<CategoryV1>> response = 
                new ResponseEntity<>(categoriesWithNull, HttpStatus.OK);

        when(restTemplate.exchange(eq("http://example.com/categories"), eq(HttpMethod.GET), 
                isNull(), any(ParameterizedTypeReference.class)))
                .thenReturn(response);

        CategoryV1 validCategory = CategoryV1.builder().uniqueId("cat-1").build();
        CategoryV2 categoryV2 = CategoryV2.builder().uniqueId("cat-2").build();

        ResponseEntity<CategoryV1> categoryResponse = 
                new ResponseEntity<>(validCategory, HttpStatus.OK);
        ResponseEntity<CategoryV2> createCategoryResponse = 
                new ResponseEntity<>(categoryV2, HttpStatus.OK);

        when(restTemplate.exchange(contains("/categories/cat-1"), eq(HttpMethod.GET), 
                isNull(), any(ParameterizedTypeReference.class)))
                .thenReturn(categoryResponse);
        when(restTemplate.exchange(eq("http://example.com/create-category"), eq(HttpMethod.POST), 
                any(), eq(CategoryV2.class)))
                .thenReturn(createCategoryResponse);
        when(v1ToV2Mapper.convertToCategory(any())).thenReturn(categoryV2);

        // When
        List<CategoryV2> result = restAPIInvokerService.getAllCategory();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Should throw exception when categories API fails")
    @SuppressWarnings("unchecked")
    void getAllCategory_RestClientException() {
        // Given
        when(restTemplate.exchange(eq("http://example.com/categories"), eq(HttpMethod.GET), 
                isNull(), any(ParameterizedTypeReference.class)))
                .thenThrow(new RestClientException("API Error"));

        // When & Then
        assertThrows(RestClientException.class, () -> restAPIInvokerService.getAllCategory());
    }

    @Test
    @DisplayName("Should throw exception when category uniqueId is null")
    void fetchCategory_NullUniqueId() {
        // Given
        String nullId = null;

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> ReflectionTestUtils.invokeMethod(restAPIInvokerService, "fetchCategory", nullId));
    }

    @Test
    @DisplayName("Should throw exception when category uniqueId is empty")
    void fetchCategory_EmptyUniqueId() {
        // Given
        String emptyId = "";

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> ReflectionTestUtils.invokeMethod(restAPIInvokerService, "fetchCategory", emptyId));
    }

    // Helper methods to create mock objects
    private CategoryV1 createMockCategoryV1() {
        CategoryV1.QuestionV1.AnswerV1 answerV1 = CategoryV1.QuestionV1.AnswerV1.builder()
                .uniqueId("ans-1")
                .answer("This is a test answer")
                .rating(5)
                .build();

        CategoryV1.QuestionV1 questionV1 = CategoryV1.QuestionV1.builder()
                .uniqueId("ques-1")
                .ques("What is a test question?")
                .rating(4)
                .answers(List.of(answerV1))
                .build();

        return CategoryV1.builder()
                .uniqueId("cat-1")
                .categoryName("Test Category")
                .rating(5)
                .questions(List.of(questionV1))
                .build();
    }

    private CategoryV2 createMockCategoryV2() {
        return CategoryV2.builder()
                .uniqueId("cat-v2-1")
                .name("Test Category")
                .build();
    }

    private QuestionV2 createMockQuestionV2() {
        return QuestionV2.builder()
                .uniqueId("ques-v2-1")
                .name("Test Question")
                .build();
    }

    private AnswerV2 createMockAnswerV2() {
        return AnswerV2.builder()
                .uniqueId("ans-v2-1")
                .name("Test Answer")
                .build();
    }
}

