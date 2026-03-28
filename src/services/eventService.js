import { STORAGE_KEYS, SEED_EVENTS } from "../utils/constants";
import { generateId } from "../utils/formatters";

function initEvents() {
    const existing = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!existing) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
    }
}

function loadEvents() {
    initEvents();
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return raw ? JSON.parse(raw) : [];
}

function saveEvents(events) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

function delay(ms = 500) {
    return new Promise((res) => setTimeout(res, ms));
}