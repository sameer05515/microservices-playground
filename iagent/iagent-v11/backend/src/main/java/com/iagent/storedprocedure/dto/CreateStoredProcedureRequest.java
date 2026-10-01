package com.iagent.storedprocedure.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;
public record CreateStoredProcedureRequest(@NotBlank String serviceName,@NotBlank String connectionId,@NotBlank String procedureName,@NotBlank String endpointPath,Boolean enabled,@Valid List<StoredProcedureParameterRequest> parameters,Map<String,Object> values) {}
