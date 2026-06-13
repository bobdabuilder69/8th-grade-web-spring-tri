import React from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>NeighborLink</h1>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
      <br />
      <button onClick={() => navigate("/myneighborhood")}>
        Browse My Neighborhood
      </button>
    </div>
  );
}

export default Homepage;