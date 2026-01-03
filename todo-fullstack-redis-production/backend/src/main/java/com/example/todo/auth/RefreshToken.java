package com.example.todo.auth;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
@Entity @Table(name="refresh_tokens", indexes=@Index(name="idx_refresh_token_value", columnList="token", unique=true))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RefreshToken {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false, unique=true, length=200) private String token;
  @ManyToOne(fetch=FetchType.LAZY, optional=false) private User user;
  @Column(nullable=false) private Instant expiresAt;
  private Instant revokedAt;
}
