package com.example.todo.auth;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository repo;
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User u=repo.findByUsername(username).orElseThrow(()->new UsernameNotFoundException(username));
    return User.withUsername(u.getUsername()).password(u.getPassword())
      .authorities(new SimpleGrantedAuthority("ROLE_"+u.getRole().name())).build();
  }
}
