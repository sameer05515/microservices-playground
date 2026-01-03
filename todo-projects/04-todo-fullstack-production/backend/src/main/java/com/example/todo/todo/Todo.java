package com.example.todo.todo;
import com.example.todo.auth.User;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="todos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Todo {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false, length=200) private String title;
  @Column(columnDefinition="TEXT") private String description;
  @Column(nullable=false) private boolean completed;
  @ManyToOne(fetch=FetchType.LAZY, optional=false) private User user;
  @Version private Long version;
}
