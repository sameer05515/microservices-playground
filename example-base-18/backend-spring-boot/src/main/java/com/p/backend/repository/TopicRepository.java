package com.p.backend.repository;

import com.p.backend.entity.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends MongoRepository<Topic, String> {
    
    // Find topics by directory
    List<Topic> findByDirectoryIdAndDeletedFalse(String directoryId);
    
    // Find topic by ID (non-deleted)
    Optional<Topic> findByIdAndDeletedFalse(String id);
    
    // Count topics in a directory
    long countByDirectoryIdAndDeletedFalse(String directoryId);
    
    // Search topics by title (case-insensitive)
    @Query("{ 'title': { $regex: ?0, $options: 'i' }, 'deleted': false }")
    List<Topic> searchByTitle(String titlePattern);
    
    // Find all non-deleted topics
    List<Topic> findByDeletedFalse();
}

