import React, { useCallback } from "react";
import MDSectionV8 from "../../common/components/MDSection/v8";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";

const smartContentApiUrl = "http://localhost:3000/v2/api/smart-content/itr1";

const getUrl = (url, slug) => {
  if (!url || !slug) return "";
  return `${url}/${slug}`;
};

// **Todo**:
// - Yahan bhi `data` array me slugs ki baadh lagne wali hai. 😤😤
// - `chaos` create hoga, kuch din baad! Ki 🤔
//   - isme se latest wala kon sa hai? 🙇‍♂️
//   - `date-wise categorization` kaise karein, taaki ek good UX mile?? 😤
// - 🎯**Jugaad kar lo bhai!! Jaldi se!! 😍
//

const data = [
  //15Feb2025
  getUrl(smartContentApiUrl, "15Feb2025.know-your-positivity--about-this-module--index-v1-md"),

  // 16Feb2025
  getUrl(
    smartContentApiUrl,
    "16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr0"
  ),
  getUrl(
    smartContentApiUrl,
    "16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr1"
  ),
  getUrl(
    smartContentApiUrl,
    "16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr2"
  ),
  getUrl(
    smartContentApiUrl,
    "16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr3"
  ),
  getUrl(
    smartContentApiUrl,
    "16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today-itr4"
  ),
  getUrl(
    smartContentApiUrl,
    "17Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today--itr--4-2"
  ),

  //17Feb2025
  getUrl(
    smartContentApiUrl,
    "17Feb2025.know-your-positivity---todays-target---review-practice-and-retrospect--itr--1-1"
  ),
  getUrl(
    smartContentApiUrl,
    "17Feb2025.know-your-positivity---todays-target---review-practice-and-retrospect--itr--1-2"
  ),
  getUrl(
    smartContentApiUrl,
    "17Feb2025.know-your-positivity---todays-target---review-practice-and-retrospect--itr--1-3"
  ),
  getUrl(
    smartContentApiUrl,
    "17Feb2025.know-your-positivity---todays-target---review-practice-and-retrospect--itr--2-1"
  ),
  getUrl(
    smartContentApiUrl,
    "17Feb2025.know-your-positivity---todays-target---review-practice-and-retrospect--itr--2-2"
  ),
  getUrl(
    smartContentApiUrl,
    "17Feb2025.know-your-positivity---todays-target---review-practice-and-retrospect--itr--3-1"
  ),
  getUrl(
    smartContentApiUrl,
    "17Feb2025.know-your-positivity---todays-target---review-practice-and-retrospect--itr--3-2"
  ),

  //18Feb2025
  getUrl(
    smartContentApiUrl,
    "18Feb2025.know-your-positivity---review-practice-and-retrospect---part-2---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--1-1"
  ),
  getUrl(
    smartContentApiUrl,
    "18Feb2025.know-your-positivity---review-practice-and-retrospect---part-2---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--1-2"
  ),
  getUrl(
    smartContentApiUrl,
    "18Feb2025.know-your-positivity---review-practice-and-retrospect---part-2---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--1-3"
  ),
  getUrl(
    smartContentApiUrl,
    "18Feb2025.know-your-positivity---review-practice-and-retrospect---part-2---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--2-1"
  ),
  getUrl(
    smartContentApiUrl,
    "18Feb2025.know-your-positivity---review-practice-and-retrospect---part-2---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--2-2"
  ),
  getUrl(
    smartContentApiUrl,
    "18Feb2025.know-your-positivity---review-practice-and-retrospect---part-2---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--3-1"
  ),
  getUrl(
    smartContentApiUrl,
    "18Feb2025.know-your-positivity---review-practice-and-retrospect---part-2---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--3-2"
  ),

  //19Feb2025
  getUrl(
    smartContentApiUrl,
    "19Feb2025.know-your-positivity---review-practice-and-retrospect---part-3---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--1-1"
  ),
  getUrl(
    smartContentApiUrl,
    "19Feb2025.know-your-positivity---review-practice-and-retrospect---part-3---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--1-2"
  ),
  getUrl(
    smartContentApiUrl,
    "19Feb2025.know-your-positivity---review-practice-and-retrospect---part-3---simplify-processing-and-retrieval---of-meaningful-informations-from-a-chat-backup-file--itr--1-3"
  ),
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
        Selected Index: {selectedIndex} , Slug: {navigationData.data || "NA"}
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
