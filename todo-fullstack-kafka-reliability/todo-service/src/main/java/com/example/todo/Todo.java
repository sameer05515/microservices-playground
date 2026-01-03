package com.example.todo;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="todos")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Todo{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @Column(nullable=false,length=200) String title;
 @Column(columnDefinition="TEXT") String description;
 @Column(nullable=false) boolean completed;
 @Column(nullable=false) Long userId;
 @Version Long version;
}
