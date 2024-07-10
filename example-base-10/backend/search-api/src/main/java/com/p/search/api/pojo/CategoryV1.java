package com.p.search.api.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryV1 {
    private String uniqueId;
    private Integer categoryId;
    private String categoryName;
    private String title;
    private Integer cat_id;
    private String cat_name;
    private Integer rating;
    private String sourceDB;
    private String parentId;

    @Builder.Default
    private List<QuestionV1> questions= new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionV1{
        private String uniqueId;
        private Integer quesId;
        private Integer linkedCatId;
        private Integer ques_id;
        private Integer linked_cat_id;
        private String ques;
        private String title;
        private Integer rating;
        private boolean hidden;

        @Builder.Default
        private List<AnswerV1> answers=new ArrayList<>();

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class AnswerV1{
            private String uniqueId;
            private Integer ansId;
            private Integer linkedCatId;
            private Integer linkedQuesId;
            private Integer ans_id;
            private String answer;
            private String title;
            private Integer rating;
        }
    }

}
