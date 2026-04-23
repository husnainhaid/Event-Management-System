import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export async function registerUser({ name, email, password, role }) {
  const { data } = await API.post("/auth/register", {
    name,
    email,
    password,
    role,
  });

  localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

  return data;
}

export async function loginUser({ email, password, role }) {
  const { data } = await API.post("/auth/login", {
    email,
    password,
    role,
  });

  localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

  return data;
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function isAuthenticated() {
  return !!getToken() && !!getCurrentUser();
}