package com.prem.duplicatefinder.model;
import java.util.List;
public record DuplicatePage(List<DuplicateGroup> content,int page,int size,long totalElements,int totalPages,String sortBy,String direction){}
