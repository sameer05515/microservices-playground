package com.p.ques.dto;

import com.p.ques.model.Question;
import com.p.ques.model.Tag;

import java.time.LocalDateTime;
import java.util.List;

public class ExportData {

    private int version;

    private LocalDateTime exportedAt;

    private List<Tag> tags;

    private List<Question> questions;

    public ExportData() {
    }

    public ExportData(
            int version,
            LocalDateTime exportedAt,
            List<Tag> tags,
            List<Question> questions) {

        this.version = version;
        this.exportedAt = exportedAt;
        this.tags = tags;
        this.questions = questions;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public LocalDateTime getExportedAt() {
        return exportedAt;
    }

    public void setExportedAt(LocalDateTime exportedAt) {
        this.exportedAt = exportedAt;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}