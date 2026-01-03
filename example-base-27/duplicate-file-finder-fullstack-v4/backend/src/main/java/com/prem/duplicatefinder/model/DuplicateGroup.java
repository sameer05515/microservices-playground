package com.prem.duplicatefinder.model;
import java.util.List;
public record DuplicateGroup(int groupNumber,long fileSize,String sha256,long wastedBytes,List<DuplicateFile> files){}
