package com.p.ques.service;

import com.p.ques.dto.ExportData;
import com.p.ques.model.Question;
import com.p.ques.model.Tag;
import com.p.ques.repository.QuestionRepository;
import com.p.ques.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExportService {

    private final QuestionRepository questionRepository;

    private final TagRepository tagRepository;

    public ExportService(
            QuestionRepository questionRepository,
            TagRepository tagRepository) {

        this.questionRepository = questionRepository;
        this.tagRepository = tagRepository;
    }

    public ExportData exportAll() {

        List<Tag> tags =
                tagRepository.findAll();

        List<Question> questions =
                questionRepository.findAll();

        return new ExportData(
                1,
                LocalDateTime.now(),
                tags,
                questions
        );
    }
}