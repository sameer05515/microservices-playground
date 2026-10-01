package com.iagent.db.service;

import com.iagent.common.BadRequestException;
import com.iagent.common.DuplicateResourceException;
import com.iagent.common.ResourceNotFoundException;
import com.iagent.db.dto.*;
import com.iagent.db.history.DbServiceExecutionLog;
import com.iagent.db.history.DbServiceExecutionLogRepository;
import com.iagent.db.model.DbConnection;
import com.iagent.db.model.DbService;
import com.iagent.db.repository.DbServiceRepository;
import org.springframework.stereotype.Service;
import java.sql.*;
import java.time.Instant;
import java.util.*;
import java.util.regex.*;

@Service
public class DbServiceManager {
    private static final Pattern PARAMETER_PATTERN = Pattern.compile("#([A-Za-z_][A-Za-z0-9_]*)#");
    private final DbServiceRepository repository;
    private final DbConnectionManager connectionManager;
    private final DbServiceExecutionLogRepository historyRepository;

    public DbServiceManager(DbServiceRepository repository, DbConnectionManager connectionManager,
                            DbServiceExecutionLogRepository historyRepository) {
        this.repository=repository; this.connectionManager=connectionManager; this.historyRepository=historyRepository;
    }

    public DbServiceResponse create(CreateDbServiceRequest request) {
        String name=request.serviceName().trim(), query=request.query().trim(), endpoint=normalizeEndpoint(request.endpointPath());
        if(repository.existsByServiceName(name)) throw new DuplicateResourceException("DbService name already exists: "+name);
        if(repository.existsByEndpointPath(endpoint)) throw new DuplicateResourceException("DbService endpoint already exists: "+endpoint);
        DbConnection connection=connectionManager.get(request.connectionId());
        List<String> params=extractParameterNames(query);
        executeAgainstConnection(connection,query,request.parameters(),params,null,"Create Test");
        Instant now=Instant.now(); DbService s=new DbService();
        s.setServiceName(name); s.setEndpointPath(endpoint); s.setConnectionId(connection.getId()); s.setQuery(query);
        s.setParameterNames(params); s.setEnabled(request.enabled()==null||request.enabled()); s.setCreatedAt(now); s.setUpdatedAt(now);
        return toResponse(repository.save(s));
    }

    public List<DbServiceResponse> list(){return repository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();}
    public DbServiceResponse details(String id){return toResponse(get(id));}
    public DbQueryResponse test(TestDbServiceRequest request){
        DbConnection c=connectionManager.get(request.connectionId());
        return executeAgainstConnection(c,request.query().trim(),request.parameters(),extractParameterNames(request.query()),null,"Test Service");
    }
    public DbQueryResponse execute(String id, Map<String,Object> parameters){
        DbService s=get(id); if(!s.isEnabled()) throw new BadRequestException("DbService is disabled: "+s.getServiceName());
        return executeAndLog(s,parameters);
    }
    public DbQueryResponse executeRuntime(String endpointPath, Map<String,Object> parameters){
        String endpoint=normalizeEndpoint(endpointPath); DbService s=repository.findByEndpointPath(endpoint)
                .orElseThrow(()->new ResourceNotFoundException("DbService endpoint not found: "+endpoint));
        if(!s.isEnabled()) throw new BadRequestException("DbService is disabled: "+s.getServiceName());
        return executeAndLog(s,parameters);
    }
    public List<DbExecutionHistoryResponse> history(){return historyRepository.findAllByOrderByExecutedAtDesc().stream().map(this::historyResponse).toList();}
    public List<DbExecutionHistoryResponse> serviceHistory(String id){get(id); return historyRepository.findByServiceIdOrderByExecutedAtDesc(id).stream().map(this::historyResponse).toList();}

    private DbQueryResponse executeAndLog(DbService s, Map<String,Object> params){
        long started=System.nanoTime(); DbConnection c=connectionManager.get(s.getConnectionId());
        try { DbQueryResponse r=executeAgainstConnection(c,s.getQuery(),params,s.getParameterNames(),s.getId(),s.getServiceName());
            saveLog(s,c,params,r,"SUCCESS",null,(System.nanoTime()-started)/1_000_000); return r;
        } catch(RuntimeException e){saveLog(s,c,params,null,"FAILED",e.getMessage(),(System.nanoTime()-started)/1_000_000); throw e;}
    }

