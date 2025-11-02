package com.p.search.api.pojo;

import com.p.search.api.config.AppConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("V1ToV2Mapper Tests")
class V1ToV2MapperTest {

    @InjectMocks
    private V1ToV2Mapper mapper;

    private CategoryV1 categoryV1;
    private CategoryV1.QuestionV1 questionV1;
    private CategoryV1.QuestionV1.AnswerV1 answerV1;

    @BeforeEach
    void setUp() {
        answerV1 = CategoryV1.QuestionV1.AnswerV1.builder()
                .uniqueId("ans-1")
                .answer("This is a test answer with multiple words to test the word limit functionality")
                .rating(5)
                .build();

        questionV1 = CategoryV1.QuestionV1.builder()
                .uniqueId("ques-1")
                .ques("What is a test question?")
                .rating(4)
                .build();

        categoryV1 = CategoryV1.builder()
                .uniqueId("cat-1")
                .categoryName("Test Category Name")
                .rating(5)
                .parentId("parent-1")
                .build();
    }

    @Test
    @DisplayName("Should convert CategoryV1 to CategoryV2 successfully")
    void convertToCategory_Success() {
        // When
        CategoryV2 result = mapper.convertToCategory(categoryV1);

        // Then
        assertNotNull(result);
        assertNotNull(result.getName());
        assertNotNull(result.getHeading());
        assertNotNull(result.getSmartContent());
        assertEquals(categoryV1.getRating(), result.getRating());
        assertEquals(categoryV1.getParentId(), result.getParentId());
        assertEquals(AppConstants.DEFAULT_SOURCE_DB, result.getSourceDB());
    }

