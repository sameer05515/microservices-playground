package com.iagent.javaservice.service;

import com.iagent.javaservice.model.JavaService;
import org.springframework.stereotype.Component;

@Component
public class JavaTypeResolver {

    public Class<?>[] resolveParameterTypes(
            java.util.List<JavaService.Parameter> parameters,
            ClassLoader classLoader) throws ClassNotFoundException {

        Class<?>[] result = new Class<?>[parameters.size()];
        for (int i = 0; i < parameters.size(); i++) {
            result[i] = resolveType(parameters.get(i).getType(), classLoader);
        }
        return result;
    }

    private Class<?> resolveType(String type, ClassLoader classLoader)
            throws ClassNotFoundException {
        return switch (type) {
            case "byte" -> byte.class;
            case "short" -> short.class;
            case "int" -> int.class;
            case "long" -> long.class;
            case "float" -> float.class;
            case "double" -> double.class;
            case "boolean" -> boolean.class;
            case "char" -> char.class;
            case "void" -> void.class;
            default -> {
                if (type.endsWith("[]")) {
                    Class<?> component = resolveType(
                            type.substring(0, type.length() - 2), classLoader);
                    yield java.lang.reflect.Array.newInstance(component, 0).getClass();
                }
                yield Class.forName(type, false, classLoader);
            }
        };
    }
}
