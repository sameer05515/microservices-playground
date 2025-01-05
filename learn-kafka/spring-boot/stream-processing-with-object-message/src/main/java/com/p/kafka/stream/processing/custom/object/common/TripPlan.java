package com.p.kafka.stream.processing.custom.object.common;

public class TripPlan {
    private String city;
    private String hotel;
    private double budget;

    // Constructors
    public TripPlan(String city, String hotel, double budget) {
        this.city = city;
        this.hotel = hotel;
        this.budget = budget;
    }

    public TripPlan() {}

    // Getters and Setters
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getHotel() {
        return hotel;
    }

    public void setHotel(String hotel) {
        this.hotel = hotel;
    }

    public double getBudget() {
        return budget;
    }

    public void setBudget(double budget) {
        this.budget = budget;
    }

    @Override
    public String toString() {
        return "TripPlan{" +
                "city='" + city + '\'' +
                ", hotel='" + hotel + '\'' +
                ", budget=" + budget +
                '}';
    }
}
