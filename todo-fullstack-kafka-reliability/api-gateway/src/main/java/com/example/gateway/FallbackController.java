package com.example.gateway;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.Map;
@RestController public class FallbackController {
 @GetMapping("/fallback/todo") ResponseEntity<Map<String,Object>> fallback(){return ResponseEntity.status(503).body(Map.of("timestamp",Instant.now(),"status",503,"message","Todo service is temporarily unavailable"));}
}
