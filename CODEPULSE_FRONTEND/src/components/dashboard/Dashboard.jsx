import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId || userId.length !== 24) {
      console.warn("Invalid or missing user ID. Redirecting to login...");
      navigate("/login");
      return;
    }

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const data = await response.json();
        setRepositories(data.repositories || []);
        setSearchResults(data.repositories || []);
      } catch (err) {
        console.error("Error fetching user repositories:", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch suggested repositories");
        }

        const data = await response.json();
        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error("Error fetching suggested repositories:", err);
      }
    };

    const fetchData = async () => {
      await fetchRepositories();
      await fetchSuggestedRepositories();
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading Dashboard...</p>;
  }

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.length === 0 ? (
            <p>No suggested repositories found.</p>
          ) : (
            suggestedRepositories.map((repo) => (
              <div key={repo._id}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))
          )}
        </aside>
        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.length === 0 ? (
            <p>No repositories found.</p>
          ) : (
            searchResults.map((repo) => (
              <div key={repo._id}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))
          )}
        </main>
        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li><p>Tech Conference - Dec 15</p></li>
            <li><p>Developer Meetup - Dec 25</p></li>
            <li><p>React Summit - Jan 5</p></li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
