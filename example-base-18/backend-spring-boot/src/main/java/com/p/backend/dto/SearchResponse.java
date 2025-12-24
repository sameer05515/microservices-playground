package com.p.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResponse {
    @Builder.Default
    private List<DirectoryResponse> directories = new ArrayList<>();
    
    @Builder.Default
    private List<TopicResponse> topics = new ArrayList<>();
    
    @Builder.Default
    private List<QuestionResponse> questions = new ArrayList<>();
}

