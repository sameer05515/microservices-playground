package com.prem.duplicatefinder.model;

import java.util.List;

public record DuplicateScanResponse(
        String rootPath,
        int duplicateGroups,
        int duplicateFiles,
        long wastedBytes,
        long scanDurationMs,
        List<DuplicateGroup> groups
) {}
