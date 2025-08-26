import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import routes from "./util";
import { useCallback } from "react";

interface NavigationOptions {
  replace?: boolean;
  state?: unknown;
}

interface NavigationTarget {
  to: {
    pathname: string;
    search?: string;
    hash?: string;
  };
  options?: NavigationOptions;
}

const useSPPNavigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const goTo = useCallback(
    ({ to, options }: NavigationTarget) => {
      if (!to || !to.pathname) {
        console.error("Invalid navigation target:", to);
        return;
      }
      navigate(to, options);
    },
    [navigate]
  );

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goToHome = useCallback(() => {
    goTo(routes.home());
  }, [goTo]);

  const goToTestingRoute = useCallback(
    ({
      pathname = "/testing",
      search,
      state,
      hash,
    }: {
      pathname?: string;
      search?: Record<string, string>;
      state?: unknown;
      hash?: string;
    }) => {
      goTo(routes.testingRoute({ pathname, state, search, hash }));
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
