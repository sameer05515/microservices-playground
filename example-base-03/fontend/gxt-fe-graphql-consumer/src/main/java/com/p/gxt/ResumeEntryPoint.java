package com.p.gxt;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JsonUtils;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.RootPanel;
import com.p.gxt.pojo.Resume;
import com.p.gxt.service.ResumeService;
import com.p.gxt.service.ResumeServiceAsync;
import com.sencha.gxt.core.client.util.Margins;
import com.sencha.gxt.widget.core.client.ContentPanel;
import com.sencha.gxt.widget.core.client.container.VerticalLayoutContainer;
import com.sencha.gxt.widget.core.client.container.VerticalLayoutContainer.VerticalLayoutData;
import com.sencha.gxt.widget.core.client.form.TextField;
import com.sencha.gxt.widget.core.client.toolbar.ToolBar;
import com.sencha.gxt.widget.core.client.toolbar.ToolBar.ToolBarAppearance;
import com.sencha.gxt.widget.core.client.toolbar.ToolBar.ToolBarResources;
import com.sencha.gxt.widget.core.client.toolbar.ToolBar.ToolBarStrings;

public class ResumeEntryPoint implements EntryPoint {

    @Override
    public void onModuleLoad() {
        fetchDataAndRenderResume();
    }

    private void fetchDataAndRenderResume() {
        ResumeServiceAsync resumeService = GWT.create(ResumeService.class);
        resumeService.getResume(new AsyncCallback<Resume>() {
            @Override
            public void onFailure(Throwable caught) {
                // Handle failure
            }

            @Override
            public void onSuccess(Resume result) {
                renderResume(result);
            }
        });
    }

    private void renderResume(Resume resume) {
        ContentPanel panel = new ContentPanel();
        panel.setHeadingText("Resume");

        VerticalLayoutContainer container = new VerticalLayoutContainer();

        TextField nameField = new TextField();
        nameField.setTitle("Name");
        nameField.setValue(resume.getName());

        TextField emailField = new TextField();
        emailField.setTitle("Email");
        emailField.setValue(resume.getEmail());

        // Add more fields as needed...

        container.add(nameField, new VerticalLayoutData(1, -1, new Margins(10)));
        container.add(emailField, new VerticalLayoutData(1, -1, new Margins(10)));

        panel.setWidget(container);
        RootPanel.get().add(panel);
    }
}
