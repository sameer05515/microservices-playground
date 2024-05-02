package com.p.apis.student;

import com.p.apis.student.service.BackupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class StudentApplication {

	@Autowired
	private BackupService backupService;

	public static void main(String[] args) {
		SpringApplication.run(StudentApplication.class, args);
	}

	@Bean
	ApplicationRunner applicationRunner() {
		return args -> backupService.restoreBackup();
	}
}
