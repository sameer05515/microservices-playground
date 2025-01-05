import { useState, useEffect } from "react";

const POMODORO_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes

/**
 * 
 * Here's a compact Pomodoro Timer component with sound notifications and localStorage tracking:
 * Features: 
 * - Compact UI (suitable for a header component)
 * - Sound notifications when timer ends
 * - LocalStorage to persist progress
 * 
*/
export default function PomodoroTimerV2() {
  const [time, setTime] = useState(() => {
    return parseInt(localStorage.getItem("pomodoro-time") || `${POMODORO_TIME}`);
  });
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState(() => {
    return localStorage.getItem("pomodoro-session") || "work";
  });

  useEffect(() => {
    localStorage.setItem("pomodoro-time", `${time}`);
    localStorage.setItem("pomodoro-session", session);
  }, [time, session]);

  useEffect(() => {
    let timer /**: NodeJS.Timeout*/;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      //   playNotification();
      setIsRunning(false);
      if (session === "work") {
        setSession("break");
        setTime(SHORT_BREAK);
      } else {
        setSession("work");
        setTime(POMODORO_TIME);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, time, session]);

  //   const playNotification = () => {
  //     const audio = new Audio("/notification.mp3"); // Replace with a valid sound file
  //     audio.play();
  //   };

  const resetTimer = () => {
    setIsRunning(false);
    setSession("work");
    setTime(POMODORO_TIME);
    localStorage.removeItem("pomodoro-time");
    localStorage.removeItem("pomodoro-session");
  };

  const formatTime = (seconds /**: number*/) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center space-x-3 rounded-md text-sm">
      <span className="font-bold">{session === "work" ? "⏳ Work" : "☕ Break"}</span>
      <span className="font-mono">{formatTime(time)}</span>
      <button onClick={() => setIsRunning(!isRunning)} className="px-2 py-1 bg-blue-500 rounded">
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={resetTimer} className="px-2 py-1 bg-red-500 rounded">
        Reset
      </button>
    </div>
  );
}
