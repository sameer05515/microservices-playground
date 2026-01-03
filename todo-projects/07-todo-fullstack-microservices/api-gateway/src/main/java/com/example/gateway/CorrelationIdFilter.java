package com.example.gateway;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import java.util.UUID;
@Component
public class CorrelationIdFilter implements GlobalFilter, Ordered {
 public Mono<Void> filter(ServerWebExchange ex, org.springframework.cloud.gateway.filter.GatewayFilterChain chain){
  String cid=ex.getRequest().getHeaders().getFirst("X-Correlation-ID"); if(cid==null||cid.isBlank())cid=UUID.randomUUID().toString();
  final String id=cid; final String rid=UUID.randomUUID().toString();
  ServerWebExchange m=ex.mutate().request(r->r.headers(h->{h.set("X-Correlation-ID",id);h.set("X-Request-ID",rid);})).build();
  m.getResponse().getHeaders().set("X-Correlation-ID",id); m.getResponse().getHeaders().set("X-Request-ID",rid); return chain.filter(m);
 }
 public int getOrder(){return Ordered.HIGHEST_PRECEDENCE;}
}
