package com.p.ques.service;

import com.p.ques.dto.AuthResponse;
import com.p.ques.dto.ChangePasswordRequest;
import com.p.ques.dto.LoginRequest;
import com.p.ques.dto.SignupRequest;
import com.p.ques.entity.User;
import com.p.ques.repository.UserRepository;
import com.p.ques.security.JwtService;

import com.p.ques.security.TokenBlacklistService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthResponse signup(SignupRequest request) {

        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User already exists");
        }

        User user = User.builder()
                .name(request.name())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {

        String email = request.email().trim().toLowerCase();

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                request.password()
                        )
                );

        SecurityContextHolder
                .getContext()
                .setAuthentication(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }

    public void logout(String authorizationHeader) {

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            throw new IllegalArgumentException("Invalid Authorization header");
        }

        String token = authorizationHeader.substring(7);

        /*
         * JWTs are stateless.
         *
         * If we want logout to immediately invalidate
         * the token, JwtService/TokenBlacklistService
         * needs to keep track of revoked tokens.
         */
//        jwtService.revokeToken(token);
        tokenBlacklistService.revoke(token);
    }

    public void changePassword(ChangePasswordRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new IllegalStateException("User is not authenticated");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        /*
         * Compare the plain-text current password
         * with the BCrypt hash stored in MongoDB.
         */
        if (!passwordEncoder.matches(
                request.currentPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Current password is incorrect");
        }

        /*
         * NEVER store the new password directly.
         */
        user.setPassword(
                passwordEncoder.encode(request.newPassword())
        );

        user.setUpdatedAt(Instant.now());

        userRepository.save(user);
    }
}
