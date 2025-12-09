import type { GeoData } from "@/types/geo";
import type { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

const MapUpdater = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);

  return null;
};

export default function LocationMap({ geoData }: { geoData: GeoData | null }) {
  if (!geoData?.loc) {
    return (
      <div className="h-[400px] bg-dark-bg rounded-lg flex items-center justify-center border border-dark-border">
        <div className="text-center">
          <div className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-500"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <p className="text-neutral-400">No location data available</p>
        </div>
      </div>
    );
  }

  const [lat, lng] = geoData.loc.split(",").map(Number);
  const position: LatLngExpression = [lat, lng];
  return (
    <div className="h-[400px] rounded-lg overflow-hidden border border-dark-border">
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} draggable={false}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{geoData.ip}</p>
              {geoData.city && geoData.region && (
                <p>
                  {geoData.city}, {geoData.region}
                </p>
              )}
              {geoData.country && <p>{geoData.country}</p>}
            </div>
          </Popup>
        </Marker>
        <MapUpdater center={position} />
      </MapContainer>
    </div>
  );
}
