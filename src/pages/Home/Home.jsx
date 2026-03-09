import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeaturedEvents } from "../../services/eventService";
import { getWeatherForLocation, getTicketmasterEvents } from "../../services/externalApiService";
import EventCard from "../../components/events/EventCard";
import Loader from "../../components/common/Loader";
import "./Home.css";