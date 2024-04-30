package com.p.gxt.service;

import com.google.gwt.user.client.rpc.RemoteService;
import com.p.gxt.pojo.Resume;

public interface ResumeService extends RemoteService {
    Resume getResume();
}
