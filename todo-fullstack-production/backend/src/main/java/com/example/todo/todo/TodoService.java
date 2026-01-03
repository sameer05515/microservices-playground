package com.example.todo.todo;
import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class TodoService {
 private final TodoRepository todos; private final UserRepository users;
 private User user(String username){return users.findByUsername(username).orElseThrow();}
 @Transactional(readOnly=true) public Page<TodoDtos.TodoResponse> list(String username,String search,Boolean completed,int page,int size,String sort){
   Sort s=sort!=null && sort.equalsIgnoreCase("title")?Sort.by("title"):Sort.by("id").descending();
   Pageable p=PageRequest.of(Math.max(0,page),Math.min(Math.max(size,1),50),s);
   Specification<Todo> spec=Specification.allOf(TodoSpecifications.belongsTo(user(username).getId()),TodoSpecifications.search(search),TodoSpecifications.completed(completed));
   return todos.findAll(spec,p).map(TodoDtos::out);
 }
 @Transactional public TodoDtos.TodoResponse create(String username,TodoDtos.TodoRequest r){ Todo t=Todo.builder().title(r.title()).description(r.description()).completed(Boolean.TRUE.equals(r.completed())).user(user(username)).build(); return TodoDtos.out(todos.save(t));}
 @Transactional public TodoDtos.TodoResponse update(String username,Long id,TodoDtos.TodoRequest r){ Todo t=owned(username,id); t.setTitle(r.title());t.setDescription(r.description()); if(r.completed()!=null)t.setCompleted(r.completed()); return TodoDtos.out(t);}
 @Transactional public TodoDtos.TodoResponse toggle(String username,Long id){Todo t=owned(username,id);t.setCompleted(!t.isCompleted());return TodoDtos.out(t);}
 @Transactional public void delete(String username,Long id){todos.delete(owned(username,id));}
 private Todo owned(String username,Long id){return todos.findOne(Specification.allOf(TodoSpecifications.belongsTo(user(username).getId()),(r,q,c)->c.equal(r.get("id"),id))).orElseThrow();}
}
