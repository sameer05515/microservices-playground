package com.iagent.jar.dto;
import java.util.List;
public record MethodListResponse(String jarId,String className,List<MethodInfo> methods){}
