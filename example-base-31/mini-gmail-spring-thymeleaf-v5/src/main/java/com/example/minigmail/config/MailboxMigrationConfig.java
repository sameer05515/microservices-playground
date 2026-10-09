package com.example.minigmail.config;

import com.example.minigmail.service.MailService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MailboxMigrationConfig {
    @Bean
    CommandLineRunner migrateMailboxEntries(MailService mailService) {
        return args -> mailService.migrateLegacyMailboxes();
    }
}
