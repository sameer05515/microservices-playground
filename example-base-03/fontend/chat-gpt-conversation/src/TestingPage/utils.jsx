import DashboardDemoV2 from "./DashboardDesigning/v2";
import DashboardDemoV1 from "./DashboardDesigning/v1";
import SampleNameListV1 from "./SampleNameList/v1";
import SampleNameListV2 from "./SampleNameList/v2";
import ConversationListV1 from "./ProducerConsumerImplementation/ConversationList/v1";
import ConversationListV2 from "./ProducerConsumerImplementation/ContextBasedApproach/v2";
import IconFamilyV1 from "./IconFamily/v1";
import IconFamilyV2 from "./IconFamily/v2";
import IconFamilyV3 from "./IconFamily/v3";
import IconFamilyV4 from "./IconFamily/v4";
import IconFamilyV5 from "./IconFamily/v5";
import IconFamilyV6 from "./IconFamily/v6";
import IconFamilyV7 from "./IconFamily/v7";
import IconFamilyV8 from "./IconFamily/v8";
import PragyamLayoutAdjustV1 from "./PragyamLayoutAdjust/v1";
import PragyamLayoutAdjustV2 from "./PragyamLayoutAdjust/v2";
import PragyamLayoutAdjustV3 from "./PragyamLayoutAdjust/v3";
import PragyamLayoutAdjustV4 from "./PragyamLayoutAdjust/v4";
import PragyamLayoutAdjustV5 from "./PragyamLayoutAdjust/v5";
import PragyamLayoutAdjustV6 from "./PragyamLayoutAdjust/v6";
import PragyamLayoutAdjustV7 from "./PragyamLayoutAdjust/v7";
// import PragyamLayoutAdjustV8 from "./PragyamLayoutAdjust/v8";
import MDSectionV1StyleCheck from "./PragyamLayoutAdjust/vv123";
import MessagesListV1 from "./MessageList/v1";
import InterviewFinalRoundPreparationV1 from "./InterviewFinalRoundPreparation/v1";
import TextInputWithRefTestingV1 from "./TextInputWithRefTesting/v1";
import TextInputWithRefTestingV2 from "./TextInputWithRefTesting/v2";
import APITestingV1 from "./APITesting/v1";
import OpenMdFileOnButtonClickV1 from "./OpenMdFileOnButtonClick/v1";
import KebabCaseConverterV1 from "./KebabCaseConverter/v1";
import ConsolidatedReportV1 from "./ConsolidatedReport/v1";
import APITestingV2 from "./APITesting/v2";
import APITestingV3 from "./APITesting/v3";
import APITestingV4 from "./APITesting/v4";
import APITestingV5 from "./APITesting/v5";
import ColorCodeV1 from "./ColorCode/v1";
import ColorCodeV2 from "./ColorCode/v2";
import NavigationButtonTesting from "./NavigationButtonTesting/v1";
import SmartPreviewerTestingV1 from "./SmartPreviewerTesting/v1";
import SmartPreviewerTestingV2 from "./SmartPreviewerTesting/v2";
import HTMLRenderTestingV1 from "./HTMLRenderTesting/v1";
import CornellMethodVisualizationV1 from "./CornellMethod/v1";
import PomodoroTimerV1 from "./PomodoroTimer/v1";
import ExternalLinksV1 from "./ExternalLinks/v1";
import MetaLearningCycleV1 from "./MetaLearningCycle/v1";
import MDSectionV8TesingV1 from "./MDSectionTesting/v1";
import MDSectionV8TestingV2 from "./MDSectionTesting/v2";
import KnowYourPositivityDashboardV1,{ ContentNavigator } from "./KnowYourPositivity";
import MDSectionV8TestingV3 from "./MDSectionTesting/v3";
import ChatDataXRayV1 from "./ChatDataXRay/v1";
import TimeZoneClockV1 from "./TimeZoneClock/v1";

// yaha seggregation logic lagana hai ki, asaani se samajh aaye ki kon sa version stable wala hai,
// abhi yaha bhid bhad dikh rahi hai.

// **TODO: LATER**: user ko component ke naam se matlab hai. 
//   - isiliye `Components` object ko thora aur develop kar sakte hain, ki seggregation ho ki kaun sa stable version hai.
//   - abhi ke liye comment kar sakte hain, jo unstable versions hai.

// - but abhi ke liye yaha koi change nhi karenge.
//   - Aaj ka mission clear hai: KnowYourPositivity.v1.0.1 ko live karna! 🎯

const Components = {
  DashboardDemoV1,
  DashboardDemoV2,
  SampleNameListV1,
  SampleNameListV2,
  ConversationListV1,
  ConversationListV2,
  IconFamilyV1,
  IconFamilyV2,
  IconFamilyV3,
  IconFamilyV4,
  IconFamilyV5,
  IconFamilyV6,
  IconFamilyV7,
  IconFamilyV8,
  PragyamLayoutAdjustV1,
  PragyamLayoutAdjustV2,
  PragyamLayoutAdjustV3,
  PragyamLayoutAdjustV4,
  PragyamLayoutAdjustV5,
  PragyamLayoutAdjustV6,
  PragyamLayoutAdjustV7,
  // PragyamLayoutAdjustV8,
  MDSectionV1StyleCheck,
  MessagesListV1,
  InterviewFinalRoundPreparationV1,
  TextInputWithRefTestingV1,
  TextInputWithRefTestingV2,
  APITestingV1,
  OpenMdFileOnButtonClickV1,
  KebabCaseConverterV1,
  ConsolidatedReportV1,
  APITestingV2,
  APITestingV3,
  APITestingV4,
  APITestingV5,
  ColorCodeV1,
  ColorCodeV2,
  NavigationButtonTesting,
  SmartPreviewerTestingV1,
  SmartPreviewerTestingV2,
  HTMLRenderTestingV1,
  CornellMethodVisualizationV1,
  PomodoroTimerV1,
  ExternalLinksV1,
  MetaLearningCycleV1,
  MDSectionV8TesingV1,
  MDSectionV8TesingV2: MDSectionV8TestingV2,
  ContentNavigator,
  KnowYourPositivityDashboardV1,
  MDSectionV8TestingV3,
  ChatDataXRayV1,
  TimeZoneClockV1
};

export const componentNames = Object.keys(Components);
const componentCount = componentNames.length;


export const calculateNextPrev = (selectedIndex) =>
  selectedIndex >= 0
    ? {
        next: componentNames[(selectedIndex + 1 + componentCount) % componentCount],
        prev: componentNames[(selectedIndex - 1 + componentCount) % componentCount],
      }
    : { next: "", prev: "" };

export const getComponentDetails = (componentName = "") => {
  const selectedIndex = componentNames.indexOf(componentName);
  return {
    Component: Components[componentName] || null,
    ...calculateNextPrev(selectedIndex),
  };
};
