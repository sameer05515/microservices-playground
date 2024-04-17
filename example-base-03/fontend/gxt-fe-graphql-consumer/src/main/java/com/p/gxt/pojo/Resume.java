package com.p.gxt.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private String email;

}
