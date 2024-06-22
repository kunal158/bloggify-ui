import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { URL } from "../url";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      getUser();
    }
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(URL + "/api/auth/refetch", {
        withCredentials: true,
      });
      console.log(res.data);
      setUser(res.data);
      localStorage.setItem("isAuthenticated", true); // Set the flag in local storage
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        // Handle unauthorized access
        alert("You are not authorized. Please log in.");
        localStorage.removeItem("isAuthenticated"); // Remove the flag on unauthorized access
        navigate("/login"); // Redirect to login page
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
