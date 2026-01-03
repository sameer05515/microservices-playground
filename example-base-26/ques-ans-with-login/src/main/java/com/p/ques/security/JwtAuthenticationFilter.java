package com.p.ques.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        /*
         * No Authorization header.
         *
         * Let Spring Security continue processing the request.
         */
        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Extract JWT.
         *
         * "Bearer eyJhbGciOiJIUzI1Ni..."
         *          ↑
         *          token starts here
         */
        String token = authorizationHeader.substring(7);

        if (tokenBlacklistService.isRevoked(token)) {

            filterChain.doFilter(request, response);
            return;
        }

        String username;

        try {

            username = jwtService.extractUsername(token);

        } catch (Exception e) {

            /*
             * Invalid/malformed JWT.
             *
             * Don't authenticate the request.
             */
            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Only authenticate if there isn't already
         * an authentication in SecurityContext.
         */
        if (username != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            UserDetails userDetails;

            try {

                userDetails =
                        userDetailsService.loadUserByUsername(username);

            } catch (Exception e) {

                /*
                 * User doesn't exist anymore.
                 */
                filterChain.doFilter(request, response);
                return;
            }

            /*
             * Validate:
             *
             * 1. JWT username == UserDetails username
             * 2. JWT hasn't expired
             * 3. JWT signature is valid
             */
            if (jwtService.isTokenValid(
                    token,
                    userDetails)) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                /*
                 * This is the most important line.
                 *
                 * From this point onwards Spring Security
                 * considers the request authenticated.
                 */
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}