package com.p.khajana.vocab.gql.word.controller;

import com.p.khajana.vocab.gql.util.UniqueIdGenerator;
import com.p.khajana.vocab.gql.word.model.Word;
import com.p.khajana.vocab.gql.word.service.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.Arrays;


@Controller
public class WordController {

    @Autowired
    private WordService wordService;

    @Autowired
    private UniqueIdGenerator uniqueIdGenerator;

    @QueryMapping
    public Iterable<Word> allWords() {
        return wordService.getAllWords();
    }

    @QueryMapping
    public Word word(@Argument String id) {
        return wordService.getWordById(id);
    }

    @MutationMapping
    public Word createWord(@Argument Word input) {
        // Implement the logic to create a word
        return wordService.upsertWord(input);
    }

    @MutationMapping
    public Word updateWord(@Argument Word input) {
        return wordService.upsertWord(input);
    }

    @MutationMapping
    public Boolean deleteWord(@Argument String id) {
        return wordService.deleteWord(id);
    }
}
