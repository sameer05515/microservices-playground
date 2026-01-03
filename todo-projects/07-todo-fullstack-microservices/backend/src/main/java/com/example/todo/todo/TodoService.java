package com.example.todo.todo;

import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import com.example.todo.config.RedisDistributedLock;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class TodoService {
 private final TodoRepository todos; private final UserRepository users; private final TodoCacheService cache; private final RedisDistributedLock lock;
 private User user(String username){return users.findByUsername(username).orElseThrow();}
 @Transactional(readOnly=true) public TodoPageResponse list(String username,String search,Boolean completed,int page,int size,String sort){
   TodoPageResponse cached=cache.get(username,search,completed,page,size,sort); if(cached!=null)return cached;
   Sort s=sort!=null&&sort.equalsIgnoreCase("title")?Sort.by("title"):Sort.by("id").descending();
   Pageable p=PageRequest.of(Math.max(0,page),Math.min(Math.max(size,1),50),s);
   Specification<Todo> spec=Specification.allOf(TodoSpecifications.belongsTo(user(username).getId()),TodoSpecifications.search(search),TodoSpecifications.completed(completed));
   TodoPageResponse result=TodoPageResponse.from(todos.findAll(spec,p).map(TodoDtos::out)); cache.put(username,search,completed,page,size,sort,result); return result;
 }
 @Transactional public TodoDtos.TodoResponse create(String username,TodoDtos.TodoRequest r){return locked(username,()->{Todo t=Todo.builder().title(r.title()).description(r.description()).completed(Boolean.TRUE.equals(r.completed())).user(user(username)).build();TodoDtos.TodoResponse out=TodoDtos.out(todos.save(t));cache.invalidateUser(username);return out;});}
 @Transactional public TodoDtos.TodoResponse update(String username,Long id,TodoDtos.TodoRequest r){return locked(username,()->{Todo t=owned(username,id);t.setTitle(r.title());t.setDescription(r.description());if(r.completed()!=null)t.setCompleted(r.completed());TodoDtos.TodoResponse out=TodoDtos.out(t);cache.invalidateUser(username);return out;});}
 @Transactional public TodoDtos.TodoResponse toggle(String username,Long id){return locked(username,()->{Todo t=owned(username,id);t.setCompleted(!t.isCompleted());TodoDtos.TodoResponse out=TodoDtos.out(t);cache.invalidateUser(username);return out;});}
 @Transactional public void delete(String username,Long id){locked(username,()->{todos.delete(owned(username,id));cache.invalidateUser(username);return null;});}
 private Todo owned(String username,Long id){return todos.findOne(Specification.allOf(TodoSpecifications.belongsTo(user(username).getId()),(r,q,c)->c.equal(r.get("id"),id))).orElseThrow();}
 private <T>T locked(String username,java.util.function.Supplier<T> work){RedisDistributedLock.LockHandle h=lock.tryLock("todo:user:"+username);if(h==null)throw new IllegalStateException("Another Todo operation is in progress. Please retry.");try{return work.get();}finally{lock.unlock(h);}}
}
