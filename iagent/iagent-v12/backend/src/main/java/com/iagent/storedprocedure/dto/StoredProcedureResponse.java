package com.iagent.storedprocedure.dto;
import com.iagent.storedprocedure.model.StoredProcedureService;
import java.time.Instant; import java.util.List;
public record StoredProcedureResponse(String id,String serviceName,String connectionId,String connectionName,String procedureName,String endpointPath,List<StoredProcedureService.Parameter> parameters,boolean enabled,Instant createdAt,Instant updatedAt) {}
