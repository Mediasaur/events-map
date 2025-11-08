import { useState } from "react";
import MapView from "./components/MapView";
import EventDetails from "./components/EventDetails";
import CustomSelect from "./components/CustomSelect";
import "./index.css";

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const cities = [
    "Austin",
    "San Francisco",
    "Chicago",
    "Miami",
    "New York",
    "Seattle",
    "Denver",
    "Las Vegas",
    "Boston",
    "Nashville",
    "Portland",
    "Dallas",
    "Philadelphia",
    "Los Angeles",
    "Phoenix",
  ];

  return (
    <div className="App">
      {!selectedCity ? (
        <div className="centered-container">
          <header className="header">
            <h1>What city are you in?</h1>
            <CustomSelect options={cities} onChange={setSelectedCity} />
          </header>
        </div>
      ) : selectedEvent ? (
        <div className="full-screen">
          <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />
        </div>
      ) : (
        <div className="full-screen">
          <button className="close-button" onClick={() => setSelectedCity("")}>Close</button>
          <MapView city={selectedCity} onEventClick={setSelectedEvent} />
        </div>
      )}
    </div>
  );
}

export default App;
