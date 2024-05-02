package com.p.apis.book;

import com.p.apis.book.service.BackupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BookApplication {

	@Autowired
	private BackupService backupService;

	public static void main(String[] args) {
		SpringApplication.run(BookApplication.class, args);
	}

	@Bean
	ApplicationRunner applicationRunner() {
		return args -> backupService.restoreBackup();
	}

}
