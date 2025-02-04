import React from "react";
import CounterV1 from "./v1";
import CounterV2 from "./v2";

const CounterTestingDashboard = () => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-center text-blue-600 md:text-4xl">CounterTestingDashboard</h2>
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-8 rounded-lg shadow-lg">
        <CounterV1 />
      </div>
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-8 rounded-lg shadow-lg">
        <CounterV2 />
      </div>
    </div>
  );
};

export default CounterTestingDashboard;
