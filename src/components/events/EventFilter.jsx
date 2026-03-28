import React from "react";
import { CATEGORIES } from "../../utils/constants";
function EventFilter({ search, onSearch, category, onCategory, sort, onSort }) {
     return (
        <div className="event-filter">

            <div className="event-filter__search">
                <span className="event-filter__search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search events by name, location…"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    id="event-search"
                    aria-label="Search events"
                />
            </div>


            <div className="event-filter__categories">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        className={`event-filter__chip ${category === cat.value ? "active" : ""}`}
                        onClick={() => onCategory(cat.value)}
                    >
                        {cat.emoji} {cat.label}
                    </button>
                ))}
            </div>

            
            <div className="event-filter__sort">
                <label htmlFor="event-sort">Sort by:</label>
                <select id="event-sort" value={sort} onChange={(e) => onSort(e.target.value)}>
                    <option value="date">Date (soonest)</option>
                    <option value="popular">Most popular</option>
                    <option value="price-asc">Price (low to high)</option>
                    <option value="price-desc">Price (high to low)</option>
                </select>
            </div>
        </div>
    );
}

export default EventFilter;
