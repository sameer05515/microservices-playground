import { useDispatch, useSelector } from "react-redux";
import { navigateToNext, navigateToPrev } from "../../store/v2/know-your-positivity/actions";
import { selectApplicationStateSelectedId } from "../../store/v2/selectors";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";

const KnowYourPositivityDashboardV1 = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

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

export default KnowYourPositivityDashboardV1;

export { ContentNavigator };
