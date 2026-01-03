package com.p.backend.repository;

import com.p.backend.entity.Directory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
@TestPropertySource(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017/test_db"
})
class DirectoryRepositoryTest {

    @Autowired
    private DirectoryRepository directoryRepository;

    @Test
    void testSaveAndFindById() {
        // Given
        Directory directory = Directory.builder()
                .name("Test Directory")
                .description("Test Description")
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        // When
        Directory saved = directoryRepository.save(directory);
        Optional<Directory> found = directoryRepository.findByIdAndDeletedFalse(saved.getId());

        // Then
        assertTrue(found.isPresent());
        assertEquals("Test Directory", found.get().getName());
    }

    @Test
    void testFindRootDirectories() {
        // Given
        Directory root1 = Directory.builder()
                .name("Root 1")
                .parentId(null)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        Directory root2 = Directory.builder()
                .name("Root 2")
                .parentId(null)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        directoryRepository.save(root1);
        directoryRepository.save(root2);

        // When
        List<Directory> roots = directoryRepository.findByParentIdIsNullAndDeletedFalse();

        // Then
        assertTrue(roots.size() >= 2);
    }

    @Test
    void testFindByParentId() {
        // Given
        Directory parent = Directory.builder()
                .name("Parent")
                .parentId(null)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();
        Directory savedParent = directoryRepository.save(parent);

        Directory child = Directory.builder()
                .name("Child")
                .parentId(savedParent.getId())
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();
        directoryRepository.save(child);

        // When
        List<Directory> children = directoryRepository.findByParentIdAndDeletedFalse(savedParent.getId());

        // Then
        assertTrue(children.size() >= 1);
        assertEquals("Child", children.get(0).getName());
    }
}

