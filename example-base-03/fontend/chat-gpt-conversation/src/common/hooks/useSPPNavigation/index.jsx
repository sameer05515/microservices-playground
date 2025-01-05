import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import routes from "./util";
import { useCallback } from "react";

const useSPPNavigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const goTo = useCallback(
    ({ to, options }) => {
      if (!to || !to.pathname) {
        console.error("Invalid navigation target:", to);
        return;
      }
      // console.log("Navigating to:", to, "with options:", options);
      navigate(to, options); // Navigate to the specified path
    },
    [navigate]
  );

  const goBack = useCallback(() => {
    navigate(-1); // Navigate back to the previous page
  }, [navigate]);

  const goToHome = useCallback(() => {
    goTo(routes.home());
  }, [goTo]);
  // const goToLogin = () => {
  //   goTo(routes.login());
  // };

  const goToTestingRoute = useCallback(
    ({ search, state, hash }) => {
      goTo(routes.testingRoute({ state, search, hash }));
    },
    [goTo]
  );

  return {
    goToHome,
    goBack,
    goToTestingRoute,
    searchParams,
    location,
  };
};

export default useSPPNavigation;
