package com.p.search.api.pojo;

import java.util.UUID;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class V1ToV2Mapper {
    public CategoryV2 convertToCategory(CategoryV1 category){
        return CategoryV2.builder()
                .name(getFirstNWords(category.getCategoryName(),10))
                .heading(removeHtmlTags(category.getCategoryName(), "HEADING_"))
                .smartContent(generateSmartContent(category.getCategoryName(),true))
                .rating(category.getRating())
                .parentId(category.getParentId())
                .sourceDB("interview_mgmt")
                .build();
    }

    public QuestionV2 convertToQuestion(CategoryV1.QuestionV1 question, String linkedCategoryId){
        return QuestionV2.builder()
                .name(getFirstNWords(question.getQues(),10))
                .heading(removeHtmlTags(question.getQues(),"HEADING_"))
                .smartContent(generateSmartContent(question.getQues(), true))
                .rating(question.getRating())
                .order(0)
                .linkedCategoryId(linkedCategoryId)
                .parentId("")
                .build();
    }

    public AnswerV2 convertToAnswer(CategoryV1.QuestionV1.AnswerV1 answer, String linkedQuestionsId){

        return AnswerV2.builder()
                .name(getFirstNWords(answer.getAnswer(), 15))
                .heading(getFirstNWords(answer.getAnswer(), 10))
                .smartContent(generateSmartContent(answer.getAnswer(), true))
                .order(0)
                .linkedQuestionsId(linkedQuestionsId)
                .rating(answer.getRating())
                .build();
    }

    private String removeHtmlTags(String htmlContent, String prefix) {
        if(htmlContent!=null && htmlContent.trim().length()>0){
            return Jsoup.parse(htmlContent).text();
        }else{
            return (prefix!=null && !prefix.isEmpty() ?prefix:"DEFAULT_PREFIX_")+generateUUID();
        }
    }

    public String getFirstNWords(String htmlContent, int n) {
        String sentence = removeHtmlTags(htmlContent,"");
        if (sentence == null || sentence.isEmpty() || n <= 0) {
            return "";
        }

        String[] words = sentence.split("\\s+");
        if (words.length <= n) {
            return sentence;
        }

        StringBuilder result = new StringBuilder();
        for (int i = 0; i < n; i++) {
            result.append(words[i]);
            if (i < n - 1) {
                result.append(" ");
            }
        }

        return result.toString();
    }
    private String generateUUID() {
        return UUID.randomUUID().toString();
    }

    private SmartContent generateSmartContent(String description, boolean placeDefaultContent){
        return SmartContent.builder()
                .content(description!=null && !description.isEmpty()?
                        description:
                        (placeDefaultContent?
                                "<h1> default content. Replace it with meaningful content</h1>":
                                "")
                )
                .textOutputType("html")
                .textInputType("CKEditor")
                .build();
    }


}
