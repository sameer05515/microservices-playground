package com.p.ques.service;

import com.p.ques.dto.TagRequest;
import com.p.ques.exception.ResourceNotFoundException;
import com.p.ques.model.Tag;
import com.p.ques.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository repository;

    public TagService(TagRepository repository) {
        this.repository = repository;
    }

    public Tag create(TagRequest request) {

        String name = request.getName().trim();

        if (repository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException(
                    "Tag already exists: " + name
            );
        }

        Tag tag = new Tag();
        tag.setName(name);

        return repository.save(tag);
    }

    public List<Tag> getAll() {
        return repository.findAll();
    }

    public Tag getById(String id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tag not found with id: " + id
                        )
                );
    }

    public Tag update(String id, TagRequest request) {

        Tag tag = getById(id);

        String name = request.getName().trim();

        repository.findByNameIgnoreCase(name)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "Tag already exists: " + name
                    );
                });

        tag.setName(name);

        return repository.save(tag);
    }

    public void delete(String id) {
        Tag tag = getById(id);
        repository.delete(tag);
    }
}