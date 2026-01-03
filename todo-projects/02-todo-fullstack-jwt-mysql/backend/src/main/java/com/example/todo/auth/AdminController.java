package com.example.todo.auth;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
 private final UserRepository users;
 @GetMapping("/users") public List<UserView> users(){return users.findAll().stream().map(u->new UserView(u.getId(),u.getUsername(),u.getRole().name())).toList();}
 public record UserView(Long id,String username,String role){}
}
