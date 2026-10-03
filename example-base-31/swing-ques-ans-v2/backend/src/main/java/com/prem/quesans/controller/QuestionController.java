package com.prem.quesans.controller;

import com.prem.quesans.model.Question;
import com.prem.quesans.repository.QuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {
    private final QuestionRepository repository;

    public QuestionController(QuestionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Question> findAll() throws IOException {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> findById(@PathVariable long id) throws IOException {
        Question q = repository.findById(id);
        return q == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(q);
    }

    @PostMapping
    public ResponseEntity<Question> create(@RequestBody Question q) throws IOException {
        q.setId(0);
        return ResponseEntity.ok(repository.save(q));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> update(
            @PathVariable long id,
            @RequestBody Question q) throws IOException {
        if (repository.findById(id) == null) return ResponseEntity.notFound().build();
        q.setId(id);
        return ResponseEntity.ok(repository.save(q));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) throws IOException {
        return repository.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
