package com.iagent.storedprocedure.history;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface StoredProcedureExecutionLogRepository extends MongoRepository<StoredProcedureExecutionLog,String> {
 List<StoredProcedureExecutionLog> findAllByOrderByExecutedAtDesc();
 List<StoredProcedureExecutionLog> findByServiceIdOrderByExecutedAtDesc(String serviceId);
}
