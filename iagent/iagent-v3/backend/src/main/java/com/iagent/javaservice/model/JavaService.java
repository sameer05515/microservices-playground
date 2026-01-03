package com.iagent.javaservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection = "java_services")
public class JavaService {
    @Id private String id;
    private String serviceName;
    private String description;
    private boolean enabled;
    private String jarId;
    private String jarFileName;
    private String className;
    private String methodName;
    private String returnType;
    private List<Parameter> parameters;
    private Instant createdAt;

    public JavaService() {}
    public JavaService(String id, String serviceName, String description, boolean enabled, String jarId,
                       String jarFileName, String className, String methodName, String returnType,
                       List<Parameter> parameters, Instant createdAt) {
        this.id=id; this.serviceName=serviceName; this.description=description; this.enabled=enabled;
        this.jarId=jarId; this.jarFileName=jarFileName; this.className=className; this.methodName=methodName;
        this.returnType=returnType; this.parameters=parameters; this.createdAt=createdAt;
    }
    public String getId(){return id;} public void setId(String v){id=v;}
    public String getServiceName(){return serviceName;} public void setServiceName(String v){serviceName=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public boolean isEnabled(){return enabled;} public void setEnabled(boolean v){enabled=v;}
    public String getJarId(){return jarId;} public void setJarId(String v){jarId=v;}
    public String getJarFileName(){return jarFileName;} public void setJarFileName(String v){jarFileName=v;}
    public String getClassName(){return className;} public void setClassName(String v){className=v;}
    public String getMethodName(){return methodName;} public void setMethodName(String v){methodName=v;}
    public String getReturnType(){return returnType;} public void setReturnType(String v){returnType=v;}
    public List<Parameter> getParameters(){return parameters;} public void setParameters(List<Parameter> v){parameters=v;}
    public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}

    public static class Parameter {
        private String name; private String type;
        public Parameter() {}
        public Parameter(String name,String type){this.name=name;this.type=type;}
        public String getName(){return name;} public void setName(String v){name=v;}
        public String getType(){return type;} public void setType(String v){type=v;}
    }
}
