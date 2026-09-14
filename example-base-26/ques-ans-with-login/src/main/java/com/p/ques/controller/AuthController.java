package com.p.ques.controller;

import com.p.ques.dto.ChangePasswordRequest;
import com.p.ques.dto.LoginRequest;
import com.p.ques.dto.SignupRequest;
import com.p.ques.dto.TokenResponse;
import com.p.ques.dto.AuthResponse;
import com.p.ques.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @Valid @RequestBody SignupRequest request,
            HttpServletResponse response) {

        TokenResponse tokens =
                authService.signup(request);

        addRefreshCookie(
                response,
                tokens.refreshToken()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new AuthResponse(
                                tokens.accessToken()
                        )
                );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        TokenResponse tokens =
                authService.login(request);

        addRefreshCookie(
                response,
                tokens.refreshToken()
        );

        return ResponseEntity.ok(
                new AuthResponse(
                        tokens.accessToken()
                )
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue(
                    name = "refreshToken",
                    required = false
            )
            String refreshToken,
            HttpServletResponse response) {

        if (refreshToken == null ||
                refreshToken.isBlank()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        try {

            TokenResponse tokens =
                    authService.refresh(
                            refreshToken
                    );

            /*
             * New refresh token.
             */
            addRefreshCookie(
                    response,
                    tokens.refreshToken()
            );

            /*
             * Only access token in response body.
             */
            return ResponseEntity.ok(
                    new AuthResponse(
                            tokens.accessToken()
                    )
            );

        } catch (IllegalArgumentException e) {

            clearRefreshCookie(response);

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(
                    name = "refreshToken",
                    required = false
            )
            String refreshToken,
            HttpServletResponse response) {

        authService.logout(refreshToken);

        clearRefreshCookie(response);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid
            @RequestBody ChangePasswordRequest request) {

        authService.changePassword(request);

        return ResponseEntity.noContent().build();
    }


    private void addRefreshCookie(
            HttpServletResponse response,
            String refreshToken) {

        Cookie cookie =
                new Cookie(
                        "refreshToken",
                        refreshToken
                );

        cookie.setHttpOnly(true);

        /*
         * HTTPS only in production.
         *
         * For localhost development, false is easier.
         */
        cookie.setSecure(false);

        cookie.setPath("/api/auth");

        /*
         * Refresh token is valid for 7 days.
         */
        cookie.setMaxAge(7 * 24 * 60 * 60);

        /*
         * Good default when frontend/backend
         * are same-site.
         */
        cookie.setAttribute(
                "SameSite",
                "Lax"
        );

        response.addCookie(cookie);
    }

    private void clearRefreshCookie(
            HttpServletResponse response) {

        Cookie cookie =
                new Cookie(
                        "refreshToken",
                        ""
                );

        cookie.setHttpOnly(true);

        cookie.setSecure(false);

        cookie.setPath("/api/auth");

        cookie.setMaxAge(0);

        cookie.setAttribute(
                "SameSite",
                "Lax"
        );

        response.addCookie(cookie);
    }
}