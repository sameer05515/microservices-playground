package com.p.ques.service;

import com.p.ques.dto.ForgotPasswordQuestionsResponse;
import com.p.ques.dto.ResetPasswordRequest;
import com.p.ques.dto.VerifySecurityAnswersRequest;
import com.p.ques.entity.PasswordResetToken;
import com.p.ques.entity.RefreshToken;
import com.p.ques.entity.SecurityQuestion;
import com.p.ques.entity.SecurityQuestionAnswer;
import com.p.ques.entity.User;
import com.p.ques.repository.PasswordResetTokenRepository;
import com.p.ques.repository.RefreshTokenRepository;
import com.p.ques.repository.SecurityQuestionRepository;
import com.p.ques.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final long RESET_TOKEN_EXPIRATION_MILLIS = 10 * 60 * 1000L;

    private final UserRepository userRepository;
    private final SecurityQuestionRepository securityQuestionRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    public ForgotPasswordQuestionsResponse getQuestions(String email) {
        User user = findUser(email);

        List<SecurityQuestionAnswer> configured =
                user.getSecurityQuestionAnswers();

        if (configured == null || configured.size() != 2) {
            throw new IllegalArgumentException(
                    "Security questions are not configured for this account"
            );
        }

        List<ForgotPasswordQuestionsResponse.SecurityQuestion> questions =
                new ArrayList<>();

        for (SecurityQuestionAnswer answer : configured) {
            SecurityQuestion question = securityQuestionRepository
                    .findById(answer.getQuestionId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Security question configuration is invalid"
                    ));

            questions.add(new ForgotPasswordQuestionsResponse.SecurityQuestion(
                    question.getId(),
                    question.getQuestion()
            ));
        }

        return new ForgotPasswordQuestionsResponse(questions);
    }

    public String verifyAnswers(VerifySecurityAnswersRequest request) {
        User user = findUser(request.email());

        List<SecurityQuestionAnswer> configured =
                user.getSecurityQuestionAnswers();

        if (configured == null || configured.size() != 2) {
            throw new IllegalArgumentException(
                    "Security questions are not configured for this account"
            );
        }

        if (request.answers() == null || request.answers().size() != 2) {
            throw new IllegalArgumentException(
                    "Exactly 2 security answers are required"
            );
        }

        Set<String> submittedIds = new HashSet<>();
        Map<String, String> submittedAnswers = new HashMap<>();

        for (VerifySecurityAnswersRequest.SecurityAnswer answer : request.answers()) {
            if (!submittedIds.add(answer.questionId())) {
                throw new IllegalArgumentException(
                        "Security questions must be different"
                );
            }

            submittedAnswers.put(
                    answer.questionId(),
                    normalize(answer.answer())
            );
        }

        if (submittedIds.size() != configured.size()) {
            throw new IllegalArgumentException("Invalid security answers");
        }

        for (SecurityQuestionAnswer configuredAnswer : configured) {
            String submitted = submittedAnswers.get(
                    configuredAnswer.getQuestionId()
            );

            if (submitted == null || !passwordEncoder.matches(
                    submitted,
                    configuredAnswer.getAnswerHash()
            )) {
                throw new IllegalArgumentException("Invalid security answers");
            }
        }

        String rawToken = generateToken();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .tokenHash(hash(rawToken))
                .userId(user.getId())
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusMillis(
                        RESET_TOKEN_EXPIRATION_MILLIS
                ))
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);

        return rawToken;
    }

    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenHashAndUsedFalse(hash(request.resetToken()))
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid or expired password reset token"
                ));

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            resetToken.setUsed(true);
            passwordResetTokenRepository.save(resetToken);

            throw new IllegalArgumentException(
                    "Invalid or expired password reset token"
            );
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found"
                ));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        /*
         * Invalidate every reset token for this user, including the
         * token just consumed. This prevents an older verified token
         * from being reused after the password has been changed.
         */
        List<PasswordResetToken> resetTokens = passwordResetTokenRepository
                .findAll()
                .stream()
                .filter(token -> user.getId().equals(token.getUserId()))
                .peek(token -> token.setUsed(true))
                .toList();

        if (!resetTokens.isEmpty()) {
            passwordResetTokenRepository.saveAll(resetTokens);
        }

        /*
         * A password reset invalidates all refresh tokens so that
         * previously issued sessions cannot be refreshed.
         */
        List<RefreshToken> refreshTokens = refreshTokenRepository
                .findAll()
                .stream()
                .filter(token -> user.getId().equals(token.getUserId()))
                .peek(token -> token.setRevoked(true))
                .toList();

        if (!refreshTokens.isEmpty()) {
            refreshTokenRepository.saveAll(refreshTokens);
        }
    }

    private User findUser(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Unable to process password recovery request"
                ));
    }

    private String normalize(String answer) {
        return answer.trim().toLowerCase();
    }

    private String generateToken() {
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(
                    value.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder().encodeToString(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 algorithm not available",
                    e
            );
        }
    }
}
