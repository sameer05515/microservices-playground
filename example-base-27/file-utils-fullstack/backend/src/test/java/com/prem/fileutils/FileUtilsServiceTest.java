package com.prem.fileutils;

import com.prem.fileutils.config.FileUtilsProperties;
import com.prem.fileutils.service.FileUtilsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileUtilsServiceTest {

    @TempDir
    Path temp;

    private FileUtilsService service() throws Exception {
        FileUtilsProperties properties = new FileUtilsProperties();
        properties.setRoot(temp.toString());
        return new FileUtilsService(properties);
    }

    @Test
    void shouldCopyAndMoveFile() throws Exception {
        FileUtilsService service = service();

        Files.writeString(temp.resolve("a.txt"), "hello");

        service.copy("a.txt", "copy/a.txt");
        assertEquals("hello", Files.readString(temp.resolve("copy/a.txt")));

        service.move("copy/a.txt", "moved/a.txt");
        assertTrue(Files.exists(temp.resolve("moved/a.txt")));
    }

    @Test
    void shouldZipAndUnzip() throws Exception {
        FileUtilsService service = service();

        Files.createDirectories(temp.resolve("input/sub"));
        Files.writeString(temp.resolve("input/a.txt"), "hello");
        Files.writeString(temp.resolve("input/sub/b.txt"), "world");

        service.zip("input", "input.zip");
        assertTrue(Files.exists(temp.resolve("input.zip")));

        service.unzip("input.zip", "output");
        assertEquals("hello", Files.readString(temp.resolve("output/a.txt")));
        assertEquals("world", Files.readString(temp.resolve("output/sub/b.txt")));
    }

    @Test
    void shouldRejectPathTraversal() throws Exception {
        FileUtilsService service = service();

        assertThrows(IllegalArgumentException.class,
                () -> service.list("../outside"));
    }
}
