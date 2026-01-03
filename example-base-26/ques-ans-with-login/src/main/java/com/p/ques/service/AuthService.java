package com.p.ques.service;

import com.p.ques.dto.AuthResponse;
import com.p.ques.dto.TokenResponse;
import com.p.ques.dto.ChangePasswordRequest;
import com.p.ques.dto.LoginRequest;
import com.p.ques.dto.SignupRequest;
import com.p.ques.entity.User;
import com.p.ques.entity.SecurityQuestion;
import com.p.ques.entity.SecurityQuestionAnswer;
import com.p.ques.repository.SecurityQuestionRepository;
import com.p.ques.entity.RefreshToken;
import com.p.ques.repository.UserRepository;
import com.p.ques.security.JwtService;

import com.p.ques.security.TokenBlacklistService;
import com.p.ques.security.RefreshTokenService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;
    private final RefreshTokenService refreshTokenService;
    private final SecurityQuestionRepository securityQuestionRepository;

    public TokenResponse signup(SignupRequest request) {

    String email =
            request.email()
                    .trim()
                    .toLowerCase();

    if (userRepository.existsByEmail(email)) {
        throw new IllegalArgumentException(
                "User already exists"
        );
    }

    User user = User.builder()
            .name(request.name())
            .email(email)
            .password(
                    passwordEncoder.encode(
                            request.password()
                    )
            )
            .securityQuestionAnswers(buildSecurityQuestionAnswers(request.securityQuestions()))
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();

    userRepository.save(user);

    String accessToken =
            jwtService.generateToken(user);

    String refreshToken =
            refreshTokenService.createRefreshToken(user);

    return new TokenResponse(
            accessToken,
            refreshToken
    );
}

    private List<SecurityQuestionAnswer> buildSecurityQuestionAnswers(
            List<SignupRequest.SecurityQuestionAnswerRequest> requests) {

        if (requests == null || requests.size() != 2) {
            throw new IllegalArgumentException("Exactly 2 security questions are required");
        }

        Set<String> ids = new HashSet<>();
        List<SecurityQuestionAnswer> answers = new ArrayList<>();

        for (SignupRequest.SecurityQuestionAnswerRequest request : requests) {
            if (!ids.add(request.questionId())) {
                throw new IllegalArgumentException("Security questions must be different");
            }

            SecurityQuestion question = securityQuestionRepository.findById(request.questionId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid security question"));

            String normalized = request.answer().trim().toLowerCase();
            if (normalized.isBlank()) {
                throw new IllegalArgumentException("Security answer cannot be blank");
            }

            answers.add(new SecurityQuestionAnswer(
                    question.getId(),
                    passwordEncoder.encode(normalized)
            ));
        }

        return answers;
    }

    public TokenResponse login(LoginRequest request) {

    String email =
            request.email()
                    .trim()
                    .toLowerCase();

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

    User user =
            userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User not found"
                            )
                    );

    String accessToken =
            jwtService.generateToken(user);

    String refreshToken =
            refreshTokenService.createRefreshToken(user);

    return new TokenResponse(
            accessToken,
            refreshToken
    );
}


public TokenResponse refresh(String rawRefreshToken) {

    RefreshToken refreshToken =
            refreshTokenService.validate(
                    rawRefreshToken
            );

    User user =
            userRepository.findById(
                    refreshToken.getUserId()
            ).orElseThrow(() ->
                    new IllegalArgumentException(
                            "User not found"
                    )
            );

    /*
     * Rotate refresh token.
     */
    refreshTokenService.revoke(
            rawRefreshToken
    );

    String newAccessToken =
            jwtService.generateToken(user);

    String newRefreshToken =
            refreshTokenService.createRefreshToken(user);

    return new TokenResponse(
            newAccessToken,
            newRefreshToken
    );
}
public void logout(String refreshToken) {

    if (refreshToken != null &&
            !refreshToken.isBlank()) {

        refreshTokenService.revoke(
                refreshToken
        );
    }
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
