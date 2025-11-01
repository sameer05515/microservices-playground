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
    @Builder.Default
    private String textOutputType="html";
    @Builder.Default
    private String textInputType="CKEditor";
}
