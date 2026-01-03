package com.prem.utils;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

public class DirectoryTreePrinter {
    public static void main(String[] args) {
        if (!FileUtils.validFolder(args)) return;
        Path root = Paths.get(args[0]);
        System.out.println(root);
        try { print(root, ""); } catch (IOException e) { e.printStackTrace(); }
    }

    static void print(Path dir, String indent) throws IOException {
        List<Path> children = new ArrayList<>();
        try (DirectoryStream<Path> ds = Files.newDirectoryStream(dir)) {
            for (Path p : ds) {
                if (Files.isDirectory(p) && FileUtils.EXCLUDED_FOLDERS.contains(p.getFileName().toString())) continue;
                children.add(p);
            }
        }
        children.sort(Comparator.comparing((Path p) -> !Files.isDirectory(p))
                .thenComparing(p -> p.getFileName().toString(), String.CASE_INSENSITIVE_ORDER));

        for (int i=0; i<children.size(); i++) {
            Path p = children.get(i);
            boolean last = i == children.size()-1;
            System.out.println(indent + (last ? "└── " : "├── ") + p.getFileName());
            if (Files.isDirectory(p)) print(p, indent + (last ? "    " : "│   "));
        }
    }
}
