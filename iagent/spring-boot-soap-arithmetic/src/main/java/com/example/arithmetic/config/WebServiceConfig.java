package com.example.arithmetic.config;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.config.annotation.WsConfigurer;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

@EnableWs
@Configuration
public class WebServiceConfig implements WsConfigurer {

    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(
            ApplicationContext applicationContext) {

        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);

        return new ServletRegistrationBean<>(servlet, "/ws/*");
    }

    @Bean(name = "arithmetic")
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema arithmeticSchema) {

        DefaultWsdl11Definition definition = new DefaultWsdl11Definition();
        definition.setPortTypeName("ArithmeticPort");
        definition.setLocationUri("/ws");
        definition.setTargetNamespace("http://example.com/arithmetic");
        definition.setSchema(arithmeticSchema);

        return definition;
    }

    @Bean
    public XsdSchema arithmeticSchema() {
        return new SimpleXsdSchema(
                new ClassPathResource("xsd/arithmetic.xsd")
        );
    }
}
