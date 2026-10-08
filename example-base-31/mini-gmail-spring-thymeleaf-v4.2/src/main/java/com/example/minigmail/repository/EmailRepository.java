package com.example.minigmail.repository;

import com.example.minigmail.model.Email;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmailRepository extends MongoRepository<Email, String> {

    Page<Email> findByToUserIdsContainingAndLabelsContainingAndDraftFalse(
            String userId, String label, Pageable pageable);

    Page<Email> findByFromUserIdAndLabelsContainingAndDraftFalse(
            String userId, String label, Pageable pageable);

    Page<Email> findByFromUserIdAndDraftTrue(Pageable pageable);

    @Query("{ '$or': [ { 'fromUserId': ?0 }, { 'toUserIds': ?0 }, { 'ccUserIds': ?0 }, { 'bccUserIds': ?0 } ] }")
    Page<Email> findVisible(String userId, Pageable pageable);

    @Query("{ '$and': [ { '$or': [ { 'fromUserId': ?0 }, { 'toUserIds': ?0 }, { 'ccUserIds': ?0 }, { 'bccUserIds': ?0 } ] }, { 'labels': ?1 } ] }")
    Page<Email> findVisibleByLabel(String userId, String label, Pageable pageable);

    @Query("{ '$and': [ { '$or': [ { 'fromUserId': ?0 }, { 'toUserIds': ?0 }, { 'ccUserIds': ?0 }, { 'bccUserIds': ?0 } ] }, { 'labels': { '$ne': 'TRASH' } }, { 'draft': false }, { '$or': [ { 'subject': { '$regex': ?1, '$options': 'i' } }, { 'body': { '$regex': ?1, '$options': 'i' } } ] } ] }")
    Page<Email> searchVisible(String userId, String q, Pageable pageable);

    long countByToUserIdsContainingAndLabelsContainingAndDraftFalseAndReadFalse(String userId, String label);
    long countByFromUserIdAndDraftTrue(String userId);
    long countByFromUserIdAndLabelsContainingAndDraftFalse(String userId, String label);
    long countByFromUserIdAndStarredTrueAndDraftFalse(String userId);
    long countByToUserIdsContainingAndStarredTrueAndDraftFalse(String userId);

    Optional<Email> findByIdAndFromUserId(String id, String userId);

    @Query("{ '$and': [ { '_id': ?0 }, { '$or': [ { 'fromUserId': ?1 }, { 'toUserIds': ?1 }, { 'ccUserIds': ?1 }, { 'bccUserIds': ?1 } ] } ] }")
    Optional<Email> findVisibleById(String id, String userId);

    List<Email> findByThreadIdOrderByCreatedAtAsc(String threadId);
}
