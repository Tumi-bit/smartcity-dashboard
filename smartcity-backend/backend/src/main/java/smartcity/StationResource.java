package com.smartcity;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import jakarta.inject.Inject;

@Path("/stations")
public class StationResource {

    @Inject
    @RestClient
    NextbikeClient nextbikeClient;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStations() {
        try {
            NextbikeClient.StationResponse response = nextbikeClient.fetchStations();

            return Response.ok(response)
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Failed to fetch stations\"}")
                    .build();
        }
    }
}
