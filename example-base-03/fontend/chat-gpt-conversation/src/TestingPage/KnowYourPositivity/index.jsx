import { useDispatch, useSelector } from "react-redux";
import { navigateToNext, navigateToPrev } from "../../store/v2/know-your-positivity/actions";
import { selectApplicationStateSelectedId } from "../../store/v2/selectors";
// "../../store/v2/backdrop/actions"

const ContentNavigator = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectApplicationStateSelectedId);

  return (
    <div>
      <p>Selected ID: {selectedId}</p>
      <button onClick={() => dispatch(navigateToPrev())}>Prev</button>
      <button onClick={() => dispatch(navigateToNext())}>Next</button>
    </div>
  );
};

export { ContentNavigator };
