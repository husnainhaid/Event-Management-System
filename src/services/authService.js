
import { STORAGE_KEYS } from "../utils/constants";
import { generateId } from "../utils/formatters";

function seedDemoUser() {
    const users = loadRaw();
    const exists = users.find((u) => u.email === "demo@eventpro.com");
    if (!exists) {
        users.push({
            id: "user-admin",
            name: "Demo User",
            email: "demo@eventpro.com",
            password: "Demo1234",
            role: "admin",
            avatar: "https://ui-avatars.com/api/?name=Demo+User&background=4f46e5&color=fff&size=128",
            createdAt: "2026-01-01T00:00:00Z",
        });
        localStorage.setItem("ep_user_registry", JSON.stringify(users));
    }
}
function loadRaw() {
    const raw = localStorage.getItem("ep_user_registry");
    return raw ? JSON.parse(raw) : [];
}
seedDemoUser();
function getUserRegistry() {
    return loadRaw();
}

function saveUserRegistry(users) {
    localStorage.setItem("ep_user_registry", JSON.stringify(users));
}

export async function registerUser({ name, email, password }) {
    await delay(600); 

    const users = getUserRegistry();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        throw new Error("An account with this email already exists.");
    }

    const newUser = {
        id: generateId("user"),
        name,
        email: email.toLowerCase(),
        password, 
        role: "attendee",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=128`,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUserRegistry(users);

    
    const token = generateFakeJWT(newUser);
    const safeUser = sanitiseUser(newUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));

    return { user: safeUser, token };

    
}
export async function loginUser({ email, password }) {
    await delay(700);

    const users = getUserRegistry();
    const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
        throw new Error("Invalid email or password. Please try again.");
    }

    const token = generateFakeJWT(user);
    const safeUser = sanitiseUser(user);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));

    return { user: safeUser, token };
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
function sanitiseUser(user) {
    const { password, ...safe } = user; // eslint-disable-line no-unused-vars
    return safe;
}

function generateFakeJWT(user) {
    
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role, iat: Date.now() }));
    const sig = btoa("eventpro-secret-signature"); 
    return `${header}.${payload}.${sig}`;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


