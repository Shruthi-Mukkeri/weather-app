import React, { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  onMapClick: (lat: number, lng: number) => void;
}

const Map: React.FC<MapProps> = ({ onMapClick }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const [lat, setLat] = useState(17.4254);
  const [lng, setLng] = useState(78.4505);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map("map").setView([lat, lng], 13);

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

        // Update state with the clicked location
        setLat(lat);
        setLng(lng);

        // Set the map view to the clicked location
        mapRef.current!.setView([lat, lng], 13);
      });
    } else {
      // Update the map view when lat or lng state changes
      mapRef.current.setView([lat, lng], 13);
    }

    return () => {
      if (mapRef.current !== null) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, onMapClick]);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default Map;
