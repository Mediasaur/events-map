import { memo } from "react";

const formatDate = (isoDate) => {
  if (!isoDate) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return formatter.format(new Date(isoDate));
};

function EventDetails({ event, onBack, onClose }) {
  return (
    <div className="detail-screen">
      <header className="screen-header">
        <button type="button" className="ghost-button" onClick={onBack}>
          Back
        </button>
        <div className="screen-title">
          <span>{event.city}</span>
          <span className="separator">|</span>
          <span>{formatDate(event.date)}</span>
          <span className="separator">|</span>
          <span>{event.name}</span>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>
          Close
        </button>
      </header>

      <section className="detail-media">
        <img src={event.image} alt={event.name} />
      </section>

      <section className="detail-info">
        <div className="info-column">
          <h2>Lineup</h2>
          <ul>
            {event.lineup?.length ? (
              event.lineup.map((name) => <li key={name}>{name}</li>)
            ) : (
              <li>To be announced</li>
            )}
          </ul>
        </div>
        <div className="info-column">
          <h2>Venue</h2>
          <ul>
            <li>{event.venueName}</li>
            {event.venueAddress && <li>{event.venueAddress}</li>}
            {event.venuePhone && <li>{event.venuePhone}</li>}
          </ul>
        </div>
      </section>

      <section className="detail-description">
        <h2>Info</h2>
        <p>{event.info}</p>
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-link"
          >
            More information
          </a>
        )}
      </section>
    </div>
  );
}

export default memo(EventDetails);
