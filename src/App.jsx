import React, { useEffect, useState, useRef } from "react";
import "./App.css";

const API_URL = "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        const labels = json.map((entry) =>
          new Date(entry.time_tag).toLocaleTimeString()
        );
        const values = json.map((entry) => parseFloat(entry.kp_index));
        setData({ labels, values });
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!loading && window.Chart && chartRef.current) {
      new window.Chart(chartRef.current, {
        type: "line",
        data: {
          labels: data.labels.slice(-60),
          datasets: [
            {
              label: "K-index",
              data: data.values.slice(-60),
              borderColor: "#00e5ff",
              tension: 0.3,
            },
          ],
        },
        options: {
          scales: {
            y: { min: 0, max: 9 },
          },
        },
      });
    }
  }, [loading, data]);

  return (
    <div className="container">
      <h1>🌌 Space Weather Visualizer</h1>
      {loading ? <p>Loading...</p> : <canvas ref={chartRef} />}
    </div>
  );
}

export default App;
