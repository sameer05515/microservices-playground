package com.iagent.storedprocedure.controller;
import com.iagent.storedprocedure.dto.*;
import com.iagent.storedprocedure.service.StoredProcedureServiceManager;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;import java.util.Map;
@RestController
@RequestMapping("/api/stored-procedure-services")
public class StoredProcedureServiceController {
 private final StoredProcedureServiceManager manager;
 public StoredProcedureServiceController(StoredProcedureServiceManager m){manager=m;}
 @GetMapping public List<StoredProcedureResponse> list(){return manager.list();}
 @GetMapping("/{id}") public StoredProcedureResponse details(@PathVariable String id){return manager.details(id);}
 @PostMapping("/test") public StoredProcedureExecutionResponse test(@Valid @RequestBody TestStoredProcedureRequest r){return manager.test(r);}
 @PostMapping public StoredProcedureResponse create(@Valid @RequestBody CreateStoredProcedureRequest r){return manager.create(r);}
 @PostMapping("/{id}/execute") public StoredProcedureExecutionResponse execute(@PathVariable String id,@RequestBody(required=false) Map<String,Object> values){return manager.execute(id,values);}
 @PostMapping("/runtime/{path}") public StoredProcedureExecutionResponse runtime(@PathVariable String path,@RequestBody(required=false) Map<String,Object> values){return manager.runtime("/"+path,values);}
 @GetMapping("/execution-history") public List<StoredProcedureHistoryResponse> history(){return manager.history();}
 @GetMapping("/{id}/execution-history") public List<StoredProcedureHistoryResponse> serviceHistory(@PathVariable String id){return manager.serviceHistory(id);}
}
