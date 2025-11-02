package com.p.search.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.p.search.api.pojo.CategoryV2;
import com.p.search.api.service.RestAPIInvokerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for example endpoints.
 * Provides endpoints for fetching example data, tags, and categories.
 */
@RestController
@RequestMapping("/api")
public class ExampleController {

    private static final Logger logger = LoggerFactory.getLogger(ExampleController.class);

    private final RestAPIInvokerService restAPIInvokerService;
    private final ObjectMapper objectMapper;

    public ExampleController(RestAPIInvokerService restAPIInvokerService, ObjectMapper objectMapper) {
        this.restAPIInvokerService = restAPIInvokerService;
        this.objectMapper = objectMapper;
    }

    /**
     * Fetches example data from external API.
     *
     * @return Example JSON string
     */
    @GetMapping("/example")
    public ResponseEntity<String> getExample() {
        logger.debug("Received request for /api/example");
        try {
            String result = restAPIInvokerService.getExample();
            logger.debug("Successfully retrieved example data");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching example data", e);
            throw e; // Exception will be handled by GlobalExceptionHandler
        }
    }

    /**
     * Fetches all tags from external API and returns formatted JSON.
     *
     * @return Pretty-printed JSON string of tags
     */
    @GetMapping("/all-tags")
    public ResponseEntity<String> getAllTags() {
        logger.debug("Received request for /api/all-tags");
        try {
            String allTagsStrResponse = restAPIInvokerService.getAllTags();
            
            if (allTagsStrResponse == null || allTagsStrResponse.trim().isEmpty()) {
                logger.warn("Received empty response from getAllTags");
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No tags found");
            }

            JsonNode node = objectMapper.readTree(allTagsStrResponse);
            logger.debug("Successfully formatted tags JSON");
            return ResponseEntity.ok(node.toPrettyString());

        } catch (JsonProcessingException e) {
            logger.error("Error processing JSON response for tags", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing tags: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching tags", e);
            throw e; // Exception will be handled by GlobalExceptionHandler
        }
    }

    /**
     * Migrates all categories from V1 to V2 format.
     * This endpoint triggers the migration process.
     *
     * @return List of migrated CategoryV2 objects
     */
    @GetMapping("/all-categories")
    public ResponseEntity<List<CategoryV2>> getAllCategory() {
        logger.info("Received request for /api/all-categories - starting migration");
        try {
            List<CategoryV2> categories = restAPIInvokerService.getAllCategory();
            logger.info("Successfully completed migration. Returned {} categories", categories.size());
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            logger.error("Error during category migration", e);
            throw e; // Exception will be handled by GlobalExceptionHandler
        }
    }
}
