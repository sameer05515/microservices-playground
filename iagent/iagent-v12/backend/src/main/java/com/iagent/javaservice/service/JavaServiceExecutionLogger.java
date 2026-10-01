package com.iagent.javaservice.service;

import com.iagent.javaservice.history.JavaServiceExecutionLog;
import com.iagent.javaservice.history.JavaServiceExecutionLogRepository;
import com.iagent.javaservice.model.JavaService;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class JavaServiceExecutionLogger {

    private final JavaServiceExecutionLogRepository repository;

    public JavaServiceExecutionLogger(JavaServiceExecutionLogRepository repository) {
        this.repository = repository;
    }

    public void success(JavaService service, List<Object> arguments,
                        Object response, String responseType, long executionTimeMs) {
        save(service, arguments, response, responseType, "SUCCESS", null, executionTimeMs);
    }

    public void failure(JavaService service, List<Object> arguments,
                        String errorMessage, long executionTimeMs) {
        save(service, arguments, null, null, "FAILED", errorMessage, executionTimeMs);
    }

    private void save(JavaService service, List<Object> arguments,
                      Object response, String responseType, String status,
                      String errorMessage, long executionTimeMs) {
        JavaServiceExecutionLog log = new JavaServiceExecutionLog();
        log.setServiceId(service.getId());
        log.setServiceName(service.getServiceName());
        log.setEndpointPath(service.getEndpointPath());
        log.setClassName(service.getClassName());
        log.setMethodName(service.getMethodName());
        log.setRequestArguments(arguments);
        log.setResponse(response);
        log.setResponseType(responseType);
        log.setStatus(status);
        log.setErrorMessage(errorMessage);
        log.setExecutionTimeMs(executionTimeMs);
        log.setExecutedAt(Instant.now());
        repository.save(log);
    }
}
