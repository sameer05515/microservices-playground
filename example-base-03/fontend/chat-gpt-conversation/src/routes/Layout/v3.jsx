import Sidebar from "./Sidebar/v3";
import MainContent from "./MainContent/v2";

const LayoutV3 = () => {
  // const isDarkMode = useSelector(selectApplicationStateIsDarkModeActive);

  return (
    <div
      className={`min-h-screen flex`}
    >
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default LayoutV3;
