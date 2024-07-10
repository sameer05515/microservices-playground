package com.p.search.api.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmartContent {
    private String content;
    private String textOutputType="html";
    private String textInputType="CKEditor";
}
