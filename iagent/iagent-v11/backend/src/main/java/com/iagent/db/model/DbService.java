package com.iagent.db.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "db_services")
public class DbService {
    @Id private String id;
    private String serviceName;
    private String endpointPath;
    private String connectionId;
    private String query;
    private List<String> parameterNames = new ArrayList<>();
    private boolean enabled = true;
    private Instant createdAt;
    private Instant updatedAt;

    public String getId(){return id;} public void setId(String v){id=v;}
    public String getServiceName(){return serviceName;} public void setServiceName(String v){serviceName=v;}
    public String getEndpointPath(){return endpointPath;} public void setEndpointPath(String v){endpointPath=v;}
    public String getConnectionId(){return connectionId;} public void setConnectionId(String v){connectionId=v;}
    public String getQuery(){return query;} public void setQuery(String v){query=v;}
    public List<String> getParameterNames(){return parameterNames;} public void setParameterNames(List<String> v){parameterNames=v;}
    public boolean isEnabled(){return enabled;} public void setEnabled(boolean v){enabled=v;}
    public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
    public Instant getUpdatedAt(){return updatedAt;} public void setUpdatedAt(Instant v){updatedAt=v;}
}
