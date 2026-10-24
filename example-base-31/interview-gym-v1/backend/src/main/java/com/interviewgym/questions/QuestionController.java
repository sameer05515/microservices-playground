package com.interviewgym.questions;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/questions")
public class QuestionController {
 private final QuestionService service;
 public QuestionController(QuestionService service){this.service=service;}
 @GetMapping public List<Question> list(@RequestParam(required=false) String category,@RequestParam(required=false) String search){return service.list(category,search);}
 @GetMapping("/{id}") public ResponseEntity<Question> get(@PathVariable String id){return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());}
 @PostMapping public ResponseEntity<?> create(@RequestBody Question q){try{return ResponseEntity.status(201).body(service.save(q));}catch(IllegalArgumentException e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
 @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable String id,@RequestBody Question q){try{return ResponseEntity.ok(service.save(new Question(id,q.category(),q.topic(),q.difficulty(),q.question(),q.answer(),q.tags())));}catch(IllegalArgumentException e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable String id){return service.delete(id)?ResponseEntity.noContent().build():ResponseEntity.notFound().build();}
 @GetMapping("/export") public List<Question> export(){return service.all();}
 @PostMapping("/import") public ResponseEntity<?> importQuestions(@RequestBody List<Question> q){try{return ResponseEntity.ok(Map.of("imported",service.replace(q).size()));}catch(IllegalArgumentException e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}}
}
