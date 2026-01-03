package com.prem.utils;

import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Set;

public final class FileUtils {
    public static final Set<String> EXCLUDED_FOLDERS =
            Set.of(".git", ".node_modules", "node_modules");

    private FileUtils() {}

    public static boolean excluded(Path dir, Path root) {
        if (dir.equals(root)) return false;
        for (Path part : root.relativize(dir)) {
            if (EXCLUDED_FOLDERS.contains(part.toString())) return true;
        }
        return false;
    }

    public static boolean validFolder(String[] args) {
        if (args.length == 0) {
            System.out.println("Usage: java -cp target/classes com.prem.utils.<ClassName> <folder-path>");
            return false;
        }
        if (!Files.isDirectory(Paths.get(args[0]))) {
            System.out.println("Invalid folder: " + args[0]);
            return false;
        }
        return true;
    }
}
