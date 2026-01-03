package com.p.ques.controller;

import com.p.ques.dto.SecurityQuestionSettingsRequest;
import com.p.ques.dto.SecurityQuestionSettingsResponse;
import com.p.ques.service.SecurityQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me/security-questions")
@RequiredArgsConstructor
public class UserSecurityQuestionController {

    private final SecurityQuestionService securityQuestionService;

    @GetMapping
    public ResponseEntity<SecurityQuestionSettingsResponse> getSettings() {
        return ResponseEntity.ok(
                securityQuestionService.getCurrentSettings()
        );
    }

    @PutMapping
    public ResponseEntity<Void> updateSettings(
            @Valid @RequestBody SecurityQuestionSettingsRequest request) {

        securityQuestionService.updateSettings(request);
        return ResponseEntity.noContent().build();
    }
}
