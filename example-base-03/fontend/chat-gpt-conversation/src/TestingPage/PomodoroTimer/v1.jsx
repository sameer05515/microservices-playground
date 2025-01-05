import { useState, useEffect, useCallback } from "react";

const POMODORO_TIME = 25 * 60; // 25 min
const SHORT_BREAK = 5 * 60; // 5 min
const LONG_BREAK = 15 * 60; // 15 min

function PomodoroTimerV1() {
  const [time, setTime] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  const handleNextSession = useCallback(() => {
    setIsRunning(false);
    if ((cycles + 1) % 4 === 0) {
      setTime(LONG_BREAK);
    } else {
      setTime(SHORT_BREAK);
    }
    setCycles((prev) => prev + 1);
  },[cycles]);

  useEffect(() => {
    let timer/**: NodeJS.Timeout*/;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      handleNextSession();
    }
    return () => clearInterval(timer);
  }, [handleNextSession, isRunning, time]);

  

  const resetTimer = () => {
    setIsRunning(false);
    setTime(POMODORO_TIME);
    setCycles(0);
  };

  const formatTime = (seconds/**: number*/) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Pomodoro Timer</h1>
      <div className="text-6xl font-mono mb-6">{formatTime(time)}</div>
      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Reset
        </button>
      </div>
      <p className="mt-4 text-gray-400">Completed Cycles: {cycles}</p>
    </div>
  );
}


export default PomodoroTimerV1