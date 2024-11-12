import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../Home/Header";
import Home from "../Home/Home";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "../DashboardPages/Dashboard";
import Profile from "../DashboardPages/Profile";
import Settings from "../DashboardPages/Settings";
import Inbox from "../DashboardPages/Inbox/Inbox";
import MessagesDashboard from "../DashboardPages/Messages/MessageDashboard";
import RealChat from "../DashboardPages/Messages/RealChat";

const Routers = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/chat" element={<MessagesDashboard />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Routers;
