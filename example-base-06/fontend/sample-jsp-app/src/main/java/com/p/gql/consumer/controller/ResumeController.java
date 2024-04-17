package com.p.gql.consumer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.p.gql.consumer.model.Resume;
import com.p.gql.consumer.model.Resume2;
import com.p.gql.consumer.service.ResumeService;
import com.p.gql.consumer.service.ResumeService2;

@Controller
public class ResumeController {
    private final ResumeService resumeService;
    private final ResumeService2 resumeService2;

    public ResumeController(ResumeService resumeService, ResumeService2 resumeService2) {
        this.resumeService = resumeService;
        this.resumeService2 = resumeService2;
    }

    @GetMapping("/resume/{id}")
    public String getResume(@PathVariable int id, Model model) {
        Resume resume = resumeService.getResume(id);
        System.out.println(resume);
        model.addAttribute("resume", resume);
        return "resume";
    }

    @GetMapping("/resume2/{id}")
    public String getResume2(@PathVariable String id, Model model) {
        Resume2 resume = resumeService2.getResume(id);
        System.out.println(resume);
        model.addAttribute("resume", resume);
        return "resume2";
    }

    // @RequestMapping("/helloWorld")
    // public String helloWorld(Model model) {
    //     model.addAttribute("message", "Hello World!");
    //     return "helloWorld";
    // }
}
