package com.prem.gateway;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/fallback")
public class FallbackController {
 @GetMapping("/order") @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
 public Map<String,Object> order(){return Map.of("service","order-service","message","Order service unavailable","fallback",true);}
 @GetMapping("/product") @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
 public Map<String,Object> product(){return Map.of("service","product-service","message","Product service unavailable","fallback",true);}
}
