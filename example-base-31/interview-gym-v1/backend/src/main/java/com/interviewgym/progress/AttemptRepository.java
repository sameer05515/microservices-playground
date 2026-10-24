package com.interviewgym.progress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AttemptRepository extends JpaRepository<Attempt,Long> {
 List<Attempt> findByUserIdOrderByAttemptedAtDesc(Long userId);
}
