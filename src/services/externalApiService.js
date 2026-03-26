export async function getWeatherForLocation(lat = 53.3498, lon = -6.2603) {
    try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", lat);
        url.searchParams.set("longitude", lon);
        url.searchParams.set("current", "temperature_2m,weathercode,windspeed_10m,relativehumidity_2m");
        url.searchParams.set("timezone", "Europe/Dublin");
        url.searchParams.set("forecast_days", "1");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Weather API error");
        const data = await res.json();

        const code = data.current.weathercode;
        return {
            temperature: Math.round(data.current.temperature_2m),
            windspeed: Math.round(data.current.windspeed_10m),
            humidity: data.current.relativehumidity_2m,
            condition: decodeWeatherCode(code),
            icon: getWeatherIcon(code),
            unit: "°C",
        };
    } catch (err) {
        console.warn("Weather fetch failed:", err.message);
        return null;
    }
}

function decodeWeatherCode(code) {
    if (code === 0) return "Clear sky";
    if (code <= 3) return "Partly cloudy";
    if (code <= 9) return "Foggy";
    if (code <= 19) return "Drizzle";
    if (code <= 29) return "Rain";
    if (code <= 39) return "Snow";
    if (code <= 49) return "Fog";
    if (code <= 59) return "Light rain";
    if (code <= 69) return "Rain shower";
    if (code <= 79) return "Snow shower";
    if (code <= 84) return "Showers";
    if (code <= 94) return "Thunderstorm";
    return "Thunderstorm with hail";
}

function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 9) return "🌫️";
    if (code <= 29) return "🌦️";
    if (code <= 39) return "❄️";
    if (code <= 69) return "🌧️";
    if (code <= 79) return "🌨️";
    if (code <= 84) return "🌩️";
    return "⛈️";
}

const TM_API_KEY = "KkDJLsdC7hH2C1SvDMfrGwpxJmIPDrSr";

export async function getTicketmasterEvents(city = "Dublin", size = 4) {
    try {
        const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
        url.searchParams.set("apikey", TM_API_KEY);
        url.searchParams.set("city", city);
        url.searchParams.set("size", size);
        url.searchParams.set("sort", "date,asc");
        url.searchParams.set("segmentName", "Music"); 

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Ticketmaster API error");
        const data = await res.json();

        const rawEvents = data?._embedded?.events || [];
        return rawEvents.map((ev) => ({
            id: ev.id,
            name: ev.name,
            date: ev.dates?.start?.localDate,
            time: ev.dates?.start?.localTime,
            venue: ev._embedded?.venues?.[0]?.name || city,
            city: ev._embedded?.venues?.[0]?.city?.name || city,
            image: ev.images?.[0]?.url || "",
            url: ev.url,
            priceRange: ev.priceRanges
                ? `€${ev.priceRanges[0].min}–€${ev.priceRanges[0].max}`
                : "Check website",
        }));
    } catch (err) {
        console.warn("Ticketmaster fetch failed:", err.message);
        return []; 
    }
}
