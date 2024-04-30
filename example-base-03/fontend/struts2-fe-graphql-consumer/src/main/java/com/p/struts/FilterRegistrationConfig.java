package com.p.struts;

import org.apache.struts2.dispatcher.filter.StrutsPrepareAndExecuteFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.Collections;


@Configuration
public class FilterRegistrationConfig {

    @Bean
    public FilterRegistrationBean<StrutsPrepareAndExecuteFilter> filterRegistrationBean() {
        FilterRegistrationBean<StrutsPrepareAndExecuteFilter> registrationBean = new FilterRegistrationBean<StrutsPrepareAndExecuteFilter>();
        StrutsPrepareAndExecuteFilter struts = new StrutsPrepareAndExecuteFilter();
        registrationBean.setFilter(struts);
        registrationBean.setUrlPatterns(Arrays.asList("/*"));
        registrationBean.setOrder(1);
        registrationBean.setInitParameters(Collections.singletonMap("actionPackages", "example.actions"));
        return registrationBean;
    }
}