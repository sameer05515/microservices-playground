package com.example.todo.auth;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.Optional;
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {
  Optional<RefreshToken> findByToken(String token);
  long deleteByExpiresAtBefore(Instant time);
}
