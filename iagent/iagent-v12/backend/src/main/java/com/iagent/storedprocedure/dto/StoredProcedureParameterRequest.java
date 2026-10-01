package com.iagent.storedprocedure.dto;
import jakarta.validation.constraints.NotBlank;
public record StoredProcedureParameterRequest(@NotBlank String name, String mode, String sqlType) {}
