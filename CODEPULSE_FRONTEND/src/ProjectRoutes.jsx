import React, { useEffect, useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// Pages
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/CreateRepo";

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [repoData, setRepoData] = useState([]);
  const navigate = useNavigate();

  const handleCreate = (data) => {
    console.log("Repo Created:", data);
    setRepoData((prev) => [...prev, data]);
    alert(`Repository "${data.name}" created successfully!`);
    navigate("/"); // Redirect after creation (optional)
  };

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
      setTimeout(() => navigate("/signup"), 0);
    }

    if (userIdFromStorage && window.location.pathname === "/auth") {
      setTimeout(() => navigate("/"), 0);
    }
  }, [currentUser, navigate, setCurrentUser]);

  const element = useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/auth", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/profile", element: <Profile /> },
    {
      path: "/create",
      element: <CreateRepo onCreate={handleCreate} />, // ✅ Prop passed correctly
    },
  ]);

  return element;
};

export default ProjectRoutes;
