import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage"; // Import the custom localStorage hook
import { useDispatch } from "react-redux";
import { setDarkViewMode, setLightViewMode } from "../../store/v2/application-states/actions";
// import { bootstrap } from "../../TestingPage/KnowYourPositivity/Registry";

const THEME_KEY = "viewMode";

const useThemeManager = () => {
  const dispatch = useDispatch();
  const { getItemForKey, setItemForKey } = useLocalStorage(THEME_KEY);
  const [theme, setTheme] = useState(() => getItemForKey(THEME_KEY) || "light");

  // Update theme both in state and localStorage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setItemForKey(THEME_KEY, newTheme);
    const isDarkMode = theme === "dark";
    if (isDarkMode) {
      dispatch(setLightViewMode());
    } else {
      dispatch(setDarkViewMode());
    }
  };

  // Apply theme to document when it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // useEffect(() => {
  //   bootstrap();
  // }, []);

  return { toggleTheme };
};

export default useThemeManager;
