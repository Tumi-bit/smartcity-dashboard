import { FeatureCollection, Point } from "geojson";

interface Station {
  station_id: string;
  name: string;
  short_name: string;
  lat: number;
  lon: number;
  capacity: number;
  rental_uris?: {
    android?: string;
    ios?: string;
    web?: string;
  };
  is_virtual_station: boolean;
}
interface StationProperties {
  station_id: string;
  name: string;
  short_name: string;
  capacity: number;
  rental_uris?: {
    android?: string;
    ios?: string;
    web?: string;
  };
  is_virtual_station: boolean;
}

export const convertToGeoJson = (
  stations: Station[]
): FeatureCollection<Point, StationProperties> => {
  return {
    type: "FeatureCollection",
    features: stations.map((station) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [station.lon, station.lat],
      },
      properties: {
        station_id: station.station_id,
        name: station.name,
        short_name: station.short_name,
        capacity: station.capacity,
        rental_uris: station.rental_uris,
        is_virtual_station: station.is_virtual_station,
      },
    })),
  };
};
