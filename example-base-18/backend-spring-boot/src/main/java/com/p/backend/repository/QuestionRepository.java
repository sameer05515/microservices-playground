package com.p.backend.repository;

import com.p.backend.entity.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    
    // Find questions by directory
    List<Question> findByDirectoryIdAndDeletedFalse(String directoryId);
    
    // Find questions by topic
    List<Question> findByTopicIdAndDeletedFalse(String topicId);
    
    // Find questions by parent (directory or topic)
    List<Question> findByParentIdAndDeletedFalse(String parentId);
    
    // Find questions by parent type
    List<Question> findByParentTypeAndParentIdAndDeletedFalse(String parentType, String parentId);
    
    // Find question by ID (non-deleted)
    Optional<Question> findByIdAndDeletedFalse(String id);
    
    // Count questions by parent
    long countByParentIdAndDeletedFalse(String parentId);
    
    // Count questions by directory
    long countByDirectoryIdAndDeletedFalse(String directoryId);
    
    // Count questions by topic
    long countByTopicIdAndDeletedFalse(String topicId);
    
    // Search questions by question text (case-insensitive)
    @Query("{ 'questionText': { $regex: ?0, $options: 'i' }, 'deleted': false }")
    List<Question> searchByQuestionText(String questionTextPattern);
    
    // Search questions by answer (case-insensitive)
    @Query("{ 'answer': { $regex: ?0, $options: 'i' }, 'deleted': false }")
    List<Question> searchByAnswer(String answerPattern);
    
    // Find all non-deleted questions
    List<Question> findByDeletedFalse();
}

