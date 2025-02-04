import * as CounterActions from "./action-types";

export const incrementCount = () => ({ type: CounterActions.INCREMENT, payload: 1 });
export const decrementCount = () => ({ type: CounterActions.DECREMENT, payload: -1 });
export const incrementCountByAmount = (amount = 2) => ({ type: CounterActions.INCREMENT_BY_AMOUNT, payload: amount });
