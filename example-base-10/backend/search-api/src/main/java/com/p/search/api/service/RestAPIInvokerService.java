package com.p.search.api.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RestAPIInvokerService {

    private final RestTemplate restTemplate;

    public RestAPIInvokerService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getExample() {
        String url = "https://jsonplaceholder.typicode.com/posts/1";
        return restTemplate.getForObject(url, String.class);
    }

    public String getAllTags(){
        String url="http://127.0.0.1:3003/tags";
        return restTemplate.getForObject(url, String.class);
    }
}
