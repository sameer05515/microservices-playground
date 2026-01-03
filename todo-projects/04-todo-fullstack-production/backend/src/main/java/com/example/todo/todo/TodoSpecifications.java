package com.example.todo.todo;
import org.springframework.data.jpa.domain.Specification;
public final class TodoSpecifications {
  private TodoSpecifications(){}
  public static Specification<Todo> belongsTo(Long userId){ return (r,q,c)->c.equal(r.get("user").get("id"),userId); }
  public static Specification<Todo> search(String search){
    return (r,q,c)-> search==null || search.isBlank() ? c.conjunction() :
      c.or(c.like(c.lower(r.get("title")), "%"+search.toLowerCase()+"%"),
           c.like(c.lower(r.get("description")), "%"+search.toLowerCase()+"%"));
  }
  public static Specification<Todo> completed(Boolean completed){
    return (r,q,c)-> completed==null ? c.conjunction() : c.equal(r.get("completed"),completed);
  }
}
