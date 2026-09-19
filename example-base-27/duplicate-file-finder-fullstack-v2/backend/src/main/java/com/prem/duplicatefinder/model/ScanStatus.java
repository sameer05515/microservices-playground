package com.prem.duplicatefinder.model;
import java.util.List;
public record ScanStatus(String jobId, String status, int percent, long filesDiscovered,
                         long filesProcessed, long duplicateGroups, String message,
                         List<DuplicateGroup> groups) {}
