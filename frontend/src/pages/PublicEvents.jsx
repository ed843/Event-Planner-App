import { useState, useEffect } from "react";
import api from "../api";
import PublicEvent from "../components/PublicEvent";
import "../styles/PublicEvents.css"; 

function PublicEvents() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [searchParams, setSearchParams] = useState({
    name: "",
    description: "",
    location: "",
    category: "",
    date_from: "",
    date_to: "",
  });


  const handleDelete = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };
  
  const getEvents = (tab) => {
    const params = new URLSearchParams(searchParams);
    const endpoint = tab === "following" ? "/api/events/following/" : "/api/events/public/";
    api
      .get(`${endpoint}?${params.toString()}`)
      .then((res) => res.data)
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    getEvents(activeTab);
  }, [searchParams, activeTab]);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const response = await api.get(`/api/users/following/`);
        setFollowedUsers(new Set(response.data.map(user => user.id)));
      } catch (error) {
        console.error("Error fetching followed users:", error);
      }
    };

    fetchFollowedUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getEvents(activeTab);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFollow = async (userId) => {
    try {
      await api.put(`/api/users/follow/${userId}/`);
      setFollowedUsers(prev => new Set(prev).add(userId));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await api.put(`/api/users/unfollow/${userId}/`);
      setFollowedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="search-form">
        <h2>Search Events</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            id="search-name"
            value={searchParams.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            id="search-description"
            value={searchParams.description}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={searchParams.location}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={searchParams.category}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="date_from"
            value={searchParams.date_from}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="date_to"
            value={searchParams.date_to}
            onChange={handleInputChange}
          />
          <button type="submit">Search Events</button>
        </form>
      </div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "discover" ? "active" : ""}`}
          onClick={() => handleTabChange("discover")}
        >
          Discover
        </button>
        <button
          className={`tab ${activeTab === "following" ? "active" : ""}`}
          onClick={() => handleTabChange("following")}
        >
          Following
        </button>
      </div>
      <div className="event-list">
        <h2>{activeTab === "discover" ? "Discover Events" : "Following Events"}</h2>
        {events.map((event) => (
          <PublicEvent
            className="PublicEvent"
            event={event}
            key={event.id}
            isFollowing={followedUsers.has(event.created_by.id)}
            onFollow={() => handleFollow(event.created_by.id)}
            onUnfollow={() => handleUnfollow(event.created_by.id)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default PublicEvents;