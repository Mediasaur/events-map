function EventDetails({ event, onBack }) {
  return (
    <div className="event-details-screen">
      <button className="close-button" onClick={onBack}>Close</button>
      <header className="event-header">
        {event.city} | {event.date} | {event.name}
      </header>
      <img src={event.image} alt={event.name} className="event-image" />
      <div className="event-description">
        <p>{event.description}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><a href={event.link} target="_blank" rel="noopener noreferrer">More Info</a></p>
      </div>
    </div>
  );
}

export default EventDetails;