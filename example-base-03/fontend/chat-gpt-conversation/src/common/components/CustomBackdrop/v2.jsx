import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectBackdropV1IsActive, selectCurrentCount } from "../../../store/v2/selectors";
import { incrementCount } from "../../../store/v2/counter/actions";
import { showBackdropV1, hideBackdropV1 } from "../../../store/v2/backdrop/actions";

const CustomBackdropV2 = () => {
  const count = useSelector(selectCurrentCount);
  const isActive = useSelector(selectBackdropV1IsActive);
  const dispatch = useDispatch();

  const handleIncrement = () => dispatch(incrementCount());
  const handleClick = () => {
    if (isActive) {
      dispatch(hideBackdropV1());
    } else {
      dispatch(showBackdropV1());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Custom Backdrop V2</h1>
        <p className="text-lg font-medium mb-2">
          Current Count: <span className="text-blue-500">{count}</span>
        </p>
        <p className="text-lg font-medium mb-6">
          Backdrop Active:{" "}
          <span className={`font-bold ${isActive ? "text-green-500" : "text-red-500"}`}>
            {isActive ? "Yes" : "No"}
          </span>
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleIncrement}
            className="px-6 py-2 bg-blue-500 text-white text-lg font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Increment Count
          </button>
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-indigo-500 text-white text-lg font-medium rounded-lg shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Toggle Backdrop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomBackdropV2;
