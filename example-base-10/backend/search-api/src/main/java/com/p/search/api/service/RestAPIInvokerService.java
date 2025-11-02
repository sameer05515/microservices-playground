package com.p.search.api.service;

import com.p.search.api.config.AppConstants;
import com.p.search.api.pojo.AnswerV2;
import com.p.search.api.pojo.CategoryV1;
import com.p.search.api.pojo.CategoryV2;
import com.p.search.api.pojo.QuestionV2;
import com.p.search.api.pojo.V1ToV2Mapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class RestAPIInvokerService {

    private static final Logger logger = LoggerFactory.getLogger(RestAPIInvokerService.class);

    private final RestTemplate restTemplate;
    private final V1ToV2Mapper v1ToV2Mapper;

    @Value("${external.api.example-url}")
    private String exampleUrl;

    @Value("${external.api.tags-url}")
    private String tagsUrl;

    @Value("${external.api.categories-url}")
    private String categoriesUrl;

    @Value("${external.api.intvw-mgmt.categories-url}")
    private String createCategoryUrl;

    @Value("${external.api.intvw-mgmt.questions-url}")
    private String createQuestionUrl;

    @Value("${external.api.intvw-mgmt.answers-url}")
    private String createAnswerUrl;

    public RestAPIInvokerService(RestTemplate restTemplate, V1ToV2Mapper v1ToV2Mapper) {
        this.restTemplate = restTemplate;
        this.v1ToV2Mapper = v1ToV2Mapper;
    }

    public String getExample() {
        logger.debug("Fetching example data from URL: {}", exampleUrl);
        try {
            String result = restTemplate.getForObject(exampleUrl, String.class);
            logger.debug("Successfully fetched example data");
            return result;
        } catch (RestClientException e) {
            logger.error("Failed to fetch example data from {}", exampleUrl, e);
            throw e;
        }
    }

    public String getAllTags() {
        logger.debug("Fetching all tags from URL: {}", tagsUrl);
        try {
            String result = restTemplate.getForObject(tagsUrl, String.class);
            logger.debug("Successfully fetched tags");
            return result;
        } catch (RestClientException e) {
            logger.error("Failed to fetch tags from {}", tagsUrl, e);
            throw e;
        }
    }

    /**
     * Migrates all categories from V1 to V2 format.
     * Process:
     * 1. Get all category ids
     * 2. Fetch category data for a given category id (oldCatUID)
     * 3. Transform category data in v2 format
     * 4. Save the category data in v2 format
     * 5. Get the category unique id (newCatUID) for saved one
     * 6. Fetch all questions id for an oldCatUID
     * 7. Transform questions and its answers in new format and save in v2
     *
     * @return List of migrated CategoryV2 objects
     * @throws RestClientException if external API calls fail
     * @throws IllegalArgumentException if required data is missing
     */
    public List<CategoryV2> getAllCategory() {
        logger.info("Starting category migration from V1 to V2");
        
        // 1. Get all category ids
        logger.debug("Fetching all categories from URL: {}", categoriesUrl);
        ResponseEntity<List<CategoryV1>> catV1ListResponse = restTemplate.exchange(
                categoriesUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        
        List<CategoryV1> categories = catV1ListResponse.getBody();
        if (categories == null || categories.isEmpty()) {
            logger.warn("No categories found or received null response");
            return Collections.emptyList();
        }

        logger.info("Found {} categories to migrate", categories.size());

        // 2. fetch category data for a given category id (oldCatUID)
        List<CategoryV2> categoryV2s = new ArrayList<>();
        
        for (CategoryV1 cat : categories) {
            try {
                if (cat == null || cat.getUniqueId() == null) {
                    logger.warn("Skipping category with null uniqueId");
                    continue;
                }
                
                String oldCatUID = cat.getUniqueId();
                logger.debug("Processing category with ID: {}", oldCatUID);
                
                CategoryV1 categoryV1 = fetchCategory(oldCatUID);
                if (categoryV1 == null) {
                    logger.warn("Failed to fetch category details for ID: {}", oldCatUID);
                    continue;
                }

                // 3. transform category data in v2 format
                CategoryV2 categoryV2 = v1ToV2Mapper.convertToCategory(categoryV1);
                
                // 4. save the category data in v2 format
                categoryV2 = createCategoryV2(categoryV2);
                if (categoryV2 == null || categoryV2.getUniqueId() == null) {
                    logger.error("Failed to create category V2 for ID: {}", oldCatUID);
                    continue;
                }
                
                // 5. get the category unique id (newCatUID) for saved one
                String newCatUID = categoryV2.getUniqueId();
                logger.debug("Created category V2 with new ID: {}", newCatUID);
                
                // 6. fetch all questions id for an oldCatUID
                if (categoryV1.getQuestions() != null) {
                    for (CategoryV1.QuestionV1 questionV1 : categoryV1.getQuestions()) {
                        if (questionV1 == null || questionV1.getUniqueId() == null) {
                            logger.warn("Skipping question with null uniqueId");
                            continue;
                        }
                        
                        try {
                            CategoryV1.QuestionV1 qV1 = fetchQuestion(oldCatUID, questionV1.getUniqueId());
                            if (qV1 == null) {
                                logger.warn("Failed to fetch question details for ID: {}", questionV1.getUniqueId());
                                continue;
                            }
                            
                            QuestionV2 questionV2 = v1ToV2Mapper.convertToQuestion(qV1, newCatUID);
                            questionV2 = createQuestionV2(questionV2);
                            if (questionV2 == null || questionV2.getUniqueId() == null) {
                                logger.error("Failed to create question V2 for ID: {}", questionV1.getUniqueId());
                                continue;
                            }
                            
                            String newQuesUID = questionV2.getUniqueId();

                            if (qV1.getAnswers() != null) {
                                for (CategoryV1.QuestionV1.AnswerV1 answerV1 : qV1.getAnswers()) {
                                    if (answerV1 == null) {
                                        logger.warn("Skipping null answer");
                                        continue;
                                    }
                                    
                                    AnswerV2 answerV2 = v1ToV2Mapper.convertToAnswer(answerV1, newQuesUID);
                                    createAnswerV2(answerV2);
                                }
                            }
                        } catch (Exception e) {
                            logger.error("Error processing question {} for category {}", 
                                    questionV1.getUniqueId(), oldCatUID, e);
                            // Continue processing other questions
                        }
                    }
                }
                
                categoryV2s.add(categoryV2);
                logger.debug("Successfully migrated category {} to {}", oldCatUID, newCatUID);
                
            } catch (Exception e) {
                logger.error("Error processing category {}", cat.getUniqueId(), e);
                // Continue processing other categories
            }
        }
        
        logger.info("Completed category migration. Successfully migrated {} categories", categoryV2s.size());
        return categoryV2s;
    }

    private CategoryV1 fetchCategory(String uniqueId) {
        if (uniqueId == null || uniqueId.trim().isEmpty()) {
            throw new IllegalArgumentException("Category uniqueId cannot be null or empty");
        }
        
        String url = categoriesUrl + "/" + uniqueId;
        logger.debug("Fetching category details from URL: {}", url);
        
        try {
            ResponseEntity<CategoryV1> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );
            
            CategoryV1 category = response.getBody();
            if (category == null) {
                logger.warn("Received null response for category ID: {}", uniqueId);
            }
            return category;
        } catch (RestClientException e) {
            logger.error("Failed to fetch category {} from {}", uniqueId, url, e);
            throw e;
        }
    }

    private CategoryV1.QuestionV1 fetchQuestion(String oldCatUID, String uniqueId) {
        if (oldCatUID == null || oldCatUID.trim().isEmpty()) {
            throw new IllegalArgumentException("Category ID cannot be null or empty");
        }
        if (uniqueId == null || uniqueId.trim().isEmpty()) {
            throw new IllegalArgumentException("Question uniqueId cannot be null or empty");
        }
        
        String url = categoriesUrl + "/" + oldCatUID + "/questions/" + uniqueId;
        logger.debug("Fetching question details from URL: {}", url);
        
        try {
            ResponseEntity<CategoryV1.QuestionV1> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );
            
            CategoryV1.QuestionV1 question = response.getBody();
            if (question == null) {
                logger.warn("Received null response for question ID: {}", uniqueId);
            }
            return question;
        } catch (RestClientException e) {
            logger.error("Failed to fetch question {} from {}", uniqueId, url, e);
            throw e;
        }
    }

    private CategoryV2 createCategoryV2(CategoryV2 categoryV2) {
        if (categoryV2 == null) {
            throw new IllegalArgumentException("CategoryV2 cannot be null");
        }
        
        logger.debug("Creating category V2 at URL: {}", createCategoryUrl);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(AppConstants.CONTENT_TYPE, AppConstants.APPLICATION_JSON);
        HttpEntity<CategoryV2> requestEntity = new HttpEntity<>(categoryV2, headers);
        
        try {
            ResponseEntity<CategoryV2> response = restTemplate.exchange(
                    createCategoryUrl,
                    HttpMethod.POST,
                    requestEntity,
                    CategoryV2.class
            );
            
            CategoryV2 createdCategory = response.getBody();
            if (createdCategory == null) {
                logger.warn("Received null response when creating category");
            }
            return createdCategory;
        } catch (RestClientException e) {
            logger.error("Failed to create category V2 at {}", createCategoryUrl, e);
            throw e;
        }
    }

    private QuestionV2 createQuestionV2(QuestionV2 questionV2) {
        if (questionV2 == null) {
            throw new IllegalArgumentException("QuestionV2 cannot be null");
        }
        
        logger.debug("Creating question V2 at URL: {}", createQuestionUrl);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(AppConstants.CONTENT_TYPE, AppConstants.APPLICATION_JSON);
        HttpEntity<QuestionV2> requestEntity = new HttpEntity<>(questionV2, headers);
        
        try {
            ResponseEntity<QuestionV2> response = restTemplate.exchange(
                    createQuestionUrl,
                    HttpMethod.POST,
                    requestEntity,
                    QuestionV2.class
            );
            
            QuestionV2 createdQuestion = response.getBody();
            if (createdQuestion == null) {
                logger.warn("Received null response when creating question");
            }
            return createdQuestion;
        } catch (RestClientException e) {
            logger.error("Failed to create question V2 at {}", createQuestionUrl, e);
            throw e;
        }
    }

    private AnswerV2 createAnswerV2(AnswerV2 answerV2) {
        if (answerV2 == null) {
            throw new IllegalArgumentException("AnswerV2 cannot be null");
        }
        
        logger.debug("Creating answer V2 at URL: {}", createAnswerUrl);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(AppConstants.CONTENT_TYPE, AppConstants.APPLICATION_JSON);
        HttpEntity<AnswerV2> requestEntity = new HttpEntity<>(answerV2, headers);
        
        try {
            ResponseEntity<AnswerV2> response = restTemplate.exchange(
                    createAnswerUrl,
                    HttpMethod.POST,
                    requestEntity,
                    AnswerV2.class
            );
            
            AnswerV2 createdAnswer = response.getBody();
            if (createdAnswer == null) {
                logger.warn("Received null response when creating answer");
            }
            return createdAnswer;
        } catch (RestClientException e) {
            logger.error("Failed to create answer V2 at {}", createAnswerUrl, e);
            throw e;
        }
    }
}
