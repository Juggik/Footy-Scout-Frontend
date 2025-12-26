// src/PlayerDetailsPage/PlayerDetailsPage.jsx
import React from "react";
import { useParams, useLocation } from "react-router-dom";

export default function PlayerDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const nameFromState = location.state?.name;

  return (
    <div style={{ padding: 20 }}>
      <h1>Player Details</h1>
      {nameFromState ? (
        <p><strong>Name:</strong> {nameFromState}</p>
      ) : (
        <p><strong>Player ID:</strong> {id}</p>
      )}
    </div>
  );
}
