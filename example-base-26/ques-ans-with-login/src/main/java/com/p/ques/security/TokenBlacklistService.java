package com.p.ques.security;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Set<String> blacklistedTokens =
            ConcurrentHashMap.newKeySet();

    public void revoke(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isRevoked(String token) {
        return blacklistedTokens.contains(token);
    }
}