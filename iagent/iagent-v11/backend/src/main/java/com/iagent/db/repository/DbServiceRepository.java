package com.iagent.db.repository;
import com.iagent.db.model.DbService;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;
public interface DbServiceRepository extends MongoRepository<DbService,String> {
    boolean existsByServiceName(String serviceName);
    boolean existsByEndpointPath(String endpointPath);
    Optional<DbService> findByEndpointPath(String endpointPath);
    List<DbService> findAllByOrderByCreatedAtDesc();
}
