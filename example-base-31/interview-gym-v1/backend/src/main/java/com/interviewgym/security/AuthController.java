package com.interviewgym.security;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AppUserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthController(AppUserRepository users,PasswordEncoder encoder,JwtService jwt){this.users=users;this.encoder=encoder;this.jwt=jwt;}
 @PostMapping("/signup") public ResponseEntity<?> signup(@Valid @RequestBody AuthDtos.SignupRequest r) {
   String email=r.email().trim().toLowerCase();
   if(users.existsByEmail(email)) return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","An account with this email already exists."));
   AppUser user=users.save(new AppUser(r.name().trim(),email,encoder.encode(r.password())));
   return ResponseEntity.status(HttpStatus.CREATED).body(new AuthDtos.AuthResponse(jwt.createToken(user),user.getName(),user.getEmail()));
 }
 @PostMapping("/login") public ResponseEntity<?> login(@Valid @RequestBody AuthDtos.LoginRequest r) {
   var user=users.findByEmail(r.email().trim().toLowerCase());
   if(user.isEmpty() || !encoder.matches(r.password(),user.get().getPasswordHash()))
     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Invalid email or password."));
   var u=user.get(); return ResponseEntity.ok(new AuthDtos.AuthResponse(jwt.createToken(u),u.getName(),u.getEmail()));
 }
 @GetMapping("/me") public Map<String,String> me(org.springframework.security.core.Authentication a) {
   var u=users.findByEmail(a.getName()).orElseThrow(); return Map.of("name",u.getName(),"email",u.getEmail());
 }
}
