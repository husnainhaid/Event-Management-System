import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import EventDetails from "../pages/EventDetails/EventDetails";
import CreateEvent from "../pages/CreateEvent/CreateEvent";
import EditEvent from "../pages/EditEvent/EditEvent";
import MyBookings from "../pages/MyBookings/MyBookings";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import NotFound from "../pages/NotFound/NotFound";

import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminRoute from "../components/common/AdminRoute"; 

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 

         <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />


          <Route path="/create" element={<AdminRoute><CreateEvent /></AdminRoute>} />
          <Route path="/edit/:id" element={<AdminRoute><EditEvent /></AdminRoute>} />
          <Route path="/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>}/>

          <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppRoutes;