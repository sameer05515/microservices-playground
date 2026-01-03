package com.prem.fileutils.model;

public class JobInfo {

    public enum Status {
        QUEUED, RUNNING, COMPLETED, FAILED
    }

    private final String jobId;
    private final String type;

    private volatile Status status = Status.QUEUED;
    private volatile long processed;
    private volatile long total;
    private volatile String message = "Queued";
    private volatile String error;

    public JobInfo(String jobId, String type) {
        this.jobId = jobId;
        this.type = type;
    }

    public String getJobId() { return jobId; }
    public String getType() { return type; }
    public Status getStatus() { return status; }
    public long getProcessed() { return processed; }
    public long getTotal() { return total; }
    public String getMessage() { return message; }
    public String getError() { return error; }

    public int getProgress() {
        if (total <= 0) {
            return status == Status.COMPLETED ? 100 : 0;
        }
        return (int) Math.min(100, (processed * 100) / total);
    }

    public void running(long total, String message) {
        this.status = Status.RUNNING;
        this.total = total;
        this.message = message;
    }

    public void progress(long processed, String message) {
        this.processed = processed;
        this.message = message;
    }

    public void completed() {
        this.processed = this.total;
        this.status = Status.COMPLETED;
        this.message = "Completed";
    }

    public void failed(Exception e) {
        this.status = Status.FAILED;
        this.error = e.getMessage();
        this.message = "Failed";
    }
}
