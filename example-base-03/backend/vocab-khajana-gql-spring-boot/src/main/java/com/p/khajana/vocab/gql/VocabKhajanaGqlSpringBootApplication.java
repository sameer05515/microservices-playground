package com.p.khajana.vocab.gql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.p.khajana.vocab.gql"})
public class VocabKhajanaGqlSpringBootApplication {

	public static void main(String[] args) {
		SpringApplication.run(VocabKhajanaGqlSpringBootApplication.class, args);
	}

}
