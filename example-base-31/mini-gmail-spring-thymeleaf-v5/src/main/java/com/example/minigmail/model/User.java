package com.example.minigmail.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document("users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private List<Contact> contacts = new ArrayList<>();

    public User() {}

    public User(String id, String name, String email, String password, List<Contact> contacts) {
        this.id = id; this.name = name; this.email = email; this.password = password;
        this.contacts = contacts == null ? new ArrayList<>() : contacts;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public List<Contact> getContacts() { return contacts; }
    public void setContacts(List<Contact> contacts) { this.contacts = contacts; }

    public static class Contact {
        private String name;
        private String email;

        public Contact() {}
        public Contact(String name, String email) { this.name = name; this.email = email; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
