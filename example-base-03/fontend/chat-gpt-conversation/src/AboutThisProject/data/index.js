import description from "./description";
import {
  ourFuturePlanPostFirstPhase,
  ourOverAllPlan,
  ourPlanToImproveTheApplicationFirstPhase,
} from "./plans/v1";
import { developmentAndBugFixTracker, progressTracker } from "./trackers/phase1";

const ContentKeys = {
  DESCRIPTION: "description",
  OVERALL_PLAN: "ourOverAllPlan",
  CURRENT_PHASE_PLAN: "ourPlanToImproveTheApplicationFirstPhase",
  PROGRESS_TRACKER: "progressTracker",
  BUG_FIX_TRACKER: "developmentAndBugFixTracker",
  FUTURE_PLANS: "ourFuturePlanPostFirstPhase",
};

const getDetailsForKey = (key) => {
  switch (key) {
    case ContentKeys.DESCRIPTION:
      return description;
    case ContentKeys.OVERALL_PLAN:
      return ourOverAllPlan;
    case ContentKeys.CURRENT_PHASE_PLAN:
      return ourPlanToImproveTheApplicationFirstPhase;
    case ContentKeys.PROGRESS_TRACKER:
      return progressTracker;
    case ContentKeys.BUG_FIX_TRACKER:
      return developmentAndBugFixTracker;
    case ContentKeys.FUTURE_PLANS:
      return ourFuturePlanPostFirstPhase;
    default:
      return "";
  }
};

const sectionData = [
  { title: "Description", content: getDetailsForKey(ContentKeys.DESCRIPTION) },
  { title: "Overall Plan", content: getDetailsForKey(ContentKeys.OVERALL_PLAN) },
  { title: "Current Phase Plan", content: getDetailsForKey(ContentKeys.CURRENT_PHASE_PLAN) },
  { title: "Progress Tracker", content: getDetailsForKey(ContentKeys.PROGRESS_TRACKER) },
  { title: "Bug Fix Tracker", content: getDetailsForKey(ContentKeys.BUG_FIX_TRACKER) },
  { title: "Future Plans", content: getDetailsForKey(ContentKeys.FUTURE_PLANS) },
].map((sd, idx) => ({ ...sd, id: `section_${idx + 1}` }));

export { getDetailsForKey, ContentKeys, sectionData };
