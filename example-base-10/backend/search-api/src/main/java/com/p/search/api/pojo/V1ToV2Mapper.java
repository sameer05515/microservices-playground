package com.p.search.api.pojo;

import com.p.search.api.config.AppConstants;
import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service for mapping V1 data models to V2 data models.
 * Handles transformation of categories, questions, and answers.
 */
@Service
public class V1ToV2Mapper {

    private static final Logger logger = LoggerFactory.getLogger(V1ToV2Mapper.class);

    /**
     * Converts a CategoryV1 to CategoryV2 format.
     *
     * @param category CategoryV1 object to convert
     * @return CategoryV2 object
     * @throws IllegalArgumentException if category is null
     */
    public CategoryV2 convertToCategory(CategoryV1 category) {
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }
        
        logger.debug("Converting CategoryV1 to CategoryV2 for category: {}", category.getUniqueId());
        
        return CategoryV2.builder()
                .name(getFirstNWords(category.getCategoryName(), AppConstants.CATEGORY_NAME_WORD_LIMIT))
                .heading(removeHtmlTags(category.getCategoryName(), AppConstants.DEFAULT_CONTENT_PREFIX))
                .smartContent(generateSmartContent(category.getCategoryName(), true))
                .rating(category.getRating())
                .parentId(category.getParentId())
                .sourceDB(AppConstants.DEFAULT_SOURCE_DB)
                .build();
    }

    /**
     * Converts a QuestionV1 to QuestionV2 format.
     *
     * @param question QuestionV1 object to convert
     * @param linkedCategoryId Category ID to link the question to
     * @return QuestionV2 object
     * @throws IllegalArgumentException if question is null or linkedCategoryId is null/empty
     */
    public QuestionV2 convertToQuestion(CategoryV1.QuestionV1 question, String linkedCategoryId) {
        if (question == null) {
            throw new IllegalArgumentException("Question cannot be null");
        }
        if (linkedCategoryId == null || linkedCategoryId.trim().isEmpty()) {
            throw new IllegalArgumentException("LinkedCategoryId cannot be null or empty");
        }
        
        logger.debug("Converting QuestionV1 to QuestionV2 for question: {}", question.getUniqueId());
        
        return QuestionV2.builder()
                .name(getFirstNWords(question.getQues(), AppConstants.QUESTION_NAME_WORD_LIMIT))
                .heading(removeHtmlTags(question.getQues(), AppConstants.DEFAULT_CONTENT_PREFIX))
                .smartContent(generateSmartContent(question.getQues(), true))
                .rating(question.getRating())
                .order(0)
                .linkedCategoryId(linkedCategoryId)
                .parentId("")
                .build();
    }

    /**
     * Converts an AnswerV1 to AnswerV2 format.
     *
     * @param answer AnswerV1 object to convert
     * @param linkedQuestionsId Question ID to link the answer to
     * @return AnswerV2 object
     * @throws IllegalArgumentException if answer is null or linkedQuestionsId is null/empty
     */
    public AnswerV2 convertToAnswer(CategoryV1.QuestionV1.AnswerV1 answer, String linkedQuestionsId) {
        if (answer == null) {
            throw new IllegalArgumentException("Answer cannot be null");
        }
        if (linkedQuestionsId == null || linkedQuestionsId.trim().isEmpty()) {
            throw new IllegalArgumentException("LinkedQuestionsId cannot be null or empty");
        }
        
        logger.debug("Converting AnswerV1 to AnswerV2");
        
        return AnswerV2.builder()
                .name(getFirstNWords(answer.getAnswer(), AppConstants.ANSWER_NAME_WORD_LIMIT))
                .heading(getFirstNWords(answer.getAnswer(), AppConstants.ANSWER_HEADING_WORD_LIMIT))
                .smartContent(generateSmartContent(answer.getAnswer(), true))
                .order(0)
                .linkedQuestionsId(linkedQuestionsId)
                .rating(answer.getRating())
                .build();
    }

    /**
     * Removes HTML tags from content and returns plain text.
     * If content is null or empty, generates a default value with UUID.
     *
     * @param htmlContent HTML content to process
     * @param prefix Prefix to use when generating default value
     * @return Plain text content or generated default value
     */
    private String removeHtmlTags(String htmlContent, String prefix) {
        if (htmlContent != null && htmlContent.trim().length() > 0) {
            try {
                return Jsoup.parse(htmlContent).text();
            } catch (Exception e) {
                logger.warn("Error parsing HTML content, returning original", e);
                return htmlContent;
            }
        } else {
            String defaultPrefix = (prefix != null && !prefix.isEmpty()) 
                    ? prefix 
                    : AppConstants.DEFAULT_PREFIX;
            return defaultPrefix + generateUUID();
        }
    }

    /**
     * Extracts the first N words from HTML content.
     *
     * @param htmlContent HTML content to process
     * @param n Number of words to extract
     * @return First N words as a string, or empty string if invalid input
     */
    public String getFirstNWords(String htmlContent, int n) {
        if (n <= 0) {
            logger.warn("Invalid word limit: {}", n);
            return "";
        }
        
        String sentence = removeHtmlTags(htmlContent, "");
        if (sentence == null || sentence.isEmpty()) {
            return "";
        }

        String[] words = sentence.split("\\s+");
        if (words.length <= n) {
            return sentence;
        }

        StringBuilder result = new StringBuilder();
        for (int i = 0; i < n; i++) {
            result.append(words[i]);
            if (i < n - 1) {
                result.append(" ");
            }
        }

        return result.toString();
    }

    /**
     * Generates a UUID string.
     *
     * @return UUID string
     */
    private String generateUUID() {
        return UUID.randomUUID().toString();
    }

    /**
     * Generates SmartContent object from description.
     *
     * @param description Content description
     * @param placeDefaultContent Whether to place default content if description is empty
     * @return SmartContent object
     */
    private SmartContent generateSmartContent(String description, boolean placeDefaultContent) {
        String content;
        if (description != null && !description.isEmpty()) {
            content = description;
        } else {
            content = placeDefaultContent ? AppConstants.DEFAULT_CONTENT : "";
        }
        
        return SmartContent.builder()
                .content(content)
                .textOutputType(AppConstants.DEFAULT_TEXT_OUTPUT_TYPE)
                .textInputType(AppConstants.DEFAULT_TEXT_INPUT_TYPE)
                .build();
    }
}
