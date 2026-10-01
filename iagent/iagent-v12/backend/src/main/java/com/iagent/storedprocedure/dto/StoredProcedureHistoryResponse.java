package com.iagent.storedprocedure.dto;
import java.time.Instant; import java.util.Map;
public record StoredProcedureHistoryResponse(String id,String serviceId,String serviceName,String endpointPath,String connectionName,String procedureName,Map<String,Object> requestParameters,Object response,String status,String errorMessage,long executionTimeMs,Instant executedAt) {}
