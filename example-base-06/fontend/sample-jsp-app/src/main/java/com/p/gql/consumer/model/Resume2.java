package com.p.gql.consumer.model;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resume2 {
    private String uniqueId;
    private String introduction;
    private String summary;
    private ProcessedDetails processedDetails;
}


@Data
@NoArgsConstructor
@AllArgsConstructor
class ProcessedDetails {
    private String rawText;
    private String textType;
    private Map<String, Object> metadata;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class Project {
    private String uniqueId;
    private String name;
    private String details;
    private ProcessedDetails processedDetails;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class Company {
    private String uniqueId;
    private String name;
    private String details;
    private ProcessedDetails processedDetails;
    private List<Project> projects;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class Education {
    private String uniqueId;
    private String name;
    private String details;
    private ProcessedDetails processedDetails;
}


