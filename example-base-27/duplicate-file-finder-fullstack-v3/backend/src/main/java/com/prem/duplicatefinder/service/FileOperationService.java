package com.prem.duplicatefinder.service;

import com.prem.duplicatefinder.model.FolderEntry;
import org.springframework.stereotype.Service;

import java.nio.file.*;
import java.util.*;

@Service
public class FileOperationService {

    public List<FolderEntry> browse(String path) throws Exception {
        Path root = Paths.get(path).toAbsolutePath().normalize();
        if (!Files.isDirectory(root)) throw new IllegalArgumentException("Not a directory: " + root);
        try (var stream = Files.list(root)) {
            return stream.sorted(Comparator.comparing((Path p) -> !Files.isDirectory(p))
                    .thenComparing(p -> p.getFileName().toString().toLowerCase()))
                    .map(p -> {
                        try { return new FolderEntry(p.getFileName().toString(), p.toString(),
                                Files.isDirectory(p), Files.isDirectory(p) ? 0 : Files.size(p)); }
                        catch (Exception e) { return new FolderEntry(p.getFileName().toString(), p.toString(),
                                Files.isDirectory(p), 0); }
                    }).toList();
        }
    }

    public Map<String,Object> delete(List<String> paths) {
        int success=0; List<String> errors=new ArrayList<>();
        for (String s: paths) {
            try { Files.deleteIfExists(Paths.get(s)); success++; }
            catch (Exception e) { errors.add(s + ": " + e.getMessage()); }
        }
        return Map.of("success",success,"errors",errors);
    }

    public Map<String,Object> move(List<String> paths, String targetDirectory) {
        int success=0; List<String> errors=new ArrayList<>();
        try { Files.createDirectories(Paths.get(targetDirectory)); } catch (Exception e) {
            return Map.of("success",0,"errors",List.of(e.getMessage()));
        }
        for (String s: paths) {
            try {
                Path source=Paths.get(s);
                Path target=Paths.get(targetDirectory).resolve(source.getFileName());
                if (Files.exists(target)) target=uniqueTarget(target);
                Files.move(source,target);
                success++;
            } catch (Exception e) { errors.add(s + ": " + e.getMessage()); }
        }
        return Map.of("success",success,"errors",errors);
    }

    private Path uniqueTarget(Path target) {
        String name=target.getFileName().toString();
        String base=name, ext="";
        int dot=name.lastIndexOf('.');
        if (dot>0) { base=name.substring(0,dot); ext=name.substring(dot); }
        int i=1; Path p=target;
        while(Files.exists(p)) p=target.resolveSibling(base+" ("+(i++)+")"+ext);
        return p;
    }
}
