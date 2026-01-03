package com.p.ques.controller;

import com.p.ques.dto.QuestionRequest;
import com.p.ques.model.Question;
import com.p.ques.service.QuestionService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService service;

    public QuestionController(
            QuestionService service) {

        this.service = service;
    }


    // =========================================
    // CREATE
    // =========================================

    @PostMapping
    public ResponseEntity<Question> create(
            @Valid @RequestBody QuestionRequest request) {

        Question question =
                service.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(question);
    }


    // =========================================
    // GET / SEARCH
    //
    // GET /api/questions
    // GET /api/questions?page=0&size=10
    // GET /api/questions?page=0&size=10&search=spring
    // =========================================

    @GetMapping
    public ResponseEntity<Page<Question>> getQuestions(

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "10"
            )
            int size,

            @RequestParam(
                    defaultValue = ""
            )
            String search) {


        // Protect API from invalid values

        if (page < 0) {
            page = 0;
        }

        if (size < 1) {
            size = 10;
        }

        // Maximum page size

        if (size > 100) {
            size = 100;
        }


        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                Sort.Direction.DESC,
                                "_id"
                        )
                );


        Page<Question> result =
                service.search(
                        search,
                        pageable
                );


        return ResponseEntity.ok(result);
    }


    // =========================================
    // GET BY ID
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<Question> getById(
            @PathVariable String id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    // =========================================
    // UPDATE
    // =========================================

    @PutMapping("/{id}")
    public ResponseEntity<Question> update(
            @PathVariable String id,
            @Valid @RequestBody QuestionRequest request) {

        return ResponseEntity.ok(
                service.update(
                        id,
                        request
                )
        );
    }


    // =========================================
    // DELETE
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}