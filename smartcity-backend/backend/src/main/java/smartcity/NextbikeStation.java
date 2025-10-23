package com.smartcity;


import com.fasterxml.jackson.annotation.JsonProperty;

public class NextbikeStation {
    @JsonProperty("station_id")


    public String stationId;

    public String name;
    public double lat;
    public double lon;
    public int capacity;
}