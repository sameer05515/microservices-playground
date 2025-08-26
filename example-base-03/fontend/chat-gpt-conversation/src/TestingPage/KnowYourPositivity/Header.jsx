import { useDispatch } from "react-redux";
// import { prev, next } from "../redux/slice";
import { navigateToNext as next, navigateToPrev as prev } from "../../store/v2/know-your-positivity/actions";

const Header = () => {
  const dispatch = useDispatch();

  return (
    <header className="shadow-md fixed top-0 left-0 w-full p-4 flex justify-between items-center">
      <div>
        <span className="text-xl font-bold text-blue-700">Know your potential</span>
        <span className="text-gray-600 italic">To push beyond limits, using some magic words</span>
      </div>
      <div>
        <button onClick={() => dispatch(prev())} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
          Previous
        </button>
        <button onClick={() => dispatch(next())} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Next
        </button>
      </div>
    </header>
  );
};

export default Header;