    private DbQueryResponse executeAgainstConnection(DbConnection c,String query,Map<String,Object> params,List<String> names,String id,String name){
        validateParameters(names,params); String sql=parameterizedSql(query); long started=System.nanoTime();
        try(Connection db=DriverManager.getConnection(c.getJdbcUrl(),c.getUsername(),c.getPassword()); PreparedStatement st=db.prepareStatement(sql)){
            bindParameters(st,query,names,params); boolean rs=st.execute(); long elapsed=(System.nanoTime()-started)/1_000_000;
            if(!rs) return new DbQueryResponse(id,name,false,List.of(),List.of(),0,st.getUpdateCount(),elapsed);
            try(ResultSet result=st.getResultSet()){
                ResultSetMetaData md=result.getMetaData(); int count=md.getColumnCount(); List<String> cols=new ArrayList<>();
                for(int i=1;i<=count;i++) cols.add(md.getColumnLabel(i)); List<List<Object>> rows=new ArrayList<>();
                while(result.next()){List<Object> row=new ArrayList<>(); for(int i=1;i<=count;i++) row.add(result.getObject(i)); rows.add(row);}
                return new DbQueryResponse(id,name,true,cols,rows,rows.size(),-1,elapsed);
            }
        }catch(SQLException e){throw new BadRequestException("DbService execution failed: "+e.getMessage());}
    }
    private DbService get(String id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("DbService not found: "+id));}
    private String normalizeEndpoint(String p){String x=p==null?"":p.trim(); if(x.isBlank()) throw new BadRequestException("Endpoint path cannot be empty."); return x.startsWith("/")?x:"/"+x;}
    private List<String> extractParameterNames(String q){if(q==null||q.isBlank())throw new BadRequestException("Query cannot be empty."); Matcher m=PARAMETER_PATTERN.matcher(q); Set<String> n=new LinkedHashSet<>(); while(m.find())n.add(m.group(1)); return new ArrayList<>(n);}
    private String parameterizedSql(String q){return PARAMETER_PATTERN.matcher(q).replaceAll("?");}
    private void validateParameters(List<String> names,Map<String,Object> p){Map<String,Object> v=p==null?Map.of():p; for(String n:names)if(!v.containsKey(n))throw new BadRequestException("Missing query parameter: "+n);}
    private void bindParameters(PreparedStatement st,String q,List<String> names,Map<String,Object> p)throws SQLException{Map<String,Object> v=p==null?Map.of():p; Matcher m=PARAMETER_PATTERN.matcher(q); int i=1; while(m.find())st.setObject(i++,v.get(m.group(1)));}
    private void saveLog(DbService s,DbConnection c,Map<String,Object> params,DbQueryResponse r,String status,String error,long ms){DbServiceExecutionLog l=new DbServiceExecutionLog(); l.setServiceId(s.getId());l.setServiceName(s.getServiceName());l.setEndpointPath(s.getEndpointPath());l.setConnectionName(c.getName());l.setQuery(s.getQuery());l.setRequestParameters(params==null?Map.of():params);l.setStatus(status);l.setErrorMessage(error);l.setExecutionTimeMs(ms);l.setExecutedAt(Instant.now()); if(r!=null){l.setResultSet(r.resultSet());l.setRowCount(r.rowCount());l.setUpdateCount(r.updateCount());l.setResponse(r.resultSet()?Map.of("columns",r.columns(),"rows",r.rows()):Map.of("updateCount",r.updateCount()));} historyRepository.save(l);}
    private DbExecutionHistoryResponse historyResponse(DbServiceExecutionLog l){return new DbExecutionHistoryResponse(l.getId(),l.getServiceId(),l.getServiceName(),l.getEndpointPath(),l.getConnectionName(),l.getQuery(),l.getRequestParameters(),l.getResponse(),l.isResultSet(),l.getRowCount(),l.getUpdateCount(),l.getStatus(),l.getErrorMessage(),l.getExecutionTimeMs(),l.getExecutedAt());}
    private DbServiceResponse toResponse(DbService s){String cn=connectionManager.get(s.getConnectionId()).getName(); return new DbServiceResponse(s.getId(),s.getServiceName(),s.getConnectionId(),cn,s.getQuery(),s.getParameterNames()==null?List.of():s.getParameterNames(),s.getEndpointPath(),s.isEnabled(),s.getCreatedAt(),s.getUpdatedAt());}
}
