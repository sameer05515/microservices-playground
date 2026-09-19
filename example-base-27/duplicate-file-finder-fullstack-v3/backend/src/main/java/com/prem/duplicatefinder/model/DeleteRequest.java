package com.prem.duplicatefinder.model;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
public record DeleteRequest(@NotBlank String rootPath, List<String> paths) {}
