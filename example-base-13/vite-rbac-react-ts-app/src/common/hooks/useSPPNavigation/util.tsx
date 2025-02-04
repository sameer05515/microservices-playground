import { createSearchParams } from "react-router-dom";

interface NavigationObject {
  to: {
    pathname: string;
    search?: string;
    hash?: string;
  };
  options?: {
    state?: unknown;
  };
}

const createSearchParamsString = (params: Record<string, string>): string => {
  return createSearchParams(params).toString();
};

const prepareObject = (
  pathname: string = "",
  state?: unknown,
  search?: Record<string, string>,
  hash?: string
): NavigationObject => ({
  to: {
    pathname: pathname,
    search: search ? createSearchParamsString(search) : "",
    hash,
  },
  options: state ? { state } : undefined,
});

export const prepareTestingRouteObjectForNavLink = (
  pathname: string = "/testing",
  search?: Record<string, string>
): NavigationObject => prepareObject(pathname, null, search);

const routes = {
  home: (): NavigationObject => prepareObject("/"),
  testingRoute: ({
    pathname = "/testing",
    search,
    state,
    hash,
  }: {
    pathname?: string;
    search?: Record<string, string>;
    state?: unknown;
    hash?: string;
  }): NavigationObject => prepareObject(pathname, state, search, hash),
};

export default routes;
