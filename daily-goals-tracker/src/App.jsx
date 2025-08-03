import React, { useEffect, useState } from "react";
import "./App.css";
import AddTaskCard from "./components/AddTaskCard";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://stoic-quotes.com/api/quotes?num=10")
      .then((response) =>         
       response.json()
      )
      .then((json) => setQuotes(json))
      .catch((err) => setError(err.message));
  }, []);

  // Auto change quote every 2 second
  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) % quotes.length;
    });
    }, 2000); // 2000ms = 2 second

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [quotes]);

  return (
    <div className="App">
      <h1>
        DAILY TASK TRACKER
      </h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {quotes.length > 0 ? (
        <div>
          <blockquote style={{ fontStyle: "italic", fontSize: "1.5rem" }}>
            "{quotes[currentIndex].text}"
          </blockquote>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <AddTaskCard />
    </div>
  );
}

export default App;
