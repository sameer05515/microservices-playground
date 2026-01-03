package com.example.todo.todo;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.example.todo.config.ObservabilityMetrics;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;

@Service @RequiredArgsConstructor
public class TodoCacheService {
    private final RedisTemplate<String,Object> redis;
    private final ObservabilityMetrics metrics;
    @Value("${app.redis.todo-cache-ttl-seconds:60}") private long ttl;
    public TodoPageResponse get(String username,String search,Boolean completed,int page,int size,String sort){Object o=redis.opsForValue().get(key(username,search,completed,page,size,sort)); if(o instanceof TodoPageResponse p){ metrics.cacheHit(); return p; } metrics.cacheMiss(); return null;}
    public void put(String username,String search,Boolean completed,int page,int size,String sort,TodoPageResponse response){redis.opsForValue().set(key(username,search,completed,page,size,sort),response,Duration.ofSeconds(ttl));}
    public void invalidateUser(String username){String versionKey="todo:cache-version:"+username; redis.opsForValue().increment(versionKey); redis.expire(versionKey,Duration.ofHours(24));}
    private String key(String username,String search,Boolean completed,int page,int size,String sort){String version=String.valueOf(redis.opsForValue().get("todo:cache-version:"+username)); if(version.equals("null"))version="0"; return "todo:page:"+username+":"+version+":"+sha(username,String.valueOf(search),String.valueOf(completed),String.valueOf(page),String.valueOf(size),String.valueOf(sort));}
    private String sha(String... parts){try{var md=MessageDigest.getInstance("SHA-256");byte[] b=md.digest(String.join("|",parts).getBytes(StandardCharsets.UTF_8));StringBuilder s=new StringBuilder();for(byte x:b)s.append(String.format("%02x",x));return s.substring(0,24);}catch(Exception e){throw new IllegalStateException(e);}}
}
