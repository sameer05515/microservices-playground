package com.p.gql.consumer.service;

import org.springframework.graphql.client.HttpGraphQlClient;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.p.gql.consumer.model.Resume;

import reactor.core.publisher.Mono;

@Service
public class ResumeService {

    private static final String GRAPHQL_ENDPOINT = "http://localhost:3000/graphql";

    // @Value("${graphql.endpoint}")
    // private String GRAPHQL_ENDPOINT;

    private final HttpGraphQlClient graphQlClient;

    public ResumeService() {
        WebClient client = WebClient.builder()
                .baseUrl(GRAPHQL_ENDPOINT)
                .build();
        graphQlClient = HttpGraphQlClient.builder(client).build();
    }

    public Resume getResume(int id) {
        String document = """
                query {
                    getResume(id: %d) {
                        id
                        name
                        title
                        experience
                        skills
                      }
                }
                """.formatted(id);

        Mono<Resume> countries = graphQlClient.document(document).retrieve("getResume").toEntity(Resume.class);
        return countries.block();
    }
}
