import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const eventData = [
  {"id":"1","name":"Austin Music Festival","category":"Music","date":"2025-12-15","city":"Austin","state":"TX","venue":"Zilker Park","latitude":30.267153,"longitude":-97.743057,"image":"https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2","description":"A lively outdoor festival featuring top country and rock artists.","link":"https://example.com/evt1"},
  {"id":"2","name":"San Francisco Tech Expo","category":"Technology","date":"2025-11-20","city":"San Francisco","state":"CA","venue":"Moscone Center","latitude":37.784000,"longitude":-122.401000,"image":"https://images.unsplash.com/photo-1556761175-5973dc0f32e7","description":"A national technology conference for startups and innovators.","link":"https://example.com/evt2"},
  {"id":"3","name":"Chicago Food Festival","category":"Food","date":"2025-11-25","city":"Chicago","state":"IL","venue":"Navy Pier","latitude":41.891551,"longitude":-87.607375,"image":"https://images.unsplash.com/photo-1504754524776-8f4f37790ca0","description":"Chicago’s biggest street food and gourmet experience.","link":"https://example.com/evt3"},
  {"id":"4","name":"Miami Art Week","category":"Art","date":"2025-12-05","city":"Miami","state":"FL","venue":"Miami Beach Convention Center","latitude":25.790654,"longitude":-80.130045,"image":"https://images.unsplash.com/photo-1504196606672-aef5c9cefc92","description":"Contemporary art exhibitions and performances from global artists.","link":"https://example.com/evt4"},
  {"id":"5","name":"New York Marathon","category":"Sports","date":"2025-11-30","city":"New York","state":"NY","venue":"Central Park / Finish Line","latitude":40.785091,"longitude":-73.968285,"image":"https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf","description":"Annual marathon event across all five boroughs of NYC.","link":"https://example.com/evt5"},
  {"id":"6","name":"Seattle Film Festival","category":"Film","date":"2025-12-10","city":"Seattle","state":"WA","venue":"SIFF Cinema Egyptian","latitude":47.606209,"longitude":-122.332069,"image":"https://images.unsplash.com/photo-1515165562835-c4c3b63e2130","description":"A week-long event showcasing independent and international films.","link":"https://example.com/evt6"},
  {"id":"7","name":"Denver Startup Week","category":"Business","date":"2025-12-02","city":"Denver","state":"CO","venue":"Denver Convention Center","latitude":39.752998,"longitude":-104.999138,"image":"https://images.unsplash.com/photo-1498050108023-c5249f4df085","description":"The largest free entrepreneurship event in the U.S.","link":"https://example.com/evt7"},
  {"id":"8","name":"Las Vegas Auto Show","category":"Automotive","date":"2025-12-18","city":"Las Vegas","state":"NV","venue":"Las Vegas Convention Center","latitude":36.1314,"longitude":-115.1636,"image":"https://images.unsplash.com/photo-1502877338535-766e1452684a","description":"Showcasing luxury cars and future automotive technologies.","link":"https://example.com/evt8"},
  {"id":"9","name":"Boston Science Fair","category":"Education","date":"2025-11-28","city":"Boston","state":"MA","venue":"Boston Convention & Exhibition Center","latitude":42.346676,"longitude":-71.041281,"image":"https://images.unsplash.com/photo-1581093588401-22da39c4d5a0","description":"An educational event featuring student science innovations.","link":"https://example.com/evt9"},
  {"id":"10","name":"Nashville Jazz Nights","category":"Music","date":"2025-12-08","city":"Nashville","state":"TN","venue":"Ryman Auditorium","latitude":36.162663,"longitude":-86.781601,"image":"https://images.unsplash.com/photo-1511379938547-c1f69419868d","description":"A week of live jazz and blues performances in downtown venues.","link":"https://example.com/evt10"},
  {"id":"11","name":"Portland Green Expo","category":"Environment","date":"2025-11-22","city":"Portland","state":"OR","venue":"Oregon Convention Center","latitude":45.5316,"longitude":-122.6616,"image":"https://images.unsplash.com/photo-1535920527002-b35e96722eb9","description":"A sustainability expo focusing on green technologies.","link":"https://example.com/evt11"},
  {"id":"12","name":"Dallas Comic Con","category":"Entertainment","date":"2025-12-12","city":"Dallas","state":"TX","venue":"Kay Bailey Hutchison Convention Center","latitude":32.776664,"longitude":-96.796988,"image":"https://images.unsplash.com/photo-1584985591769-45d1a1f29b4d","description":"Meet your favorite comic book artists and celebrities.","link":"https://example.com/evt12"},
  {"id":"13","name":"Philadelphia Beer Week","category":"Food & Drink","date":"2025-11-27","city":"Philadelphia","state":"PA","venue":"Penn's Landing","latitude":39.952583,"longitude":-75.165222,"image":"https://images.unsplash.com/photo-1605559424843-9e89d2f2a429","description":"Craft beer tastings and brewery tours across the city.","link":"https://example.com/evt13"},
  {"id":"14","name":"Los Angeles Fashion Show","category":"Fashion","date":"2025-12-03","city":"Los Angeles","state":"CA","venue":"Los Angeles Convention Center","latitude":34.040713,"longitude":-118.269007,"image":"https://images.unsplash.com/photo-1495121605193-b116b5b09a5e","description":"Showcasing top designers and new fashion trends.","link":"https://example.com/evt14"},
  {"id":"15","name":"Phoenix Winter Market","category":"Market","date":"2025-12-20","city":"Phoenix","state":"AZ","venue":"Phoenix Convention Center","latitude":33.448376,"longitude":-112.074036,"image":"https://images.unsplash.com/photo-1519681393784-d120267933ba","description":"Holiday shopping, crafts, and local artisan markets.","link":"https://example.com/evt15"}
];

export default function MapView({ city, onEventClick }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Filter events based on the selected city
    const filteredEvents = eventData.filter((event) => event.city === city);
    setEvents(filteredEvents);
  }, [city]);

  useEffect(() => {
    if (events.length === 0) return;

    const map = L.map("map").setView([39.5, -98.35], 4); // center of USA

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    events.forEach((event) => {
      if (event.latitude && event.longitude) {
        L.marker([event.latitude, event.longitude])
          .addTo(map)
          .bindPopup(
            `<b>${event.name}</b><br>${event.venue}<br>${event.city}, ${event.state}<br>${event.date}`
          );
      }
    });

    return () => map.remove();
  }, [events]);

  const handleEventClick = (event) => {
    onEventClick(event);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the screen
  };

  return (
    <div>
      <div id="map" className="leaflet-container"></div>
      <div className="event-list">
        <h2>Events in {city}</h2>
        <ul>
          {events.map((event) => (
            <li
              key={event.id}
              className="event-item"
              onClick={() => handleEventClick(event)}
            >
              <h3>{event.name}</h3>
              <p>{event.venue}</p>
              <p>{event.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
