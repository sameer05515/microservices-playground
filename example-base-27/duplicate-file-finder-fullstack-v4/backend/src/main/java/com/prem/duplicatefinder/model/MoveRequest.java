package com.prem.duplicatefinder.model;
import jakarta.validation.constraints.*; import java.util.List;
public record MoveRequest(@NotEmpty List<String> paths,@NotBlank String targetDirectory){}
