import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import "leaflet/dist/leaflet.css";

export default function ComplaintMap() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get("/complaints/public/map").then((res) => {
      setComplaints(res.data);
    });
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={6}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {complaints.map((c) =>
          c.location?.lat && c.location?.lng ? (
            <Marker key={c._id} position={[c.location.lat, c.location.lng]}>
              <Popup>
                <b>{c.title}</b>
                <br />
                Status: {c.status}
                <br />
                Priority: {c.priority}
              </Popup>
            </Marker>
          ) : null,
        )}
      </MapContainer>
    </div>
  );
}
