package com.example.todo.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.*;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.*;

@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String,Object> redisTemplate(RedisConnectionFactory factory, ObjectMapper mapper){
        RedisTemplate<String,Object> t=new RedisTemplate<>(); t.setConnectionFactory(factory);
        StringRedisSerializer keys=new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer values=new GenericJackson2JsonRedisSerializer(mapper);
        t.setKeySerializer(keys); t.setHashKeySerializer(keys); t.setValueSerializer(values); t.setHashValueSerializer(values); t.afterPropertiesSet(); return t;
    }
}
