package com.p.singleton.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SingletonDemoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testEnumSingletonEndpoint() throws Exception {
        mockMvc.perform(get("/api/singleton/enum"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pattern").value("Enum Singleton (Recommended)"));
    }

    @Test
    void testDoubleCheckSingletonEndpoint() throws Exception {
        mockMvc.perform(get("/api/singleton/double-check"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pattern").value("Double-Check Locking Singleton"));
    }

    @Test
    void testBillPughSingletonEndpoint() throws Exception {
        mockMvc.perform(get("/api/singleton/bill-pugh"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pattern").exists());
    }

    @Test
    void testCompareEndpoint() throws Exception {
        mockMvc.perform(get("/api/singleton/compare"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enumSingleton").exists())
                .andExpect(jsonPath("$.doubleCheckLocking").exists());
    }

    @Test
    void testInfoEndpoint() throws Exception {
        mockMvc.perform(get("/api/singleton/info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.patterns").exists());
    }
}

