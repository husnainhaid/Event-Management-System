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

export async function getEvents({ search = "", category = "all", sort = "date" } = {}) {
    await delay(400);
    let events = loadEvents();

  
    if (category && category !== "all") {
        events = events.filter((e) => e.category === category);
    }

    
    if (search.trim()) {
        const q = search.toLowerCase();
        events = events.filter(
            (e) =>
                e.title.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q) ||
                e.location.toLowerCase().includes(q) ||
                e.city.toLowerCase().includes(q)
        );
    }

    
    if (sort === "date") events.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === "price-asc") events.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") events.sort((a, b) => b.price - a.price);
    if (sort === "popular") events.sort((a, b) => b.attendees - a.attendees);

    return events;

    
}

export async function getEventById(id) {
    await delay(300);
    const events = loadEvents();
    const event = events.find((e) => e.id === id);
    if (!event) throw new Error("Event not found");
    return event;
}

export async function createEvent(data, userId) {
    await delay(600);
    const events = loadEvents();
    const newEvent = {
        ...data,
        id: generateId("evt"),
        attendees: 0,
        organizerId: userId,
        isFeatured: false,
        createdAt: new Date().toISOString(),
        price: Number(data.price) || 0,
        capacity: Number(data.capacity) || 50,
        lat: 53.3498,
        lng: -6.2603,
    };
    events.push(newEvent);
    saveEvents(events);
    return newEvent;
}
