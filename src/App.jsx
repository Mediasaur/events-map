import { useCallback, useMemo, useState } from "react";
import MapView from "./components/MapView";
import EventDetails from "./components/EventDetails";
import CustomSelect from "./components/CustomSelect";
import { getCities, getEventsForCity } from "./data/events";
import "./index.css";

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);

  const cities = useMemo(() => getCities(), []);
  const eventsForCity = useMemo(
    () => (selectedCity ? getEventsForCity(selectedCity) : []),
    [selectedCity]
  );

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
          onClose={handleReset}
        />
      ) : (
        <MapView
          city={selectedCity}
          events={eventsForCity}
          onEventClick={handleEventClick}
          onClose={handleReset}
        />
      )}
    </div>
  );
}

export default App;
