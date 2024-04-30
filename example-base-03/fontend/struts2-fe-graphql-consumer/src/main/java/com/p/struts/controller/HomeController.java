package com.p.struts.controller;


import com.opensymphony.xwork2.ActionSupport;
import com.p.struts.model.User;

public class HomeController extends ActionSupport {
    private User user;

    public String execute() {
        user = new User("John", "Doe");
        return SUCCESS;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
