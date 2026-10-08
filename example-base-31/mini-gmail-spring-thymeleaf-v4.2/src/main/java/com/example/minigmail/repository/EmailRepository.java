package com.example.minigmail.repository;

import com.example.minigmail.model.Email;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EmailRepository extends MongoRepository<Email, String> {

    Page<Email> findByToUserIdsContainingAndLabelsContainingAndDraftFalse(
            String userId, String label, Pageable pageable);

    Page<Email> findByFromUserIdAndLabelsContainingAndDraftFalse(
            String userId, String label, Pageable pageable);

    Page<Email> findByFromUserIdAndDraftTrue(String userId, Pageable pageable);

    long countByToUserIdsContainingAndLabelsContainingAndDraftFalseAndReadFalse(String userId, String label);
    long countByFromUserIdAndDraftTrue(String userId);
    long countByFromUserIdAndLabelsContainingAndDraftFalse(String userId, String label);
    long countByFromUserIdAndStarredTrueAndDraftFalse(String userId);
    long countByToUserIdsContainingAndStarredTrueAndDraftFalse(String userId);

    Optional<Email> findByIdAndFromUserId(String id, String userId);

    List<Email> findByThreadIdOrderByCreatedAtAsc(String threadId);
}
