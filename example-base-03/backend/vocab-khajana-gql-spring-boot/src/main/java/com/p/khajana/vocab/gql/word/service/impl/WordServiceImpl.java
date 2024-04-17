package com.p.khajana.vocab.gql.word.service.impl;

import com.p.khajana.vocab.gql.util.UniqueIdGenerator;
import com.p.khajana.vocab.gql.word.model.Word;
import com.p.khajana.vocab.gql.word.repository.WordRepository;
import com.p.khajana.vocab.gql.word.service.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class WordServiceImpl implements WordService {

    @Autowired
    private UniqueIdGenerator uniqueIdGenerator;

    @Autowired
    private WordRepository wordRepository;

    @Override
    public Iterable<Word> getAllWords() {
        return wordRepository.findAll();
    }

    @Override
    public Word getWordById(String id) {
        return wordRepository.findByUniqueId(id).orElse(null);
    }

//    @Override
//    public Word createWord(Word word) {
//        return wordRepository.save(
//                Word.builder()
//                        .word(word.getWord())
//                        .meanings(word.getMeanings())
//                        .synonyms(word.getSynonyms())
//                        .antonyms(word.getAntonyms())
//                        .examples(word.getExamples())
//                        .origin(word.getOrigin())
//                        .pronunciation(word.getPronunciation())
//                        .uniqueId(uniqueIdGenerator.generateUniqueId(UniqueIdGenerator.PREFIXES.WORD))
//                        .build()
//        );
//    }

    public Word upsertWord(Word word) {
        // Check if a word with the given uniqueId already exists
        Optional<Word> existingWordOptional = wordRepository.findByUniqueId(word.getUniqueId());

        if (existingWordOptional.isPresent()) {
            // Update existing word
            Word existingWord = existingWordOptional.get();
            existingWord.setWord(word.getWord() != null ? word.getWord() : existingWord.getWord());
            existingWord.setMeanings(word.getMeanings() != null ? word.getMeanings() : existingWord.getMeanings());
            existingWord.setExamples(word.getExamples() != null ? word.getExamples() : existingWord.getExamples());

            existingWord.setSynonyms(word.getSynonyms() != null ? word.getSynonyms() : existingWord.getSynonyms());
            existingWord.setAntonyms(word.getAntonyms() != null ? word.getAntonyms() : existingWord.getAntonyms());
            existingWord.setOrigin(word.getOrigin() != null ? word.getOrigin() : existingWord.getOrigin());
            existingWord.setPronunciation(word.getPronunciation() != null ? word.getPronunciation() : existingWord.getPronunciation());
            // You can update other fields here if needed

            return wordRepository.save(existingWord);
        } else {
            // Save new word
            return wordRepository.save(
                    Word.builder()
                            .word(word.getWord())
                            .meanings(word.getMeanings())
                            .synonyms(word.getSynonyms())
                            .antonyms(word.getAntonyms())
                            .examples(word.getExamples())
                            .origin(word.getOrigin())
                            .pronunciation(word.getPronunciation())
                            .uniqueId(uniqueIdGenerator.generateUniqueId(UniqueIdGenerator.PREFIXES.WORD))
                            .build()
            );
        }
    }

//    @Override
//    public Word updateWord(Word build) {
//        wordRepository.findByUniqueId(build.getUniqueId()).map(w-> Word.builder()
//                .id(w.getId())
//                .word(build.getWord())
//                .uniqueId(uniqueIdGenerator.generateUniqueId(UniqueIdGenerator.PREFIXES.WORD))
//                .build())
//        return ;
//    }

    @Override
    public Boolean deleteWord(String id) {
        return true;
    }
}
