package com.prem.quesui.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ExportData {
    private int version;
    private LocalDateTime exportedAt;
    private List<Tag> tags = new ArrayList<>();
    private List<Question> questions = new ArrayList<>();

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    public LocalDateTime getExportedAt() { return exportedAt; }
    public void setExportedAt(LocalDateTime exportedAt) { this.exportedAt = exportedAt; }

    public List<Tag> getTags() { return tags; }
    public void setTags(List<Tag> tags) { this.tags = tags; }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}
