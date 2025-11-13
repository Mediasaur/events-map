import { useCallback, useEffect, useMemo, useState } from "react";
import MapView from "./components/MapView";
import EventDetails from "./components/EventDetails";
import CustomSelect from "./components/CustomSelect";
import { fetchEventsByCity } from "./api/ticketmaster";
import "./index.css";

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventsForCity, setEventsForCity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cities = useMemo(
    () => [
      "Austin",
      "Boston",
      "Chicago",
      "Dallas",
      "Denver",
      "Detroit",
      "Las Vegas",
      "Los Angeles",
      "Miami",
      "Nashville",
      "New York",
      "Philadelphia",
      "Phoenix",
      "Portland",
      "San Francisco",
      "Seattle",
    ],
    []
  );

  useEffect(() => {
    if (!selectedCity) {
      setEventsForCity([]);
      return;
    }

    let isCancelled = false;

    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const events = await fetchEventsByCity(selectedCity);
        if (!isCancelled) {
          setEventsForCity(events);
          setSelectedEventId(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Failed to load events");
          setEventsForCity([]);
          setSelectedEventId(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isCancelled = true;
    };
  }, [selectedCity]);

  const selectedEvent =
    selectedEventId && eventsForCity.length
      ? eventsForCity.find((event) => event.id === selectedEventId) ?? null
      : null;

  const handleReset = () => {
    setSelectedCity("");
    setSelectedEventId(null);
  };

  const handleEventClick = useCallback((eventId) => {
    setSelectedEventId(eventId);
  }, []);

  return (
    <div className="app-shell">
      {!selectedCity ? (
        <div className="landing-screen">
          <div className="prompt-row">
            <span className="prompt-label">What city are you in?</span>
            <span className="prompt-separator" aria-hidden="true" />
            <CustomSelect
              options={cities}
              value={selectedCity}
              placeholder="Select"
              onChange={(city) => {
                setSelectedCity(city);
                setSelectedEventId(null);
              }}
            />
          </div>
        </div>
      ) : selectedEvent ? (
        <EventDetails
          event={selectedEvent}
          onBack={() => setSelectedEventId(null)}
        />
      ) : (
        <MapView
          city={selectedCity}
          events={eventsForCity}
          isLoading={isLoading}
          error={error}
          onEventClick={handleEventClick}
          onClose={handleReset}
        />
      )}
    </div>
  );
}

export default App;
