package com.p.gxt.service;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.p.gxt.pojo.Resume;

public interface ResumeServiceAsync {
    void getResume(AsyncCallback<Resume> callback);
}
