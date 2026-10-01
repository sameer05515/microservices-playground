package com.iagent.db.history;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.Map;

@Document(collection="db_service_execution_logs")
public class DbServiceExecutionLog {
    @Id private String id;
    private String serviceId;
    private String serviceName;
    private String endpointPath;
    private String connectionName;
    private String query;
    private Map<String,Object> requestParameters;
    private Object response;
    private boolean resultSet;
    private int rowCount;
    private int updateCount;
    private String status;
    private String errorMessage;
    private long executionTimeMs;
    private Instant executedAt;

    public String getId(){return id;} public void setId(String v){id=v;}
    public String getServiceId(){return serviceId;} public void setServiceId(String v){serviceId=v;}
    public String getServiceName(){return serviceName;} public void setServiceName(String v){serviceName=v;}
    public String getEndpointPath(){return endpointPath;} public void setEndpointPath(String v){endpointPath=v;}
    public String getConnectionName(){return connectionName;} public void setConnectionName(String v){connectionName=v;}
    public String getQuery(){return query;} public void setQuery(String v){query=v;}
    public Map<String,Object> getRequestParameters(){return requestParameters;} public void setRequestParameters(Map<String,Object> v){requestParameters=v;}
    public Object getResponse(){return response;} public void setResponse(Object v){response=v;}
    public boolean isResultSet(){return resultSet;} public void setResultSet(boolean v){resultSet=v;}
    public int getRowCount(){return rowCount;} public void setRowCount(int v){rowCount=v;}
    public int getUpdateCount(){return updateCount;} public void setUpdateCount(int v){updateCount=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getErrorMessage(){return errorMessage;} public void setErrorMessage(String v){errorMessage=v;}
    public long getExecutionTimeMs(){return executionTimeMs;} public void setExecutionTimeMs(long v){executionTimeMs=v;}
    public Instant getExecutedAt(){return executedAt;} public void setExecutedAt(Instant v){executedAt=v;}
}
