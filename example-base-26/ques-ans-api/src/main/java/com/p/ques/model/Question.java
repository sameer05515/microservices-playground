package com.p.ques.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    private String question;

    private List<String> answers = new ArrayList<>();

    private List<String> tags = new ArrayList<>();

    public Question() {
    }

    public Question(String id, String question, List<String> answers, List<String> tags) {
        this.id = id;
        this.question = question;
        this.answers = answers;
        this.tags = tags;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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