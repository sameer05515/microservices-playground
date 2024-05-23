// src/main/java/com/example/studentapp/util/FileUtil.java
package com.p.apis.student.util;

import java.io.File;
import java.io.IOException;

public class FileUtil {
    public static void createFileIfNotExists(File file) throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
        }
    }
}
