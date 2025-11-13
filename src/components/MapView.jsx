import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const formatDate = (isoDate) => {
  if (!isoDate) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return formatter.format(new Date(isoDate));
};

export default function MapView({ city, events, onEventClick, onClose }) {
  const mapInstanceRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const [activeEventId, setActiveEventId] = useState(
    events.length ? events[0].id : null
  );

  const primaryEvent = useMemo(
    () => events.find((event) => event.id === activeEventId) ?? events[0],
    [events, activeEventId]
  );

  useEffect(() => {
    setActiveEventId(events.length ? events[0].id : null);
  }, [events]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!events.length) {
      map.setView([39.5, -98.35], 4);
      return;
    }

    const bounds = L.latLngBounds(
      events.map((event) => [event.latitude, event.longitude])
    );
    map.fitBounds(bounds, { padding: [32, 32] });

    events.forEach((event) => {
      if (!event.latitude || !event.longitude) return;

      const marker = L.circleMarker([event.latitude, event.longitude], {
        radius: 6,
        color: "#c4ff00",
        weight: 2,
        fillColor: "#c4ff00",
        fillOpacity: event.id === activeEventId ? 1 : 0.6,
      })
        .addTo(map)
        .on("click", () => {
          setActiveEventId(event.id);
          onEventClick(event.id);
        });

      markersRef.current.push(marker);
    });
  }, [events, activeEventId, onEventClick]);

  useEffect(() => {
    if (!primaryEvent || !mapInstanceRef.current) return;

    const { latitude, longitude } = primaryEvent;
    if (latitude && longitude) {
      mapInstanceRef.current.setView([latitude, longitude], 12, {
        animate: true,
      });
    }
  }, [primaryEvent]);

  const handleSelectEvent = (eventId) => {
    setActiveEventId(eventId);
    onEventClick(eventId);
  };

  return (
    <div className="map-screen">
      <header className="screen-header">
        <button type="button" className="ghost-button" onClick={onClose}>
          Close
        </button>
        <div className="screen-title">
          <span>{city}</span>
          <span className="separator">|</span>
          <span>{formatDate(primaryEvent?.date)}</span>
        </div>
      </header>

      <section className="map-panel">
        <div ref={mapContainerRef} className="map-container" />

        {primaryEvent?.image && (
          <div className="map-overlay">
            <img src={primaryEvent.image} alt={primaryEvent.name} />
          </div>
        )}
      </section>

      <section className="event-listing">
        <div className="list-header">Events</div>
        <ul>
          {events.map((event) => (
            <li
              key={event.id}
              className={`list-row ${
                event.id === activeEventId ? "active" : ""
              }`}
            >
              <button type="button" onClick={() => handleSelectEvent(event.id)}>
                <span className="event-name">{event.name}</span>
                <span className="event-venue">{event.venueName}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
