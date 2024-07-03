package com.p.search.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.p.search.api.service.RestAPIInvokerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ExampleController {

    private final RestAPIInvokerService restAPIInvokerService;

    public ExampleController(RestAPIInvokerService restAPIInvokerService) {
        this.restAPIInvokerService = restAPIInvokerService;
    }

    @GetMapping("/example")
    public String getExample() {
        return restAPIInvokerService.getExample();
    }

    @GetMapping("/all-tags")
    public String getAllTags() {
        try {
            String allTagsStrResponse = restAPIInvokerService.getAllTags();

            // Jackson main object
            ObjectMapper mapper = new ObjectMapper();

            // read the json strings and convert it into JsonNode
            JsonNode node = mapper.readTree(allTagsStrResponse);

            return node.toPrettyString();

        } catch (JsonProcessingException jpe) {
            return jpe.getMessage();
        }

    }
}
