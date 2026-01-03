package com.p.backend.repository;

import com.p.backend.entity.Directory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DirectoryRepository extends MongoRepository<Directory, String> {
    
    // Find root directories (no parent)
    List<Directory> findByParentIdIsNullAndDeletedFalse();
    
    // Find directories by parent
    List<Directory> findByParentIdAndDeletedFalse(String parentId);
    
    // Find directory by name and parent (for uniqueness check)
    Optional<Directory> findByNameAndParentIdAndDeletedFalse(String name, String parentId);
    
    // Find root directory by name
    Optional<Directory> findByNameAndParentIdIsNullAndDeletedFalse(String name);
    
    // Search directories by name (case-insensitive)
    @Query("{ 'name': { $regex: ?0, $options: 'i' }, 'deleted': false }")
    List<Directory> searchByName(String namePattern);
    
    // Find all non-deleted directories
    List<Directory> findByDeletedFalse();
    
    // Find directory by ID (non-deleted)
    Optional<Directory> findByIdAndDeletedFalse(String id);
    
    // Count sub-directories
    long countByParentIdAndDeletedFalse(String parentId);
}

