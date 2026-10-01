package com.iagent.storedprocedure.service;

import com.iagent.common.BadRequestException;
import com.iagent.common.DuplicateResourceException;
import com.iagent.common.ResourceNotFoundException;
import com.iagent.db.model.DbConnection;
import com.iagent.db.service.DbConnectionManager;
import com.iagent.storedprocedure.dto.*;
import com.iagent.storedprocedure.history.*;
import com.iagent.storedprocedure.model.StoredProcedureService;
import com.iagent.storedprocedure.repository.StoredProcedureServiceRepository;
import org.springframework.stereotype.Service;
import java.sql.*;
import java.time.Instant;
import java.util.*;

@Service
public class StoredProcedureServiceManager {
 private final StoredProcedureServiceRepository repository; private final DbConnectionManager connections; private final StoredProcedureExecutionLogRepository history;
 public StoredProcedureServiceManager(StoredProcedureServiceRepository r,DbConnectionManager c,StoredProcedureExecutionLogRepository h){repository=r;connections=c;history=h;}
 public List<StoredProcedureResponse> list(){return repository.findAllByOrderByCreatedAtDesc().stream().map(this::response).toList();}
 public StoredProcedureResponse details(String id){return response(get(id));}
 public List<StoredProcedureHistoryResponse> history(){return history.findAllByOrderByExecutedAtDesc().stream().map(this::historyResponse).toList();}
 public List<StoredProcedureHistoryResponse> serviceHistory(String id){get(id);return history.findByServiceIdOrderByExecutedAtDesc(id).stream().map(this::historyResponse).toList();}
 public StoredProcedureExecutionResponse test(TestStoredProcedureRequest r){DbConnection c=connections.get(r.connectionId()); return execute(c,null,r.procedureName(),r.parameters(),r.values(),false);}
 public StoredProcedureResponse create(CreateStoredProcedureRequest r){String n=r.serviceName().trim(), ep=normalize(r.endpointPath()); if(repository.existsByServiceName(n))throw new DuplicateResourceException("Stored Procedure service name already exists: "+n);if(repository.existsByEndpointPath(ep))throw new DuplicateResourceException("Stored Procedure endpoint already exists: "+ep);DbConnection c=connections.get(r.connectionId());List<StoredProcedureParameterRequest> ps=cleanParams(r.parameters());execute(c,null,r.procedureName().trim(),ps,r.values(),false);StoredProcedureService s=new StoredProcedureService();s.setServiceName(n);s.setEndpointPath(ep);s.setConnectionId(c.getId());s.setProcedureName(r.procedureName().trim());s.setParameters(toModel(ps));s.setEnabled(r.enabled()==null||r.enabled());Instant now=Instant.now();s.setCreatedAt(now);s.setUpdatedAt(now);return response(repository.save(s));}
 public StoredProcedureExecutionResponse execute(String id,Map<String,Object> values){StoredProcedureService s=get(id);if(!s.isEnabled())throw new BadRequestException("Stored Procedure service is disabled: "+s.getServiceName());return executeSaved(s,values);}
 public StoredProcedureExecutionResponse runtime(String path,Map<String,Object> values){StoredProcedureService s=repository.findByEndpointPath(normalize(path)).orElseThrow(()->new ResourceNotFoundException("Stored Procedure endpoint not found: "+path));if(!s.isEnabled())throw new BadRequestException("Stored Procedure service is disabled: "+s.getServiceName());return executeSaved(s,values);}
 private StoredProcedureExecutionResponse executeSaved(StoredProcedureService s,Map<String,Object> values){DbConnection c=connections.get(s.getConnectionId());long start=System.nanoTime();try{StoredProcedureExecutionResponse r=execute(c,s.getId(),s.getProcedureName(),s.getParameters().stream().map(p->new StoredProcedureParameterRequest(p.getName(),p.getMode(),p.getSqlType())).toList(),values,true);save(s,c,values,r,"SUCCESS",null,(System.nanoTime()-start)/1_000_000);return r;}catch(RuntimeException e){save(s,c,values,null,"FAILED",e.getMessage(),(System.nanoTime()-start)/1_000_000);throw e;}}
 private StoredProcedureExecutionResponse execute(DbConnection c,String id,String procedure,List<?> params,Map<String,Object> values,boolean unused){List<StoredProcedureParameterRequest> ps=params==null?List.of():params.stream().map(x->(StoredProcedureParameterRequest)x).toList();Map<String,Object> v=values==null?Map.of():values;String call=buildCall(procedure,ps.size());long start=System.nanoTime();try(Connection db=DriverManager.getConnection(c.getJdbcUrl(),c.getUsername(),c.getPassword());CallableStatement st=db.prepareCall(call)){for(int i=0;i<ps.size();i++){StoredProcedureParameterRequest p=ps.get(i);String mode=mode(p.mode());if("IN".equals(mode)||"INOUT".equals(mode)){if(!v.containsKey(p.name()))throw new BadRequestException("Missing stored procedure parameter: "+p.name());st.setObject(i+1,v.get(p.name()));}if("OUT".equals(mode)||"INOUT".equals(mode))st.registerOutParameter(i+1,sqlType(p.sqlType()));}st.execute();Map<String,Object> out=new LinkedHashMap<>();for(int i=0;i<ps.size();i++){String mode=mode(ps.get(i).mode());if("OUT".equals(mode)||"INOUT".equals(mode))out.put(ps.get(i).name(),st.getObject(i+1));}return new StoredProcedureExecutionResponse(id,null,true,out,(System.nanoTime()-start)/1_000_000);}catch(SQLException e){throw new BadRequestException("Stored Procedure execution failed: "+e.getMessage());}}
 private void save(StoredProcedureService s,DbConnection c,Map<String,Object> values,StoredProcedureExecutionResponse r,String status,String error,long ms){StoredProcedureExecutionLog l=new StoredProcedureExecutionLog();l.setServiceId(s.getId());l.setServiceName(s.getServiceName());l.setEndpointPath(s.getEndpointPath());l.setConnectionName(c.getName());l.setProcedureName(s.getProcedureName());l.setRequestParameters(values==null?Map.of():values);l.setResponse(r==null?null:r.output());l.setStatus(status);l.setErrorMessage(error);l.setExecutionTimeMs(ms);l.setExecutedAt(Instant.now());history.save(l);}
 private StoredProcedureService get(String id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Stored Procedure service not found: "+id));}
 private StoredProcedureResponse response(StoredProcedureService s){return new StoredProcedureResponse(s.getId(),s.getServiceName(),s.getConnectionId(),connections.get(s.getConnectionId()).getName(),s.getProcedureName(),s.getEndpointPath(),s.getParameters(),s.isEnabled(),s.getCreatedAt(),s.getUpdatedAt());}
 private String normalize(String x){if(x==null||x.isBlank())throw new BadRequestException("Endpoint path cannot be empty.");return x.trim().startsWith("/")?x.trim():"/"+x.trim();}
 private String buildCall(String p,int count){if(p==null||p.isBlank())throw new BadRequestException("Procedure name cannot be empty.");return "{call "+p+"("+String.join(",",Collections.nCopies(count,"?"))+")}";}
 private String mode(String m){String x=m==null?"IN":m.trim().toUpperCase(Locale.ROOT);if(!Set.of("IN","OUT","INOUT").contains(x))throw new BadRequestException("Parameter mode must be IN, OUT or INOUT.");return x;}
 private int sqlType(String t){try{return Types.class.getField((t==null?"VARCHAR":t).toUpperCase(Locale.ROOT)).getInt(null);}catch(Exception e){throw new BadRequestException("Unsupported SQL type: "+t);}}
 private List<StoredProcedureParameterRequest> cleanParams(List<StoredProcedureParameterRequest> p){return p==null?List.of():p;}
 private List<StoredProcedureService.Parameter> toModel(List<StoredProcedureParameterRequest> ps){List<StoredProcedureService.Parameter> out=new ArrayList<>();for(var p:ps){var x=new StoredProcedureService.Parameter();x.setName(p.name());x.setMode(mode(p.mode()));x.setSqlType((p.sqlType()==null?"VARCHAR":p.sqlType()).toUpperCase(Locale.ROOT));out.add(x);}return out;}
 private StoredProcedureHistoryResponse historyResponse(StoredProcedureExecutionLog l){return new StoredProcedureHistoryResponse(l.getId(),l.getServiceId(),l.getServiceName(),l.getEndpointPath(),l.getConnectionName(),l.getProcedureName(),l.getRequestParameters(),l.getResponse(),l.getStatus(),l.getErrorMessage(),l.getExecutionTimeMs(),l.getExecutedAt());}
}
