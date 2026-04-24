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

export async function bookEvent(eventId) {
  const { data } = await API.post(
    "/bookings",
    { eventId },
    getAuthConfig()
  );

  return data.booking;
}

export async function cancelBooking(bookingId) {
  const { data } = await API.patch(
    `/bookings/${bookingId}/cancel`,
    {},
    getAuthConfig()
  );

  return data.booking;
}

export async function getMyBookings() {
  const { data } = await API.get(
    "/bookings/my-bookings",
    getAuthConfig()
  );

  return data.bookings;
}

export async function hasUserBooked(eventId) {
  const { data } = await API.get(
    `/bookings/check/${eventId}`,
    getAuthConfig()
  );

  return data;
}

export async function getEventAttendees(eventId) {
  const { data } = await API.get(
    `/bookings/event/${eventId}/attendees`,
    getAuthConfig()
  );

  return data.attendees;
}