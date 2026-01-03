package com.iagent.jar.dto;
import java.time.Instant;
public record JarUploadResponse(String id,String fileName,String storagePath,long size,Instant uploadedAt){}
