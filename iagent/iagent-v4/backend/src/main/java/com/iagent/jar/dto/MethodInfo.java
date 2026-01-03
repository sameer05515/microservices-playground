package com.iagent.jar.dto;
import java.util.List;
public record MethodInfo(String name,String returnType,List<ParameterInfo> parameters){ public record ParameterInfo(String name,String type){} }
