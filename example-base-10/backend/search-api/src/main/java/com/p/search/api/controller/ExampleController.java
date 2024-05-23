package com.p.search.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.p.search.api.service.RestClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ExampleController {

    private final RestClient restClient;

    public ExampleController(RestClient restClient) {
        this.restClient = restClient;
    }

    @GetMapping("/example")
    public String getExample() {
        return restClient.getExample();
    }

    @GetMapping("/all-tags")
    public String getAllTags() {
        try {
            String allTagsStrResponse = restClient.getAllTags();

            // Jackson main object
            ObjectMapper mapper = new ObjectMapper();

            // read the json strings and convert it into JsonNode
            JsonNode node = mapper.readTree(allTagsStrResponse);

            return node.toPrettyString();
//            if(node!=null && node.getNodeType()== JsonNodeType.ARRAY){
//                (Json)
//            }
//            return "Prem NodeType:- "+node.getNodeType().name();

        } catch (JsonProcessingException jpe) {
            return jpe.getMessage();
        }

    }
}
