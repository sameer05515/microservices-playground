package com.prem.duplicatefinder.model;
import jakarta.validation.constraints.NotBlank; import java.util.*;
public record ScanRequest(@NotBlank String rootPath,List<String> ignoredFolders){
 public List<String> normalizedIgnoredFolders(){return ignoredFolders==null?List.of():ignoredFolders.stream().filter(Objects::nonNull).map(String::trim).filter(s->!s.isBlank()).map(String::toLowerCase).distinct().toList();}
}
