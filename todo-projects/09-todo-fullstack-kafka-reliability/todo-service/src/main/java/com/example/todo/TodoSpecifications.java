package com.example.todo;
import org.springframework.data.jpa.domain.Specification;
public final class TodoSpecifications{
 private TodoSpecifications(){}
 public static Specification<Todo> user(Long id){return (r,q,c)->c.equal(r.get("userId"),id);}
 public static Specification<Todo> search(String s){return (r,q,c)->s==null||s.isBlank()?c.conjunction():c.or(c.like(c.lower(r.get("title")),"%"+s.toLowerCase()+"%"),c.like(c.lower(r.get("description")),"%"+s.toLowerCase()+"%"));}
 public static Specification<Todo> completed(Boolean b){return (r,q,c)->b==null?c.conjunction():c.equal(r.get("completed"),b);}
}
