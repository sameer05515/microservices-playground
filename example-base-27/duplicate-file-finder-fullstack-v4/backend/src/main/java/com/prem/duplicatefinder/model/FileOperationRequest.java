package com.prem.duplicatefinder.model;
import jakarta.validation.constraints.NotEmpty; import java.util.List;
public record FileOperationRequest(@NotEmpty List<String> paths){}
