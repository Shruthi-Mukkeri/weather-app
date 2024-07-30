// import { useRef, useEffect } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const Map = () => {
//   // Define the ref type to be either L.Map or null
//   const mapRef = useRef<L.Map | null>(null);

//   useEffect(() => {
//     // Initialize map if it hasn't been already
//     if (mapRef.current === null) {
//       mapRef.current = L.map("map", {
//         center: [51.505, -0.09],
//         zoom: 13,
//       });

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "&copy; OpenStreetMap contributors",
//       }).addTo(mapRef.current);
//     }

//     // Clean up function to remove map and listeners
//     return () => {
//       if (mapRef.current !== null) {
//         mapRef.current.remove();
//       }
//     };
//   }, []);

//   return <div id="map" style={{ height: "400px", width: "700px" }}></div>;
// };

// export default Map;
import React, { useEffect, useRef } from "react";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

const Map: React.FC = () => {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    // Initialize the map if it hasn't been initialized yet
    if (mapRef.current === null) {
      mapRef.current = L.map("map").setView([51.505, -0.09], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      L.marker([51.5, -0.09])
        .addTo(mapRef.current)
        .bindPopup("A pretty CSS popup.<br> Easily customizable.")
        .openPopup();
    }

    // Cleanup function to remove the map when the component is unmounted
    return () => {
      if (mapRef.current !== null) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default Map;
