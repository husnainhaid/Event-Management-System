import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

const getAuthConfig = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function getEvents({ search = "", category = "all", sort = "date" } = {}) {
  const { data } = await API.get("/events");
  let events = data.events || [];

  if (category && category !== "all") {
    events = events.filter((e) => e.category === category);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    events = events.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q) ||
        e.city?.toLowerCase().includes(q)
    );
  }

  if (sort === "date") {
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  if (sort === "price-asc") {
    events.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "price-desc") {
    events.sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (sort === "popular") {
    events.sort((a, b) => Number(b.attendees || 0) - Number(a.attendees || 0));
  }

  return events;
}

export async function getFeaturedEvents() {
  const { data } = await API.get("/events");
  const events = data.events || [];
  return events.filter((e) => e.isFeatured).slice(0, 4);
}

export async function getEventById(id) {
  const { data } = await API.get(`/events/${id}`);
  return data.event;
}

export async function createEvent(payload) {
  const { data } = await API.post("/events", payload, getAuthConfig());
  return data.event;
}

export async function updateEvent(id, payload) {
  const { data } = await API.put(`/events/${id}`, payload, getAuthConfig());
  return data.event;
}

export async function deleteEvent(id) {
  const { data } = await API.delete(`/events/${id}`, getAuthConfig());
  return data;
}

export async function getEventStats() {
  const { data } = await API.get("/events/my-events", getAuthConfig());
  const events = data.events || [];

  const totalEvents = events.length;
  const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).length;
  const freeEvents = events.filter((e) => Number(e.price) === 0).length;
  const categories = [...new Set(events.map((e) => e.category))].length;

  return { totalEvents, totalAttendees, upcomingEvents, freeEvents, categories };
}

export async function getUserEvents() {
  const { data } = await API.get("/events/my-events", getAuthConfig());
  return data.events || [];
}