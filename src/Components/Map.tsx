import React, { useEffect, useRef } from "react";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  onMapClick: (lat: number, lng: number) => void;
}

const Map: React.FC<MapProps> = ({ onMapClick }) => {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map("map").setView([17.4254, 78.4505], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      mapRef.current.on("click", async function (e) {
        const { lat, lng } = e.latlng;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const placeName = data.display_name || "Unknown location";

          L.marker([lat, lng])
            .addTo(mapRef.current!)
            .bindPopup(`You clicked at ${lat}, ${lng}<br>${placeName}`)
            .openPopup();

          onMapClick(lat, lng);
        } catch (error) {
          console.error("Error fetching place name:", error);

          L.marker([lat, lng])
            .addTo(mapRef.current!)
            .bindPopup(`You clicked at ${lat}, ${lng}<br>Unknown location`)
            .openPopup();

          onMapClick(lat, lng);
        }
      });
    }

    return () => {
      if (mapRef.current !== null) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onMapClick]);

  useEffect(() => {
    if (mapRef.current !== null) {
      // If mapRef.current is not null, it means the map has been initialized, and we can set the view.
      const { lat, lng } = mapRef.current.getCenter();
      if (lat !== 17.4254 || lng !== 78.4505) {
        mapRef.current.setView([lat, lng], 13);
      }
    }
  }, []);

  return (
    <div
      onClick={(e) => {
        console.log(e.target);
      }}
      id="map"
      style={{ height: "500px", width: "100%" }}
    ></div>
  );
};

export default Map;
