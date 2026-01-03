package com.example.todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface OutboxEventRepository extends JpaRepository<OutboxEvent,String> {
 @Query("select e from OutboxEvent e where e.status = com.example.todo.OutboxStatus.PENDING order by e.createdAt asc")
 List<OutboxEvent> findPending();
}
