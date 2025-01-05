import React from "react";
import CounterTestingDashboard from "./Counter";
import MDSectionTestingDashboard from "./MDSection";

const ApnaPlaygroundDashboard = () => {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-semibold text-center text-blue-600 md:text-4xl">
        ApnaPlaygroundDashboard
      </h1>
      <CounterTestingDashboard />
      <MDSectionTestingDashboard />
    </div>
  );
};

export default ApnaPlaygroundDashboard;
