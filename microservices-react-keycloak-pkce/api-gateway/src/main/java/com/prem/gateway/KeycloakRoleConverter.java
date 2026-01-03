package com.prem.gateway;

import java.util.*;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Map<String, Object> a = jwt.getClaimAsMap("realm_access");
        if (a == null || !(a.get("roles") instanceof Collection<?> r)) {
            return List.of();
        
        }return r.stream().map(Object::toString).map(x -> new SimpleGrantedAuthority("ROLE_" + x)).toList();
    }
}
