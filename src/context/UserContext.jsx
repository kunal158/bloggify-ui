import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { URL } from "../url";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(URL + "/api/auth/refetch", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error during refetch:", err);
      if (err.response && err.response.status === 401) {
        // Handle unauthorized access
        alert("You are not authorized. Please log in.");
        navigate("/login"); // Redirect to login page
      } else {
        setError("Failed to fetch user data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Error message
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
