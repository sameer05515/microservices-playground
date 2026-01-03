package com.iagent.javaservice.dto;

import java.util.List;

public record ExecuteJavaServiceRequest(
        List<Object> arguments
) {
}
