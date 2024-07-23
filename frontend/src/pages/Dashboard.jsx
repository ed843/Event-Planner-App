import { useState, useEffect } from "react";
import api from "../api";
import { AddressAutofill } from "@mapbox/search-js-react";
import Event from "../components/Event";
import "../styles/Dashboard.css";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [fullAddress, setFullAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const updateAddress = (field, value) => {
    setFullAddress((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = () => {
    api
      .get("/api/events/")
      .then((res) => res.data)
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => alert(error));
  };

  const handleDelete = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const createEvent = (e) => {
    e.preventDefault();
    const formattedLocation = `${fullAddress.address1}, ${
      fullAddress.address2 ? fullAddress.address2 + ", " : ""
    }${fullAddress.city}, ${fullAddress.state} ${fullAddress.zipCode}`.trim();
    setLocation(formattedLocation);
    api
      .post("/api/events/", {
        name,
        description,
        date,
        location: formattedLocation,
        category,
        isPublic,
      })
      .then((res) => {
        if (res.status === 201) alert("Event created successfully");
        else alert("Error creating event");
        getEvents();
      })
      .catch((error) => alert(error));
  };

  return (
    <div className="dashboard-container">
      <div className="event-list">
        <h2>Events</h2>
        {events.map((event) => (
          <Event event={event} onDelete={handleDelete} key={event.id} />
        ))}
      </div>
      
      <form className="create-event-form" onSubmit={createEvent}>
        <h2 className="form-title">Create an Event</h2>
        
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <AddressAutofill accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
            <div className="address-group">
              <div className="form-group">
                <input
                  type="text"
                  name="address-1"
                  id="address-1"
                  placeholder="Address Line 1"
                  autoComplete="address-line1"
                  onChange={(e) => updateAddress("address1", e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address-2"
                  id="address-2"
                  placeholder="Address Line 2"
                  autoComplete="address-line2"
                  onChange={(e) => updateAddress("address2", e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  autoComplete="address-level2"
                  onChange={(e) => updateAddress("city", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="state"
                  id="state"
                  placeholder="State"
                  autoComplete="address-level1"
                  onChange={(e) => updateAddress("state", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="zip-code"
                  id="zip-code"
                  placeholder="Zip Code"
                  autoComplete="postal-code"
                  onChange={(e) => updateAddress("zipCode", e.target.value)}
                />
              </div>
            </div>
          </AddressAutofill>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select an option</option>
            <option value="Music">Music</option>
            <option value="Food">Food</option>
            <option value="Art">Art</option>
            <option value="Sports">Sports</option>
            <option value="Travel">Travel</option>
            <option value="Tech">Tech</option>
            <option value="Fashion">Fashion</option>
            <option value="Health">Health</option>
            <option value="Job">Job</option>
          </select>
        </div>
        
        {/* New form group for public/private option */}
        <div className="form-group">
          <label htmlFor="isPublic">Event Visibility:</label>
          <select
            name="isPublic"
            id="isPublic"
            value={isPublic}
            onChange={(e) => setIsPublic(e.target.value === 'true')}
            required
          >
            <option value={true}>Public</option>
            <option value={false}>Private</option>
          </select>
        </div>
        
        <button type="submit" className="submit-button">Create Event</button>
      </form>
    </div>
  );
}

export default Dashboard;
