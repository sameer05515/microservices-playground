package com.prem.duplicatefinder.config;
import org.springframework.context.annotation.*;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.servlet.config.annotation.*;
@Configuration
@EnableAsync
public class WebConfig implements WebMvcConfigurer {
    @Override public void addCorsMappings(CorsRegistry r) {
        r.addMapping("/api/**").allowedOrigins("http://localhost:5173")
          .allowedMethods("GET","POST","DELETE","OPTIONS").allowedHeaders("*");
    }
}
