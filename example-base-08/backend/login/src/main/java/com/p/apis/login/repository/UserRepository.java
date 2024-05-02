// src/main/java/com/example/userapp/repository/UserRepository.java
package com.p.apis.login.repository;

import com.p.apis.login.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
