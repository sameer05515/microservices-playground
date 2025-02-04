import { useEffect, useState } from "react";
import { timeZones } from "./utils";

const TimeZoneClockV1 = () => {
  const [times, setTimes] = useState({});

  const updateTimes = () => {
    const now = new Date();
    const indiaOffset = 5.5 * 60; // in minutes
    const utc = new Date(now.getTime() - indiaOffset * 60000);
    const updated = {};

    Object.entries(timeZones).forEach(([zone, offset]) => {
      const localTime = new Date(utc.getTime() + offset * 60 * 60000);
      updated[zone] = `${offset} ===============  ${localTime.toLocaleTimeString()}`;
    });

    setTimes(updated);
  };

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "monospace", padding: "10px" }}>
      <h2>World Clock</h2>
      {Object.entries(times).map(([zone, time]) => (
        <div key={zone}>
          <strong>{zone}</strong>: {time}
        </div>
      ))}
    </div>
  );
};

export default TimeZoneClockV1;
