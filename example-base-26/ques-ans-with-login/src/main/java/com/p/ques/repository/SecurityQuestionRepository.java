package com.p.ques.repository;

import com.p.ques.entity.SecurityQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SecurityQuestionRepository extends MongoRepository<SecurityQuestion, String> {
}
