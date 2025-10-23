import { useRef, useEffect, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { config } from "../config";
import { convertToGeoJson } from "../utils/convertToGeoJson.ts";
import "./mapLayer.scss";

interface MapLayerProps {
  activeLayer: string;
}

const MapLayer: React.FC<MapLayerProps> = ({ activeLayer }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  mapboxgl.accessToken = config.map.token;

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [config.map.longitude, config.map.latitude],
        zoom: config.map.zoom,
      });

      mapInstanceRef.current.on("load", () => {
        setMapLoaded(true);
      });
    }
  }, []);

  // Fetch stations and update layer
  useEffect(() => {
    if (!mapLoaded) return;

    const fetchStations = async () => {
      try {
        const res = await fetch("http://localhost:8080/stations");
        const data = await res.json();
        if (!data.data?.stations) {
          console.error("no stations in response:", data);
          return;
        }

        console.log("Stations fetched:", data.data?.stations.length);

        const geojson = convertToGeoJson(data.data.stations);

        if (!mapInstanceRef.current?.getSource("stations")) {
          // Add source
          mapInstanceRef.current?.addSource("stations", {
            type: "geojson",
            data: geojson,
          });

          // Add layer
          mapInstanceRef.current?.addLayer({
            id: "stations-layer",
            type: "circle",
            source: "stations",
            paint: {
              "circle-radius": 15,
              "circle-color": "#ff3333",
              "circle-stroke-width": 2,
              "circle-opacity": 0.8,
              "circle-stroke-color": "#fff",
            },
          });

          // Popup on click
          mapInstanceRef.current?.on("click", "stations-layer", (e) => {
            if (!e.features || !e.features[0].properties) return;
            const props = e.features[0].properties;
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `<strong>${props.name}</strong><br/>Capacity: ${props.capacity}`
              )
              .addTo(mapInstanceRef.current!);
          });

          // Cursor pointer on hover
          mapInstanceRef.current?.on("mouseenter", "stations-layer", () => {
            mapInstanceRef.current!.getCanvas().style.cursor = "pointer";
          });
          mapInstanceRef.current?.on("mouseleave", "stations-layer", () => {
            mapInstanceRef.current!.getCanvas().style.cursor = "";
          });
        } else {
          // Update data if source already exists
          (
            mapInstanceRef.current.getSource(
              "stations"
            ) as mapboxgl.GeoJSONSource
          ).setData(geojson);
        }

        // Toggle layer visibility
        const visibility = activeLayer === "stations" ? "visible" : "none";
        mapInstanceRef.current?.setLayoutProperty(
          "stations-layer",
          "visibility",
          visibility
        );
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };

    fetchStations();
  }, [mapLoaded, activeLayer]);

  // Search function
  const handleSearch = async () => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchQuery
      )}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      mapInstanceRef.current?.flyTo({ center: [lng, lat], zoom: 15 });
    }
  };

  return (
    <div>
      <div className="searchbar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      <div ref={mapContainerRef} className="map_wrapper" />
    </div>
  );
};

export default MapLayer;
