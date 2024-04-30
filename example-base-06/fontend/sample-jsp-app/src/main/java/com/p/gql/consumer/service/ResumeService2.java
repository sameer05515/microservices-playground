package com.p.gql.consumer.service;

import org.springframework.graphql.client.HttpGraphQlClient;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.p.gql.consumer.model.Resume2;

import reactor.core.publisher.Mono;

@Service
public class ResumeService2 {

    private static final String GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

    // @Value("${graphql.endpoint}")
    // private String GRAPHQL_ENDPOINT;

    private final HttpGraphQlClient graphQlClient;

    public ResumeService2() {
        WebClient client = WebClient.builder()
                .baseUrl(GRAPHQL_ENDPOINT)
                .build();
        graphQlClient = HttpGraphQlClient.builder(client).build();
    }

    public Resume2 getResume(String uniqueId) {
        // String document = """
        // query {
        // getResume(uniqueId: %s) {
        // uniqueId
        // summary
        // introduction
        // processedDetails {
        // rawText
        // metadata
        // textType
        // }
        // }
        // }
        // """.formatted(uniqueId);

        String document = """
                query{
                    getResume(uniqueId:  "%s") {
                        uniqueId
                        summary
                        introduction
                        processedDetails {
                          rawText
                          metadata
                          textType
                        }
                      }
                }
                """.formatted(uniqueId);

        Mono<Resume2> countries = graphQlClient.document(document).retrieve("getResume").toEntity(Resume2.class);
        return countries.block();
    }
}
