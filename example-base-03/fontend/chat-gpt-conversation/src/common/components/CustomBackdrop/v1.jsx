import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentCount } from "../../../store/v1/selectors";
import { incrementCount } from "../../../store/v2/counter/actions";


/** This component will not work in future, as it is connected with simplest approach to create a store*/
const CustomBackdropV1 = () => {
  const count = useSelector(selectCurrentCount);
  const dispatch = useDispatch();

  const handleIncrement = () => dispatch(incrementCount());
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">CounterV1: Counter: {count}</h1>
      <button
        onClick={handleIncrement}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
      >
        Increment
      </button>
    </div>
  );
};

export default CustomBackdropV1;
