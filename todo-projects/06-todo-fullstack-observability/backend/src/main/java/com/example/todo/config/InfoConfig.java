package com.example.todo.config;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration public class InfoConfig { @Bean InfoContributor appInfo(){return b->b.withDetail("service","todo-api").withDetail("database","MySQL").withDetail("migrations","Flyway").withDetail("authentication","JWT + refresh token").withDetail("authorization","USER/ADMIN");}}
