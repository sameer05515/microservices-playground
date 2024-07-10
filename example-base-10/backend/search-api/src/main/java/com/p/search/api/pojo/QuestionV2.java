package com.p.search.api.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionV2 {
    private String uniqueId;
    private String name;
    private String heading;
    private SmartContent smartContent;
    private Integer rating;
    private String parentId;
    private String linkedCategoryId;
    private Integer order;
}
