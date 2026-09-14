package com.p.ques.security;

import com.p.ques.entity.RefreshToken;
import com.p.ques.entity.User;
import com.p.ques.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private long refreshTokenExpiration;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public String createRefreshToken(User user) {

        byte[] randomBytes = new byte[64];

        secureRandom.nextBytes(randomBytes);

        String rawToken =
                Base64.getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(randomBytes);

        RefreshToken refreshToken =
                RefreshToken.builder()
                        .tokenHash(hash(rawToken))
                        .userId(user.getId())
                        .createdAt(Instant.now())
                        .expiresAt(
                                Instant.now().plusMillis(
                                        refreshTokenExpiration
                                )
                        )
                        .revoked(false)
                        .build();

        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }

    public RefreshToken validate(String rawToken) {

        String hash = hash(rawToken);

        RefreshToken refreshToken =
                refreshTokenRepository
                        .findByTokenHashAndRevokedFalse(hash)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid refresh token"
                                )
                        );

        if (refreshToken.getExpiresAt()
                .isBefore(Instant.now())) {

            refreshToken.setRevoked(true);

            refreshTokenRepository.save(refreshToken);

            throw new IllegalArgumentException(
                    "Refresh token has expired"
            );
        }

        return refreshToken;
    }

    public void revoke(String rawToken) {

        String hash = hash(rawToken);

        refreshTokenRepository
                .findByTokenHashAndRevokedFalse(hash)
                .ifPresent(token -> {

                    token.setRevoked(true);

                    refreshTokenRepository.save(token);
                });
    }

    private String hash(String value) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            value.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return Base64.getEncoder()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException e) {

            throw new IllegalStateException(
                    "SHA-256 algorithm not available",
                    e
            );
        }
    }
}