package com.iagent.storedprocedure.repository;
import com.iagent.storedprocedure.model.StoredProcedureService;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;
public interface StoredProcedureServiceRepository extends MongoRepository<StoredProcedureService,String> {
    boolean existsByServiceName(String serviceName);
    boolean existsByEndpointPath(String endpointPath);
    Optional<StoredProcedureService> findByEndpointPath(String endpointPath);
    List<StoredProcedureService> findAllByOrderByCreatedAtDesc();
}
