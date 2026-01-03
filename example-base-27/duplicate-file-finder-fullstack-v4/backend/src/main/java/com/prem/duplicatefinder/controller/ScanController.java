package com.prem.duplicatefinder.controller;
import com.prem.duplicatefinder.entity.*;import com.prem.duplicatefinder.model.*;import com.prem.duplicatefinder.service.DuplicateScanService;import jakarta.validation.Valid;import org.springframework.http.MediaType;import org.springframework.web.bind.annotation.*;import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;import java.io.IOException;import java.util.List;import java.util.Map;import java.util.concurrent.*;
@RestController @RequestMapping("/api/duplicates") public class ScanController{
 private final DuplicateScanService s;public ScanController(DuplicateScanService s){this.s=s;}
 @PostMapping("/scan") public Map<String,String>start(@Valid @RequestBody ScanRequest r){return Map.of("jobId",s.start(r.rootPath(),r.normalizedIgnoredFolders()));}
 @GetMapping("/scan/{id}")public ScanJobEntity status(@PathVariable String id){return s.getJob(id);}
 @PostMapping("/scan/{id}/cancel")public Map<String,String>cancel(@PathVariable String id){s.cancel(id);return Map.of("message","Cancellation requested");}
 @GetMapping(value="/scan/{id}/events",produces=MediaType.TEXT_EVENT_STREAM_VALUE)public SseEmitter events(@PathVariable String id){
  SseEmitter em=new SseEmitter(0L);ScheduledExecutorService ex=Executors.newSingleThreadScheduledExecutor();Runnable r=()->{try{ScanJobEntity j=s.getJob(id);em.send(SseEmitter.event().name("progress").data(j));if(List.of("COMPLETED","FAILED","CANCELLED").contains(j.getStatus().name())){ex.shutdown();em.complete();}}catch(IOException e){ex.shutdown();em.completeWithError(e);}catch(Exception e){ex.shutdown();em.completeWithError(e);}};ex.scheduleAtFixedRate(r,0,500,TimeUnit.MILLISECONDS);em.onCompletion(ex::shutdown);return em;}
 @GetMapping("/scan/{id}/groups")public DuplicatePage groups(@PathVariable String id,@RequestParam(defaultValue="0")int page,@RequestParam(defaultValue="10")int size,@RequestParam(defaultValue="wastedBytes")String sortBy,@RequestParam(defaultValue="desc")String direction){return s.page(id,page,size,sortBy,direction);}
}
