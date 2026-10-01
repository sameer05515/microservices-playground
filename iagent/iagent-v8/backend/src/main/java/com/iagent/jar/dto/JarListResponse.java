package com.iagent.jar.dto;

import java.time.Instant;

public record JarListResponse(String id, String fileName, long size, Instant uploadedAt) {}
