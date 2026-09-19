package com.prem.fileutils.model;

public record FileItem(
        String name,
        String relativePath,
        String type,
        long size,
        boolean directory,
        long modified
) {
}
