import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { useStateContext } from "../../contexts/contextProvider";

export default function Map() {
  const { inputValue, initialLat, initialLong, allStations, done } =
    useStateContext();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const long = initialLong;
  const lat = initialLat;

  const [zoom] = useState(4);
  const [API_KEY] = useState("HHFe3hZm6VYUkkwbJuHH");

  useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
      center: [long, lat],
      zoom: zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-left");
    map.current.on("load", function () {
      map.current.addSource(done ? inputValue : "places", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: allStations,
        },
      });

      map.current.addLayer({
        id: done ? inputValue : "places",
        type: "symbol",
        source: done ? inputValue : "places",
        layout: {
          "icon-image": "{icon}_15",
          "icon-overlap": "always",
        },
      });

      map.current.on("click", done ? inputValue : "places", function (e) {
        let coordinates = e.features[0].geometry.coordinates.slice();
        let description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map.current);
      });

      map.current.on("mouseenter", done ? inputValue : "places", function () {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", done ? inputValue : "places", function () {
        map.current.getCanvas().style.cursor = "";
      });
    });
  }, [done]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
