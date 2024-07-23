import "../styles/PublicEvent.css";
import { CURRENT_USER } from "../constants";
import api from "../api";
import { useState } from "react";

const UPDATE_BUFFER = 60000;

function PublicEvent({ event, isFollowing, onFollow, onUnfollow, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDateCreated = new Date(event.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  const formattedDateUpdated = new Date(event.updated_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

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

  const handleFollowClick = () => {
    if (isFollowing) {
      onUnfollow();
    } else {
      onFollow();
    }
  };

  return (
    <div
      className={`event-container ${isDeleting ? "deleting" : ""}`}
      data-category={event.category}
    >
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
        <div>
          <span>Created: {formattedDateCreated}</span>
          {/* Only show updated date if it's more than 1 minute after creation */}
          {new Date(event.updated_at).getTime() >
            new Date(event.created_at).getTime() + UPDATE_BUFFER && (
            <span> | Updated: {formattedDateUpdated}</span>
          )}
          {event.created_by.username === localStorage.getItem(CURRENT_USER) ? (
            <p>Created by you</p>
          ) : (
            <p>Created by {event.created_by.username}</p>
          )}
        </div>
        {event.created_by.username === localStorage.getItem("username") ? (
          <button
            className="delete-button"
            onClick={() => deleteEvent(event.id)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        ) : (
          <button
            className={isFollowing ? "unfollow-button" : "follow-button"}
            onClick={handleFollowClick}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
}

export default PublicEvent;
