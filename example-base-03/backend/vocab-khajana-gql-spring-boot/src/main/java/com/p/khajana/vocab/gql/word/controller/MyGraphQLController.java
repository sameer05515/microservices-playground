package com.p.khajana.vocab.gql.word.controller;


import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class MyGraphQLController {

    @QueryMapping
    public Integer add(@Argument int a, @Argument int b) {
        return a + b;
    }

    @QueryMapping
    public String greet(@Argument String name) {
        return "Hello " + name;
    }
    
    @MutationMapping
    public Integer multiply(@Argument int a, @Argument int b) {
        return a * b;
    }
}
