import { STORAGE_KEYS, BOOKING_STATUS } from "../utils/constants";
import { generateId } from "../utils/formatters";



function loadBookings() {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return raw ? JSON.parse(raw) : [];
}

function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

function delay(ms = 500) {
    return new Promise((res) => setTimeout(res, ms));
}

export async function bookEvent(event, user) {
    await delay(600);
    const bookings = loadBookings();
    const userId = user.id || user; 

   
    const alreadyBooked = bookings.find(
        (b) => b.eventId === event.id && b.userId === userId && b.status !== BOOKING_STATUS.CANCELLED
    );
    if (alreadyBooked) throw new Error("You have already booked this event.");

  
    const eventBookings = bookings.filter(
        (b) => b.eventId === event.id && b.status !== BOOKING_STATUS.CANCELLED
    );
    if (eventBookings.length >= event.capacity) throw new Error("Sorry, this event is sold out.");

    const newBooking = {
        id: generateId("bk"),
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        eventImage: event.image,
        eventCategory: event.category,
        price: event.price,
       
        userId,
        userName: user.name || "Unknown",
        userEmail: user.email || "",
        userAvatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=4f46e5&color=fff&size=64`,
        status: BOOKING_STATUS.CONFIRMED,
        bookedAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    saveBookings(bookings);
    return newBooking;
}


export async function cancelBooking(bookingId, userId) {
    await delay(400);
    const bookings = loadBookings();
    const idx = bookings.findIndex((b) => b.id === bookingId && b.userId === userId);
    if (idx === -1) throw new Error("Booking not found.");

    bookings[idx].status = BOOKING_STATUS.CANCELLED;
    bookings[idx].cancelledAt = new Date().toISOString();
    saveBookings(bookings);
    return bookings[idx];
}

export async function getUserBookings(userId) {
    await delay(350);
    const bookings = loadBookings();
    return bookings.filter((b) => b.userId === userId);
}


export async function hasUserBooked(eventId, userId) {
    await delay(100);
    const bookings = loadBookings();
    return bookings.some(
        (b) => b.eventId === eventId && b.userId === userId && b.status === BOOKING_STATUS.CONFIRMED
    );
}


export async function getEventBookingCount(eventId) {
    await delay(100);
    const bookings = loadBookings();
    return bookings.filter((b) => b.eventId === eventId && b.status !== BOOKING_STATUS.CANCELLED).length;
}


export async function getEventAttendees(eventId) {
    await delay(200);
    const bookings = loadBookings().filter((b) => b.eventId === eventId);

   
    let userRegistry = [];
    try {
        const raw = localStorage.getItem("ep_user_registry");
        userRegistry = raw ? JSON.parse(raw) : [];
    } catch { /* ignore */ }

    return bookings.map((b) => {
        if (b.userName && b.userName !== "Unknown") return b; // already has data
        
        const found = userRegistry.find((u) => u.id === b.userId);
        if (found) {
            return {
                ...b,
                userName: found.name || "Unknown",
                userEmail: found.email || "",
                userAvatar: found.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(found.name || "U")}&background=4f46e5&color=fff&size=64`,
            };
        }
        return b;
    });
}



export async function getAllBookings() {
    await delay(200);
    return loadBookings();
}
