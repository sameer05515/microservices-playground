package com.p.struts;

import jakarta.servlet.Filter;
import org.apache.struts2.dispatcher.filter.StrutsPrepareAndExecuteFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.Collections;


@Configuration
public class FilterRegistrationConfig {

    @Bean
    @SuppressWarnings("unchecked")
    public FilterRegistrationBean<Filter> filterRegistrationBean() {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
        StrutsPrepareAndExecuteFilter struts = new StrutsPrepareAndExecuteFilter();
        // Cast required due to javax.servlet.Filter (Struts2) vs jakarta.servlet.Filter (Spring Boot 3.x) mismatch
        // At runtime, the filter interfaces are compatible
        registrationBean.setFilter((Filter) struts);
        registrationBean.setUrlPatterns(Arrays.asList("/*"));
        registrationBean.setOrder(1);
        registrationBean.setInitParameters(Collections.singletonMap("actionPackages", "example.actions"));
        return registrationBean;
    }
}