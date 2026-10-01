package com.example.jsonviewer.model;

import java.util.List;

public class DataModel {
    public List<Company> companies;
    public List<Project> projects;
    public List<ProjectDetail> projectDetails;

    public static class Company {
        public String id;
        public String name;
        public String industry;
        public String location;
        public String createdAt;
        @Override public String toString() { return name; }
    }

    public static class Project {
        public String id;
        public String companyId;
        public String name;
        public String description;
        public String status;
        public String startDate;
        public String endDate;
        public String createdAt;
        @Override public String toString() { return name; }
    }

    public static class ProjectDetail {
        public String id;
        public String projectId;
        public String technology;
        public Integer teamSize;
        public Double budget;
        public String clientName;
        public String notes;
    }
}
