package com.iagent.db.history;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface DbServiceExecutionLogRepository extends MongoRepository<DbServiceExecutionLog,String> {
    List<DbServiceExecutionLog> findAllByOrderByExecutedAtDesc();
    List<DbServiceExecutionLog> findByServiceIdOrderByExecutedAtDesc(String serviceId);
}
