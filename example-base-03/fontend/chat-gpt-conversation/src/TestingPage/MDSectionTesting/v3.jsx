import React, { useCallback } from "react";
import MDSectionV8 from "../../common/components/MDSection/v8";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";

const smartContentApiUrl = "http://localhost:3000/v2/api/smart-content/itr1";

const data = [
  // `${smartContentApiUrl}/actionables--my-bugs-and-new-requirements-md`,
  `${smartContentApiUrl}/16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr0`,
  `${smartContentApiUrl}/16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr1`,
  `${smartContentApiUrl}/16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr2`,
  `${smartContentApiUrl}/16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr3`,
  `${smartContentApiUrl}/16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr4`,
];

export const getNavigation = (index = 0) => {
  try {
    if (index < 0 || index >= data.length) {
      throw new Error("Invalid index");
    }

    return {
      currentIndex: index,
      nextIndex: (index + 1) % data.length,
      prevIndex: (index - 1 + data.length) % data.length,
      data: data[index],
    };
  } catch (error) {
    console.error(error?.message || "Something went wrong!");
    return null;
  }
};

const MDSectionV8TestingV3 = () => {
  const { searchParams, goToTestingRoute } = useSPPNavigation();
  const selectedIndex = parseInt(searchParams.get("selectedIndex") || "0", 10);

  const handleNavigate = useCallback(
    (index) => {
      console.log("Navigating to Index:", index);
      goToTestingRoute({
        search: {
          tester: "MDSectionV8TestingV3",
          selectedIndex: index, // ✅ Corrected
        },
      });
    },
    [goToTestingRoute]
  );

  const navigationData = getNavigation(selectedIndex) || {
    data: null,
    nextIndex: 0,
    prevIndex: data.length - 1,
  };

  const handleRecievingSuccessResponse = useCallback((response) => response.data?.content || "", []);

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <button
          title="Currently reload not working. Workaround is copy other slug and then recopy"
          type="button"
          onClick={() => handleNavigate(navigationData.prevIndex)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Prev
        </button>
        Selected Index: {selectedIndex}
        <button
          title="Currently reload not working. Workaround is copy other slug and then recopy"
          type="button"
          onClick={() => handleNavigate(navigationData.nextIndex)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>

      {/* Conditional Rendering */}
      {navigationData.data && (
        <MDSectionV8
          mdFileUrl={navigationData.data}
          onRecievingSuccessResponse={handleRecievingSuccessResponse}
        />
      )}
    </div>
  );
};

export default MDSectionV8TestingV3;
