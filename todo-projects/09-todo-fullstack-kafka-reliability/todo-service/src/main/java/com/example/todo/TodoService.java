package com.example.todo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class TodoService{
 private final TodoRepository repo; private final KafkaTodoPublisher events;
 @Transactional(readOnly=true)
 public Page<TodoDtos.TodoResponse> list(String username,String search,Boolean completed,int page,int size,String sort){
   long userId=Long.parseLong(username);
   Sort s="title".equalsIgnoreCase(sort)?Sort.by("title"):Sort.by("id").descending();
   Pageable p=PageRequest.of(Math.max(0,page),Math.min(Math.max(size,1),50),s);
   Specification<Todo> spec=Specification.allOf(TodoSpecifications.user(userId),TodoSpecifications.search(search),TodoSpecifications.completed(completed));
   return repo.findAll(spec,p).map(TodoDtos::out);
 }
 @Transactional public TodoDtos.TodoResponse create(String username,TodoDtos.TodoRequest r){
   long uid=Long.parseLong(username);
   Todo t=repo.save(Todo.builder().title(r.title()).description(r.description()).completed(Boolean.TRUE.equals(r.completed())).userId(uid).version(0L).build());
   events.enqueue("TODO_CREATED",t,username); return TodoDtos.out(t);
 }
 @Transactional public TodoDtos.TodoResponse update(String username,Long id,TodoDtos.TodoRequest r){
   Todo t=owned(username,id);t.setTitle(r.title());t.setDescription(r.description());if(r.completed()!=null)t.setCompleted(r.completed());
   events.enqueue("TODO_UPDATED",t,username);return TodoDtos.out(t);
 }
 @Transactional public TodoDtos.TodoResponse toggle(String username,Long id){
   Todo t=owned(username,id);t.setCompleted(!t.isCompleted());events.enqueue("TODO_COMPLETED_CHANGED",t,username);return TodoDtos.out(t);
 }
 @Transactional public void delete(String username,Long id){Todo t=owned(username,id);repo.delete(t);events.enqueue("TODO_DELETED",t,username);}
 private Todo owned(String username,Long id){return repo.findOne(Specification.allOf(TodoSpecifications.user(Long.parseLong(username)),(r,q,c)->c.equal(r.get("id"),id))).orElseThrow();}
}
