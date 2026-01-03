package com.p.ques.service;

import com.p.ques.dto.SecurityQuestionSettingsRequest;
import com.p.ques.dto.SecurityQuestionSettingsResponse;
import com.p.ques.entity.SecurityQuestion;
import com.p.ques.entity.SecurityQuestionAnswer;
import com.p.ques.entity.User;
import com.p.ques.repository.SecurityQuestionRepository;
import com.p.ques.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
public class SecurityQuestionService {

    private final UserRepository userRepository;
    private final SecurityQuestionRepository securityQuestionRepository;
    private final PasswordEncoder passwordEncoder;

    public SecurityQuestionSettingsResponse getCurrentSettings() {
        User user = getCurrentUser();

        List<SecurityQuestionSettingsResponse.ConfiguredQuestion> configured =
                new ArrayList<>();

        if (user.getSecurityQuestionAnswers() == null) {
            return new SecurityQuestionSettingsResponse(configured);
        }

        for (SecurityQuestionAnswer answer : user.getSecurityQuestionAnswers()) {
            securityQuestionRepository.findById(answer.getQuestionId())
                    .ifPresent(question -> configured.add(
                            new SecurityQuestionSettingsResponse.ConfiguredQuestion(
                                    question.getId(),
                                    question.getQuestion()
                            )
                    ));
        }

        return new SecurityQuestionSettingsResponse(configured);
    }

    public void updateSettings(SecurityQuestionSettingsRequest request) {
        User user = getCurrentUser();

        List<SecurityQuestionSettingsRequest.SecurityQuestionAnswerRequest> requests =
                request.questions();

        Set<String> questionIds = new HashSet<>();
        List<SecurityQuestionAnswer> answers = new ArrayList<>();

        for (SecurityQuestionSettingsRequest.SecurityQuestionAnswerRequest item : requests) {
            if (!questionIds.add(item.questionId())) {
                throw new IllegalArgumentException(
                        "Security questions must be different"
                );
            }

            SecurityQuestion question = securityQuestionRepository
                    .findById(item.questionId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Invalid security question"
                    ));

            String normalizedAnswer = item.answer().trim().toLowerCase();

            if (normalizedAnswer.isBlank()) {
                throw new IllegalArgumentException(
                        "Security answer cannot be blank"
                );
            }

            answers.add(new SecurityQuestionAnswer(
                    question.getId(),
                    passwordEncoder.encode(normalizedAnswer)
            ));
        }

        user.setSecurityQuestionAnswers(answers);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User is not authenticated");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
