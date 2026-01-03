package com.example.todo.config;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Component
public class RedisDistributedLock {
    private static final String RELEASE_SCRIPT = "if redis.call('get',KEYS[1]) == ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end";
    private final StringRedisTemplate redis; private final long ttl;
    public RedisDistributedLock(StringRedisTemplate redis,@Value("${app.redis.lock-ttl-seconds:10}") long ttl){this.redis=redis;this.ttl=ttl;}
    public LockHandle tryLock(String name){
        String value=UUID.randomUUID().toString();
        Boolean ok=redis.opsForValue().setIfAbsent("lock:"+name,value,Duration.ofSeconds(ttl));
        return Boolean.TRUE.equals(ok)?new LockHandle("lock:"+name,value):null;
    }
    public void unlock(LockHandle h){
        if(h==null)return;
        redis.execute(new DefaultRedisScript<>(RELEASE_SCRIPT,Long.class), List.of(h.key()), h.value());
    }
    public record LockHandle(String key,String value){}
}
