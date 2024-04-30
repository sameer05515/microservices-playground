package com.p.khajana.vocab.gql.word.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@ToString
@Document(collection = "words")
public class Word {
    @Id
    private String id;
    private String uniqueId;
    private String word;
    private List<String> meanings;
    private List<String> examples;
    private List<String> synonyms;
    private List<String> antonyms;
    private String pronunciation;
    private String origin;
    private String createdAt;
    private String updatedAt;
}
