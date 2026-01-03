package com.example.todo.config;
import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException; import java.time.Instant; import java.util.concurrent.*; import java.util.concurrent.atomic.AtomicInteger;
@Component public class RateLimitFilter extends OncePerRequestFilter {
 private static final int LIMIT=120; private static final long WINDOW=60; private final ConcurrentHashMap<String,Bucket> buckets=new ConcurrentHashMap<>();
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{long now=Instant.now().getEpochSecond(); String key=req.getRemoteAddr(); Bucket b=buckets.compute(key,(k,v)->v==null||now-v.start>=WINDOW?new Bucket(now):v); if(b.count.incrementAndGet()>LIMIT){res.setStatus(429);res.setContentType("application/json");res.getWriter().write("{\"status\":429,\"message\":\"Too many requests\"}");return;} chain.doFilter(req,res);}
 static class Bucket{long start; AtomicInteger count=new AtomicInteger(); Bucket(long s){start=s;}}
}
