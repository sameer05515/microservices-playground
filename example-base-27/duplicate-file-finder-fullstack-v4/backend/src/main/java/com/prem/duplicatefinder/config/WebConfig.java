package com.prem.duplicatefinder.config;
import org.springframework.context.annotation.*;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.servlet.config.annotation.*;
import java.util.concurrent.Executor;
@Configuration @EnableAsync public class WebConfig implements WebMvcConfigurer {
 @Bean("scanExecutor") Executor scanExecutor(){
  ThreadPoolTaskExecutor e=new ThreadPoolTaskExecutor(); e.setCorePoolSize(2);e.setMaxPoolSize(4);
  e.setQueueCapacity(20);e.setThreadNamePrefix("scan-");e.initialize();return e;
 }
 @Override public void addCorsMappings(CorsRegistry r){r.addMapping("/api/**").allowedOrigins("http://localhost:5173")
 .allowedMethods("GET","POST","DELETE","OPTIONS").allowedHeaders("*");}
}
