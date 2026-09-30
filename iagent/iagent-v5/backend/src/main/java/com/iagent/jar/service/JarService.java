package com.iagent.jar.service;

import com.iagent.common.BadRequestException;
import com.iagent.common.DuplicateResourceException;
import com.iagent.common.ResourceNotFoundException;
import com.iagent.jar.dto.*;
import com.iagent.jar.model.JarDefinition;
import com.iagent.jar.repository.JarDefinitionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;
import java.util.jar.*;

@Service
public class JarService {
    private final JarDefinitionRepository repository;
    private final Path storagePath;

    public JarService(JarDefinitionRepository repository, @Value("${iagent.jar-storage-path:./jar-storage}") String storage) {
        this.repository = repository;
        this.storagePath = Path.of(storage).toAbsolutePath().normalize();
        try { Files.createDirectories(storagePath); }
        catch (IOException e) { throw new IllegalStateException("Unable to create JAR storage directory", e); }
    }

    public JarUploadResponse upload(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BadRequestException("JAR file is required");
        String name = StringUtils.cleanPath(file.getOriginalFilename() == null ? "uploaded.jar" : file.getOriginalFilename());
        if (!name.toLowerCase(Locale.ROOT).endsWith(".jar")) throw new BadRequestException("Only .jar files are supported");

        if (repository.existsByFileName(name)) {
            throw new DuplicateResourceException("A JAR with the name '" + name + "' already exists.");
        }

        String id = UUID.randomUUID().toString();
        Path dest = storagePath.resolve(id + ".jar").normalize();
        if (!dest.getParent().equals(storagePath)) throw new BadRequestException("Invalid file name");

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to save uploaded JAR", e);
        }

        JarDefinition definition = new JarDefinition(id, name, dest.toString(), file.getSize(), Instant.now());
        try {
            JarDefinition saved = repository.save(definition);
            return new JarUploadResponse(saved.getId(), saved.getFileName(), saved.getStoragePath(), saved.getSize(), saved.getUploadedAt());
        } catch (DuplicateKeyException e) {
            deleteQuietly(dest);
            throw new DuplicateResourceException("A JAR with the name '" + name + "' already exists.");
        } catch (RuntimeException e) {
            deleteQuietly(dest);
            throw e;
        }
    }

    public List<JarListResponse> getAllJars() {
        return repository.findAllByOrderByUploadedAtDesc().stream()
                .map(j -> new JarListResponse(j.getId(), j.getFileName(), j.getSize(), j.getUploadedAt()))
                .toList();
    }

    public ClassListResponse getPublicClasses(String jarId) {
        JarDefinition d = getJar(jarId);
        Path p = storedPath(d);
        List<String> out = new ArrayList<>();
        try (JarFile jf = new JarFile(p.toFile())) {
            Enumeration<JarEntry> es = jf.entries();
            while (es.hasMoreElements()) {
                JarEntry entry = es.nextElement();
                String n = entry.getName();
                if (entry.isDirectory() || !n.endsWith(".class") || n.equals("module-info.class") || n.equals("package-info.class")) continue;
                String cn = n.substring(0, n.length() - 6).replace('/', '.');
                if (isPublicClass(p, cn)) out.add(cn);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Unable to inspect JAR: " + jarId, e);
        }
        out.sort(String::compareTo);
        return new ClassListResponse(jarId, out);
    }

    public MethodListResponse getPublicMethods(String jarId, String className) {
        if (className == null || className.isBlank()) throw new BadRequestException("className is required");
        Path p = storedPath(getJar(jarId));
        try (URLClassLoader cl = new URLClassLoader(new URL[]{p.toUri().toURL()}, JarService.class.getClassLoader())) {
            Class<?> c = Class.forName(className, false, cl);
            if (!Modifier.isPublic(c.getModifiers())) throw new BadRequestException("Selected class is not public: " + className);
            List<MethodInfo> methods = new ArrayList<>();
            for (Method m : c.getDeclaredMethods()) {
                if (!Modifier.isPublic(m.getModifiers())) continue;
                List<MethodInfo.ParameterInfo> params = Arrays.stream(m.getParameterTypes())
                        .map(t -> new MethodInfo.ParameterInfo(t.getSimpleName(), t.getName())).toList();
                methods.add(new MethodInfo(m.getName(), m.getReturnType().getName(), params));
            }
            methods.sort(Comparator.comparing(MethodInfo::name).thenComparingInt(m -> m.parameters().size()));
            return new MethodListResponse(jarId, className, methods);
        } catch (ClassNotFoundException e) {
            throw new ResourceNotFoundException("Class not found in JAR: " + className);
        } catch (LinkageError e) {
            throw new BadRequestException("Unable to load class; JAR may require missing dependencies: " + className);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read JAR: " + jarId, e);
        }
    }

    private JarDefinition getJar(String id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("JAR definition not found: " + id));
    }

    private Path storedPath(JarDefinition d) {
        Path p = Path.of(d.getStoragePath());
        if (!Files.exists(p)) throw new ResourceNotFoundException("Stored JAR file not found: " + d.getId());
        return p;
    }

    private boolean isPublicClass(Path p, String name) {
        try (URLClassLoader cl = new URLClassLoader(new URL[]{p.toUri().toURL()}, JarService.class.getClassLoader())) {
            return Modifier.isPublic(Class.forName(name, false, cl).getModifiers());
        } catch (ClassNotFoundException | NoClassDefFoundError | UnsupportedClassVersionError e) {
            return false;
        } catch (IOException | LinkageError e) {
            return false;
        }
    }

    private void deleteQuietly(Path path) {
        try { Files.deleteIfExists(path); } catch (IOException ignored) { }
    }
}
