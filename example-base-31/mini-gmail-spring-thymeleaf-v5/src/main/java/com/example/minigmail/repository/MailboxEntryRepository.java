package com.example.minigmail.repository;

import com.example.minigmail.model.MailboxEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface MailboxEntryRepository extends MongoRepository<MailboxEntry,String> {
    Page<MailboxEntry> findByUserIdAndFolder(String userId, String folder, Pageable pageable);
    Page<MailboxEntry> findByUserIdAndStarredTrue(Pageable pageable);
    Page<MailboxEntry> findByUserIdAndImportantTrue(Pageable pageable);
    long countByUserIdAndFolderAndReadFalse(String userId, String folder);
    long countByUserIdAndStarredTrue(String userId);
    Optional<MailboxEntry> findByEmailIdAndUserId(String emailId, String userId);
    boolean existsByEmailIdAndUserId(String emailId, String userId);
    void deleteByEmailId(String emailId);
}
