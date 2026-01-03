package com.prem.duplicatefinder.service;
import com.prem.duplicatefinder.model.DuplicateGroup; import org.springframework.stereotype.Component; import java.util.*; import java.util.concurrent.*;
@Component public class ScanResultStore{
 private final Map<String,List<DuplicateGroup>> data=new ConcurrentHashMap<>();
 public void put(String id,List<DuplicateGroup> x){data.put(id,List.copyOf(x));}
 public List<DuplicateGroup> get(String id){return data.getOrDefault(id,List.of());}
}
