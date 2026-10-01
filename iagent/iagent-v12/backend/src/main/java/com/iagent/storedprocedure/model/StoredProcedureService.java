package com.iagent.storedprocedure.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "stored_procedure_services")
public class StoredProcedureService {
    @Id private String id;
    private String serviceName;
    private String endpointPath;
    private String connectionId;
    private String procedureName;
    private List<Parameter> parameters = new ArrayList<>();
    private boolean enabled = true;
    private Instant createdAt;
    private Instant updatedAt;

    public static class Parameter {
        private String name;
        private String mode = "IN";
        private String sqlType = "VARCHAR";
        public String getName(){return name;} public void setName(String v){name=v;}
        public String getMode(){return mode;} public void setMode(String v){mode=v;}
        public String getSqlType(){return sqlType;} public void setSqlType(String v){sqlType=v;}
    }
    public String getId(){return id;} public void setId(String v){id=v;}
    public String getServiceName(){return serviceName;} public void setServiceName(String v){serviceName=v;}
    public String getEndpointPath(){return endpointPath;} public void setEndpointPath(String v){endpointPath=v;}
    public String getConnectionId(){return connectionId;} public void setConnectionId(String v){connectionId=v;}
    public String getProcedureName(){return procedureName;} public void setProcedureName(String v){procedureName=v;}
    public List<Parameter> getParameters(){return parameters;} public void setParameters(List<Parameter> v){parameters=v;}
    public boolean isEnabled(){return enabled;} public void setEnabled(boolean v){enabled=v;}
    public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
    public Instant getUpdatedAt(){return updatedAt;} public void setUpdatedAt(Instant v){updatedAt=v;}
}
