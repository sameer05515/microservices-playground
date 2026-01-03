package com.example.todo.todo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
@RestController @RequestMapping("/api/todos") @RequiredArgsConstructor
public class TodoController {
 private final TodoService service;
 @GetMapping public Page<TodoDtos.TodoResponse> list(Principal p,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="5") int size,@RequestParam(required=false) String search,@RequestParam(required=false) Boolean completed,@RequestParam(required=false) String sort){return service.list(p.getName(),search,completed,page,size,sort);}
 @PostMapping public TodoDtos.TodoResponse create(Principal p,@Valid @RequestBody TodoDtos.TodoRequest r){return service.create(p.getName(),r);}
 @PutMapping("/{id}") public TodoDtos.TodoResponse update(Principal p,@PathVariable Long id,@Valid @RequestBody TodoDtos.TodoRequest r){return service.update(p.getName(),id,r);}
 @PatchMapping("/{id}/complete") public TodoDtos.TodoResponse toggle(Principal p,@PathVariable Long id){return service.toggle(p.getName(),id);}
 @DeleteMapping("/{id}") public void delete(Principal p,@PathVariable Long id){service.delete(p.getName(),id);}
}
