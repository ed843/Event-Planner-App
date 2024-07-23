import { useState } from "react";
import "../styles/Event.css";
import api from "../api";

function Event({ event, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const deleteEvent = async (id) => {
    setIsDeleting(true);
    try {
      const res = await api.delete(`/api/events/delete/${id}/`);
      if (res.status === 204) {
        setTimeout(() => {
          onDelete(id);
        }, 300); // Wait for animation to complete
      } else {
        alert("Error deleting event");
        setIsDeleting(false);
      }
    } catch (error) {
      alert(error);
      setIsDeleting(false);
    }
  };

  return (
    <div className={`event-container ${isDeleting ? 'deleting' : ''}`} data-category={event.category}>
      <div className="event-header">
        <h3 className="event-name">{event.name}</h3>
        <p className="event-date">{formattedDate}</p>
      </div>
      <div className="event-body">
        <p className="event-description">{event.description}</p>
        <div className="event-details">
          <p className="event-location">{event.location}</p>
          <p className="event-category">{event.category}</p>
        </div>
      </div>
      <div className="event-footer">
        <button className="delete-button" onClick={() => deleteEvent(event.id)} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default Event;