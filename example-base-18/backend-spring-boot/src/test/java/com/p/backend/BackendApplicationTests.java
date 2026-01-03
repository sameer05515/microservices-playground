package com.p.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017/test_db"
})
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // Test that the Spring context loads successfully
    }
}

