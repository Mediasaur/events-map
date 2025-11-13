import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export default function MapView({
  city,
  events,
  isLoading,
  error,
  onEventClick,
  onClose,
}) {
  const mapInstanceRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const listItemRefs = useRef(new Map());
  const [activeEventId, setActiveEventId] = useState(
    events.length ? events[0].id : null
  );
  const [hoverEventId, setHoverEventId] = useState(null);

  const centerOnEvent = useCallback(
    (eventId) => {
      const event = events.find((item) => item.id === eventId);
      if (event?.latitude && event?.longitude && mapInstanceRef.current) {
        mapInstanceRef.current.setView([event.latitude, event.longitude], 12, {
          animate: true,
          duration: 0.4,
        });
      }
    },
    [events]
  );

  const primaryEvent = useMemo(() => {
    if (!events.length) return null;
    return events.find((event) => event.id === activeEventId) ?? events[0];
  }, [events, activeEventId]);

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

    markersRef.current.forEach(({ marker }) => marker.remove());
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
      }).addTo(map);

      marker
        .bindTooltip(
          event.image
            ? `<div class="event-tooltip-image-only"><img src="${escapeHtml(
                event.image
              )}" alt="${escapeHtml(event.name)}" /></div>`
            : "",
          {
            direction: "top",
            offset: [0, -8],
            opacity: 1,
            className: "event-tooltip",
          }
        )
        .on("click", () => {
          setActiveEventId(event.id);
          onEventClick(event.id);
        })
        .on("mouseover", () => {
          setHoverEventId(event.id);
        })
        .on("mouseout", () => {
          setHoverEventId(null);
        })
        .on("tooltipopen", () => {
          setHoverEventId(event.id);
        })
        .on("tooltipclose", () => {
          setHoverEventId(null);
        });

      markersRef.current.push({ id: event.id, marker });
    });
  }, [events, activeEventId, centerOnEvent, onEventClick]);

  useEffect(() => {
    if (!primaryEvent || !mapInstanceRef.current) return;

    const { latitude, longitude } = primaryEvent;
    if (latitude && longitude) {
      mapInstanceRef.current.setView([latitude, longitude], 12, {
        animate: true,
      });
    }
  }, [primaryEvent]);

  useEffect(() => {
    markersRef.current.forEach(({ id, marker }) => {
      const isActive = id === activeEventId;
      const isHovered = id === hoverEventId;

      marker.setStyle({
        fillOpacity: isActive || isHovered ? 1 : 0.6,
        color: isActive ? "#c4ff00" : isHovered ? "#ffffff" : "#c4ff00",
        weight: isActive || isHovered ? 3 : 2,
      });

      if (isHovered) {
        marker.openTooltip();
      } else {
        marker.closeTooltip();
      }
    });
  }, [activeEventId, hoverEventId]);

  useEffect(() => {
    if (!hoverEventId) return;
    const node = listItemRefs.current.get(hoverEventId);
    if (node) {
      node.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [hoverEventId]);

  const handleSelectEvent = (eventId) => {
    setActiveEventId(eventId);
    onEventClick(eventId);
    centerOnEvent(eventId);
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
          <span>
            {isLoading
              ? "Loading…"
              : primaryEvent?.date
              ? formatDate(primaryEvent.date)
              : "No events"}
          </span>
        </div>
      </header>

      <section className="map-panel">
        <div ref={mapContainerRef} className="map-container" />
        <div className="map-controls" aria-hidden="false">
          <button
            type="button"
            className="map-button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="map-button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            aria-label="Zoom out"
          >
            –
          </button>
          <button
            type="button"
            className="map-button"
            onClick={() =>
              primaryEvent?.latitude &&
              primaryEvent?.longitude &&
              mapInstanceRef.current?.setView(
                [primaryEvent.latitude, primaryEvent.longitude],
                12,
                { animate: true }
              )
            }
            aria-label="Center on active event"
            disabled={!primaryEvent}
          >
            ∘
          </button>
        </div>

        {primaryEvent?.image && (
          <div className="map-overlay">
            <img src={primaryEvent.image} alt={primaryEvent.name} />
          </div>
        )}

        {!isLoading && !error && !events.length && (
          <div className="map-empty-state">
            <p>No events found for this city.</p>
          </div>
        )}
      </section>

      <section className="event-listing">
        <div className="list-header">Events</div>
        {error ? (
          <div className="list-error">{error}</div>
        ) : isLoading ? (
          <div className="list-loading">Loading events…</div>
        ) : (
          <ul>
          {events.map((event) => (
              <li
                key={event.id}
              className={`list-row ${
                event.id === activeEventId ? "active" : ""
              } ${event.id === hoverEventId ? "hovered" : ""}`}
              ref={(node) => {
                if (node) {
                  listItemRefs.current.set(event.id, node);
                } else {
                  listItemRefs.current.delete(event.id);
                }
              }}
              >
              <div
                className="event-row"
                onMouseEnter={() => setHoverEventId(event.id)}
                onMouseLeave={() => setHoverEventId(null)}
              >
                <button
                  type="button"
                  className="icon-button target"
                  aria-label={`Center on ${event.name}`}
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    centerOnEvent(event.id);
                  }}
                >
                  ⦿
                </button>
                <div className="event-text">
                  <span className="event-name">{event.name}</span>
                  <span className="event-venue">{event.venueName}</span>
                </div>
                <button
                  type="button"
                  className="icon-button open"
                  aria-label={`Open ${event.name}`}
                  onClick={() => handleSelectEvent(event.id)}
                >
                  ↗
                </button>
              </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
