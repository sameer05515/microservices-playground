package com.p.search.api.config;

public class AppConstants {
    
    private AppConstants() {
        // Utility class - prevent instantiation
    }

    // HTTP Headers
    public static final String CONTENT_TYPE = "Content-Type";
    public static final String APPLICATION_JSON = "application/json";

    // Default Values
    public static final String DEFAULT_SOURCE_DB = "interview_mgmt";
    public static final String DEFAULT_TEXT_OUTPUT_TYPE = "html";
    public static final String DEFAULT_TEXT_INPUT_TYPE = "CKEditor";
    public static final String DEFAULT_CONTENT_PREFIX = "HEADING_";
    public static final String DEFAULT_PREFIX = "DEFAULT_PREFIX_";
    public static final String DEFAULT_CONTENT = "<h1> default content. Replace it with meaningful content</h1>";

    // Content Limits
    public static final int CATEGORY_NAME_WORD_LIMIT = 10;
    public static final int QUESTION_NAME_WORD_LIMIT = 10;
    public static final int ANSWER_NAME_WORD_LIMIT = 15;
    public static final int ANSWER_HEADING_WORD_LIMIT = 10;
}

