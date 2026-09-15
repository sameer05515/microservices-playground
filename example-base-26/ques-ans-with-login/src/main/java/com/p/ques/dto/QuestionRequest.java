package com.p.ques.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.ArrayList;
import java.util.List;

public class QuestionRequest {

    @NotBlank(message = "Question is required")
    private String question;

    @NotEmpty(message = "At least one answer is required")
    private List<@NotBlank(message = "Answer cannot be blank") String> answers;

    private List<String> tags = new ArrayList<>();

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}