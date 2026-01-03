package com.p.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Component
public class RoleAuthorizationFilter implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            AllowRoles allowRoles = handlerMethod.getMethodAnnotation(AllowRoles.class);
            
            if (allowRoles == null) {
                allowRoles = handlerMethod.getBeanType().getAnnotation(AllowRoles.class);
            }

            if (allowRoles != null) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                
                if (authentication == null || !authentication.isAuthenticated()) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"message\":\"Unauthorized\"}");
                    return false;
                }

                Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
                Collection<String> userRoles = authorities.stream()
                        .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                        .collect(Collectors.toList());

                String[] allowedRoles = allowRoles.value();
                boolean hasRequiredRole = Arrays.stream(allowedRoles)
                        .anyMatch(userRoles::contains);

                if (!hasRequiredRole) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Forbidden\"}");
                    return false;
                }
            }
        }
        return true;
    }
}

