package com.p.apis.course;

import com.p.apis.course.service.BackupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CourseApplication {

	@Autowired
	private BackupService backupService;

	public static void main(String[] args) {
		SpringApplication.run(CourseApplication.class, args);
	}


	@Bean
	ApplicationRunner applicationRunner() {
		return args -> backupService.restoreBackup();
	}

}
