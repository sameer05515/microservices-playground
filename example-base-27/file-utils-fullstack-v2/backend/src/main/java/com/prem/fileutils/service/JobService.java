package com.prem.fileutils.service;

import com.prem.fileutils.model.JobInfo;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class JobService {

    private final Map<String, JobInfo> jobs = new ConcurrentHashMap<>();

    public JobInfo create(String type) {
        String id = UUID.randomUUID().toString();
        JobInfo job = new JobInfo(id, type);
        jobs.put(id, job);
        return job;
    }

    public JobInfo get(String id) {
        JobInfo job = jobs.get(id);
        if (job == null) {
            throw new IllegalArgumentException("Job not found: " + id);
        }
        return job;
    }
}
