package com.prem.order;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
@RestController @RequestMapping("/orders")
public class OrderController {
 private final ProductClient client;
 public OrderController(ProductClient client){this.client=client;}
 @GetMapping("/{orderId}")
 public Mono<OrderResponse> get(@PathVariable Long orderId,@RequestParam(defaultValue="1") Long productId){
   return client.getProduct(productId).map(p->new OrderResponse(orderId,p.id(),p.name(),p.price(),p.name().startsWith("Fallback")));
 }
 record OrderResponse(Long orderId,Long productId,String productName,double price,boolean fallback){}
}
