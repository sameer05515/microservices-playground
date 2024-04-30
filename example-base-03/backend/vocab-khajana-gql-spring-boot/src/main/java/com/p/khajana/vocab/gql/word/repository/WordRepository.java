package com.p.khajana.vocab.gql.word.repository;

import com.p.khajana.vocab.gql.word.model.Word;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

// WordRepository.java
public interface WordRepository extends MongoRepository<Word, String> {
    Optional<Word> findByUniqueId(String uniqueId);
}