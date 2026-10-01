package com.iagent.swingclient.model;

public enum ServiceType {
    JAVA_SERVICE("JavaService"),
    DB_SERVICE("DbService");

    private final String label;
    ServiceType(String label) { this.label = label; }
    @Override public String toString() { return label; }
}
