import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrementCount, incrementCount, incrementCountByAmount } from "../../store/v2/counter/actions";
import { selectCurrentCount } from "../../store/v2/selectors";
import styles from "./styles.module.css"; // Optional: For custom styling

const CounterV2 = () => {
  const count = useSelector(selectCurrentCount);
  const dispatch = useDispatch();

  const handleIncrement = () => dispatch(incrementCount());
  const handleDecrement = () => dispatch(decrementCount());
  const handleIncrementByAmount = (amount) => dispatch(incrementCountByAmount(amount));

  return (
    <div
      className={`${styles.fadeIn} ${styles.counterContainer} flex flex-col items-center justify-center space-y-4 p-6`}
    >
      <h1 className="text-2xl font-semibold">CounterV2: Counter: {count}</h1>
      <div className="space-x-2">
        <button
          onClick={handleIncrement}
          className={`${styles.buttonCustom} px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none`}
        >
          Increment
        </button>
        <button
          onClick={handleDecrement}
          className={`${styles.buttonCustom} px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none`}
        >
          Decrement
        </button>
        <button
          onClick={() => handleIncrementByAmount(5)}
          className={`${styles.buttonCustom} px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none`}
        >
          Increment by 5
        </button>
      </div>
    </div>
  );
};

export default CounterV2;
