package com.p.khajana.vocab.gql.word.service;

import com.p.khajana.vocab.gql.word.model.Word;

public interface WordService {
    Iterable<Word> getAllWords();

    Word getWordById(String id);

    Word upsertWord(Word word);

//    Word updateWord(Word build);

    Boolean deleteWord(String id);
}
