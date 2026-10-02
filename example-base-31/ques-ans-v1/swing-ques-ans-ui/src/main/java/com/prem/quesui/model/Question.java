package com.prem.quesui.model;

import java.util.ArrayList;
import java.util.List;

public class Question {
    private String id;
    private String question;
    private List<String> answers = new ArrayList<>();
    private List<String> tags = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getAnswers() { return answers; }
    public void setAnswers(List<String> answers) {
        this.answers = answers == null ? new ArrayList<>() : answers;
    }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) {
        this.tags = tags == null ? new ArrayList<>() : tags;
    }

    @Override
    public String toString() {
        return question;
    }
}
