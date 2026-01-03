package com.example.auth;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="users")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false,unique=true,length=100) private String username;
  @Column(nullable=false) private String password;
  @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Role role;
}
