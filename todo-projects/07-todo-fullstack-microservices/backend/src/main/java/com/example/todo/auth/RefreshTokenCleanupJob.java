package com.example.todo.auth;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
@Component @RequiredArgsConstructor public class RefreshTokenCleanupJob {
 private final RefreshTokenRepository repository;
 @Scheduled(fixedDelayString="${app.refresh-token.cleanup-ms:3600000}") @Transactional public void deleteExpiredTokens(){repository.deleteByExpiresAtBefore(Instant.now());}
}
