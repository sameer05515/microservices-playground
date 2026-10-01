package com.iagent.storedprocedure.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;
public record TestStoredProcedureRequest(@NotBlank String connectionId,@NotBlank String procedureName,@Valid List<StoredProcedureParameterRequest> parameters,Map<String,Object> values) {}