    @Test
    @DisplayName("Should throw exception when category is null")
    void convertToCategory_NullCategory() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.convertToCategory(null)
        );
        assertEquals("Category cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should handle HTML content in category name")
    void convertToCategory_WithHtmlContent() {
        // Given
        CategoryV1 categoryWithHtml = CategoryV1.builder()
                .uniqueId("cat-html")
                .categoryName("<h1>HTML Category</h1><p>Description</p>")
                .rating(5)
                .build();

        // When
        CategoryV2 result = mapper.convertToCategory(categoryWithHtml);

        // Then
        assertNotNull(result);
        assertNotNull(result.getHeading());
        assertFalse(result.getHeading().contains("<"));
        assertFalse(result.getHeading().contains(">"));
    }

    @Test
    @DisplayName("Should convert QuestionV1 to QuestionV2 successfully")
    void convertToQuestion_Success() {
        // Given
        String linkedCategoryId = "cat-v2-1";

        // When
        QuestionV2 result = mapper.convertToQuestion(questionV1, linkedCategoryId);

        // Then
        assertNotNull(result);
        assertNotNull(result.getName());
        assertNotNull(result.getHeading());
        assertNotNull(result.getSmartContent());
        assertEquals(questionV1.getRating(), result.getRating());
        assertEquals(linkedCategoryId, result.getLinkedCategoryId());
        assertEquals(0, result.getOrder());
        assertEquals("", result.getParentId());
    }

    @Test
    @DisplayName("Should throw exception when question is null")
    void convertToQuestion_NullQuestion() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.convertToQuestion(null, "cat-1")
        );
        assertEquals("Question cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when linkedCategoryId is null")
    void convertToQuestion_NullLinkedCategoryId() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.convertToQuestion(questionV1, null)
        );
        assertEquals("LinkedCategoryId cannot be null or empty", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when linkedCategoryId is empty")
    void convertToQuestion_EmptyLinkedCategoryId() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.convertToQuestion(questionV1, "")
        );
        assertEquals("LinkedCategoryId cannot be null or empty", exception.getMessage());
    }

    @Test
    @DisplayName("Should convert AnswerV1 to AnswerV2 successfully")
    void convertToAnswer_Success() {
        // Given
        String linkedQuestionsId = "ques-v2-1";

        // When
        AnswerV2 result = mapper.convertToAnswer(answerV1, linkedQuestionsId);

        // Then
        assertNotNull(result);
        assertNotNull(result.getName());
        assertNotNull(result.getHeading());
        assertNotNull(result.getSmartContent());
        assertEquals(answerV1.getRating(), result.getRating());
        assertEquals(linkedQuestionsId, result.getLinkedQuestionsId());
        assertEquals(0, result.getOrder());
    }

    @Test
    @DisplayName("Should throw exception when answer is null")
    void convertToAnswer_NullAnswer() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.convertToAnswer(null, "ques-1")
        );
        assertEquals("Answer cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when linkedQuestionsId is null")
    void convertToAnswer_NullLinkedQuestionsId() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.convertToAnswer(answerV1, null)
        );
        assertEquals("LinkedQuestionsId cannot be null or empty", exception.getMessage());
    }

    @Test
    @DisplayName("Should extract first N words correctly")
    void getFirstNWords_Success() {
        // Given
        String htmlContent = "<p>This is a test sentence with multiple words</p>";
        int n = 5;

        // When
        String result = mapper.getFirstNWords(htmlContent, n);

        // Then
        assertNotNull(result);
        assertEquals("This is a test sentence", result);
    }

    @Test
    @DisplayName("Should return full sentence when word count is less than N")
    void getFirstNWords_LessThanN() {
        // Given
        String htmlContent = "<p>Short sentence</p>";
        int n = 10;

        // When
        String result = mapper.getFirstNWords(htmlContent, n);

        // Then
        assertNotNull(result);
        assertEquals("Short sentence", result);
    }

    @Test
    @DisplayName("Should return empty string when N is zero or negative")
    void getFirstNWords_InvalidN() {
        // Given
        String htmlContent = "<p>Test content</p>";

        // When & Then
        assertEquals("", mapper.getFirstNWords(htmlContent, 0));
        assertEquals("", mapper.getFirstNWords(htmlContent, -1));
    }

    @Test
    @DisplayName("Should return UUID prefix when content is null")
    void getFirstNWords_NullContent() {
        // Given
        int n = 5;

        // When
        String result = mapper.getFirstNWords(null, n);

        // Then
        assertNotNull(result);
        assertTrue(result.startsWith("DEFAULT_PREFIX_"));
        assertTrue(result.length() > "DEFAULT_PREFIX_".length());
    }

    @Test
    @DisplayName("Should return UUID prefix when content is empty")
    void getFirstNWords_EmptyContent() {
        // Given
        String htmlContent = "";
        int n = 5;

        // When
        String result = mapper.getFirstNWords(htmlContent, n);

        // Then
        assertNotNull(result);
        assertTrue(result.startsWith("DEFAULT_PREFIX_"));
        assertTrue(result.length() > "DEFAULT_PREFIX_".length());
    }

    @Test
    @DisplayName("Should handle HTML with tags and extract words correctly")
    void getFirstNWords_ComplexHtml() {
        // Given
        String htmlContent = "<div><h1>Title</h1><p>First paragraph with content</p></div>";
        int n = 3;

        // When
        String result = mapper.getFirstNWords(htmlContent, n);

        // Then
        assertNotNull(result);
        assertFalse(result.contains("<"));
        assertFalse(result.contains(">"));
    }

    @Test
    @DisplayName("Should handle category with null category name")
    void convertToCategory_NullCategoryName() {
        // Given
        CategoryV1 categoryWithNullName = CategoryV1.builder()
                .uniqueId("cat-1")
                .categoryName(null)
                .rating(5)
                .build();

        // When
        CategoryV2 result = mapper.convertToCategory(categoryWithNullName);

        // Then
        assertNotNull(result);
        assertNotNull(result.getHeading());
        assertTrue(result.getHeading().startsWith(AppConstants.DEFAULT_CONTENT_PREFIX));
    }

    @Test
    @DisplayName("Should handle question with null question text")
    void convertToQuestion_NullQuestionText() {
        // Given
        CategoryV1.QuestionV1 questionWithNullText = CategoryV1.QuestionV1.builder()
                .uniqueId("ques-1")
                .ques(null)
                .rating(4)
                .build();

        // When
        QuestionV2 result = mapper.convertToQuestion(questionWithNullText, "cat-1");

        // Then
        assertNotNull(result);
        assertNotNull(result.getHeading());
        assertTrue(result.getHeading().startsWith(AppConstants.DEFAULT_CONTENT_PREFIX));
    }

    @Test
    @DisplayName("Should handle answer with null answer text")
    void convertToAnswer_NullAnswerText() {
        // Given
        CategoryV1.QuestionV1.AnswerV1 answerWithNullText = CategoryV1.QuestionV1.AnswerV1.builder()
                .uniqueId("ans-1")
                .answer(null)
                .rating(5)
                .build();

        // When
        AnswerV2 result = mapper.convertToAnswer(answerWithNullText, "ques-1");

        // Then
        assertNotNull(result);
        assertNotNull(result.getName());
        assertNotNull(result.getHeading());
    }
}

