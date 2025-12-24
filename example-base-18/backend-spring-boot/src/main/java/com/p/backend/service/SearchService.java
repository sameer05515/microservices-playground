package com.p.backend.service;

import com.p.backend.dto.DirectoryResponse;
import com.p.backend.dto.SearchResponse;
import com.p.backend.dto.TopicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final DirectoryService directoryService;
    private final TopicService topicService;

    public SearchResponse searchAll(String query) {
        SearchResponse response = SearchResponse.builder().build();
        
        if (query != null && !query.trim().isEmpty()) {
            response.setDirectories(directoryService.searchDirectories(query));
            response.setTopics(topicService.searchTopics(query));
        }
        
        return response;
    }
}

