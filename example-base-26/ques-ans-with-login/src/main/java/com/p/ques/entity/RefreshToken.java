package com.p.ques.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "refresh_tokens")
public class RefreshToken {

    @Id
    private String id;

    /*
     * Store HASH of refresh token,
     * not the actual token.
     */
    private String tokenHash;

    private String userId;

    private Instant expiresAt;

    private Instant createdAt;

    private boolean revoked;
}