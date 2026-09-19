package com.prem.duplicatefinder.model;
import jakarta.validation.constraints.NotBlank;
public record MoveRequest(@NotBlank String targetDirectory) {}
