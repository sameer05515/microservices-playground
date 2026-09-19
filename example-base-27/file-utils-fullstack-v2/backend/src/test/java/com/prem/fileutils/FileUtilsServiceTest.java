package com.prem.fileutils;

import com.prem.fileutils.config.FileUtilsProperties;
import com.prem.fileutils.service.FileUtilsService;
import com.prem.fileutils.service.JobService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileUtilsServiceTest {

    @TempDir
    Path temp;

    private FileUtilsService service() throws Exception {
        FileUtilsProperties p = new FileUtilsProperties();
        p.setRoot(temp.toString());
        return new FileUtilsService(p, new JobService());
    }

    @Test
    void copyAndMove() throws Exception {
        var service = service();

        Files.writeString(temp.resolve("a.txt"), "hello");

        service.copy("a.txt", "copy/a.txt");
        assertEquals("hello", Files.readString(temp.resolve("copy/a.txt")));

        service.move("copy/a.txt", "moved/a.txt");
        assertTrue(Files.exists(temp.resolve("moved/a.txt")));
    }

    @Test
    void zipAndUnzip() throws Exception {
        var service = service();

        Files.createDirectories(temp.resolve("input/sub"));
        Files.writeString(temp.resolve("input/a.txt"), "hello");
        Files.writeString(temp.resolve("input/sub/b.txt"), "world");

        var job = service.zip("input", "input.zip");

        for (int i = 0; i < 50 && !"COMPLETED".equals(job.getStatus().name()); i++) {
            Thread.sleep(50);
        }

        assertEquals("COMPLETED", job.getStatus().name());

        var unzip = service.unzip("input.zip", "output");

        for (int i = 0; i < 50 && !"COMPLETED".equals(unzip.getStatus().name()); i++) {
            Thread.sleep(50);
        }

        assertEquals("COMPLETED", unzip.getStatus().name());
        assertEquals("hello", Files.readString(temp.resolve("output/a.txt")));
        assertEquals("world", Files.readString(temp.resolve("output/sub/b.txt")));
    }

    @Test
    void rejectsTraversal() throws Exception {
        var service = service();

        assertThrows(IllegalArgumentException.class,
                () -> service.list("../outside", 0, 10, "name", "asc"));
    }
}
