package com.iagent.storedprocedure.dto;
public record StoredProcedureExecutionResponse(String serviceId,String serviceName,boolean success,Object output,long executionTimeMs) {}
