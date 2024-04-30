package com.p.gxt.service.impl;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;
import com.p.gxt.pojo.Resume;
import com.p.gxt.service.ResumeService;
import org.springframework.stereotype.Service;

@Service("resumeService")
public class ResumeServiceImpl extends RemoteServiceServlet implements ResumeService {

    @Override
    public Resume getResume() {
        // Mocked resume data
        Resume resume = new Resume();
        resume.setName("John Doe");
        resume.setEmail("john.doe@example.com");
        // Add more resume data here...
        return resume;
    }
}
