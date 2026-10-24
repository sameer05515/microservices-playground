package com.interviewgym.questions;
import java.util.List;
public record Question(String id,String category,String topic,String difficulty,String question,String answer,List<String> tags) {}
