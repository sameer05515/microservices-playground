import React, { useMemo } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { componentNames, getComponentDetails } from "./utils";
import SidebarV3 from "../routes/Layout/Sidebar/v3";
import { AiFillForward as NextIcon, AiFillBackward as PrevIcon } from "react-icons/ai";
import PomodoroTimerV2 from "./PomodoroTimer/v2";

const HeaderComp = ({ param, next, prev }) => (
  <div className="mt-0 flex flex-col items-center text-xs shadow-md">
    {/* Top Title Section */}
    <h1 className="font-bold py-2">
      <NavLink to={param ? "/testing" : "/"} className="text-blue-600 dark:text-cyan-300 hover:underline">
        {param ? "TESTING PAGE HOME" : "ROOT"}
      </NavLink>
    </h1>

    {/* Navigation Header Section */}
    <header className="p-3 flex justify-between items-center w-full bg-white dark:bg-black border-t border-b border-gray-300">
      {/* Previous Link */}
      {prev ? (
        <NavLink
          className="flex-1 text-left text-blue-600 dark:text-cyan-300 hover:underline flex items-center"
          to={`/testing?tester=${prev}`}
        >
          <PrevIcon className="mr-1" />
          <span>{prev}</span>
        </NavLink>
      ) : (
        <div className="flex-1"></div>
      )}

      {/* Current Route Info */}
      <span className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-sky-300 flex items-center">
        <span>Current Route: '{param || "None"}'</span>
        <PomodoroTimerV2 />
      </span>

      {/* Next Link */}
      {next ? (
        <NavLink
          className="flex-1 text-right text-blue-600 dark:text-cyan-300 hover:underline flex items-center justify-end"
          to={`/testing?tester=${next}`}
        >
          <span>{next}</span>
          <NextIcon className="ml-1" />
        </NavLink>
      ) : (
        <div className="flex-1"></div>
      )}
    </header>

    {/* Navigation Links for Component Names */}
    {!param && (
      <div className="py-2 flex flex-col justify-center gap-4">
        {componentNames.map((name) => (
          <NavLink
            key={name}
            to={`/testing?tester=${name}`}
            className="text-blue-600 dark:text-cyan-300 hover:underline font-medium text-sm"
          >
            {name}
          </NavLink>
        ))}
      </div>
    )}
  </div>
);

const TestingDashboard = () => {
  const [searchParams] = useSearchParams();
  const param = searchParams.get("tester") || "";

  const { Component, next, prev } = useMemo(() => {
    return getComponentDetails(param);
  }, [param]);

  return (
    <>
      <SidebarV3 />
      <div className="ml-12 mr-4">
        <HeaderComp param={param} next={next} prev={prev} />
        {Component && <Component />}
      </div>
    </>
  );
};

export default TestingDashboard;
