package com.smartcity;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import com.smartcity.NextbikeStation;
import java.util.List;


@RegisterRestClient(configKey = "nextbike-api")
public interface NextbikeClient {

    @GET
    @Path("/station_information.json")
    @Produces(MediaType.APPLICATION_JSON)

    StationResponse fetchStations();

    class StationResponse{
        public Data data;
        public static class Data{
            public List<NextbikeStation> stations;
        }
    }
}
