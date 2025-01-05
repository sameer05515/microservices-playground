package com.p.search.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.p.search.api.pojo.CategoryV2;
import com.p.search.api.service.RestAPIInvokerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

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

    @GetMapping("/all-categories")
    public List<CategoryV2> getAllCategory() {
        try {
//            List<CategoryV2> categories = restAPIInvokerService.getAllCategory();
//            return categories;
            return new ArrayList<>();
        } catch (Exception jpe) {
            throw jpe;
        }

    }
}
