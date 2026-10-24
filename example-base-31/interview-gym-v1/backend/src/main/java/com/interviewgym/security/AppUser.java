package com.interviewgym.security;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="app_users", uniqueConstraints=@UniqueConstraint(columnNames="email"))
public class AppUser {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false,length=80) private String name;
  @Column(nullable=false,length=190,unique=true) private String email;
  @Column(nullable=false) private String passwordHash;
  @Column(nullable=false) private Instant createdAt=Instant.now();
  protected AppUser() {}
  public AppUser(String name,String email,String passwordHash){this.name=name;this.email=email;this.passwordHash=passwordHash;}
  public Long getId(){return id;} public String getName(){return name;} public String getEmail(){return email;}
  public String getPasswordHash(){return passwordHash;} public Instant getCreatedAt(){return createdAt;}
}
