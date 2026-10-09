package com.example.minigmail.repository;

import com.example.minigmail.model.Email;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface EmailRepository extends MongoRepository<Email,String> {
    Optional<Email> findByIdAndFromUserId(String id, String userId);
    List<Email> findByThreadIdOrderByCreatedAtAsc(String threadId);
    long countByFromUserIdAndDraftTrue(String userId);
}
