package com.p.ques.repository;

import com.p.ques.entity.RefreshToken;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RefreshTokenRepository
        extends MongoRepository<RefreshToken, String> {

    Optional<RefreshToken> findByTokenHashAndRevokedFalse(
            String tokenHash
    );
}