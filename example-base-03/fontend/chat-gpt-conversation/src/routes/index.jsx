import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AboutThisProjectV2, { TargettedQuestions } from "../AboutThisProject/v2";
import ApnaPlaygroundDashboard from "../ApnaPlaygroundDashboard/v1";
import CustomBackdropV1 from "../common/components/CustomBackdrop/v2";
import CustomBackdropV3 from "../common/components/CustomBackdrop/v3";
import CGPTDataRendererDashboardV1 from "../components/CGPTDataRendererDashboard/v1";
import PragyamDashboardV2 from "../components/CGPTDataRendererDashboard/v2";
import ResumeComponent from "../components/resume/ResumeComponent";
import Layout from "./Layout/v3";
import NotFound from "./NotFound/v2";
import TestingDashboard from "../TestingPage";
import { useDispatch } from "react-redux";
import { fetchNodeList } from "../store/v2/consolidated-report/actions";

const CGPTAppRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNodeList());
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/**Test route- for arbitrary testing from scratch*/}
        <Route path="/testing" element={<TestingDashboard />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<AboutThisProjectV2 />} />

          <Route path="/targetted-questions" element={<TargettedQuestions />} />

          {/** ----- Apna Playground ---------------------------- */}
          <Route path="/apna-playground" element={<ApnaPlaygroundDashboard />} />

          {/** ----- RESUME MANAGEMENT ---------------------- */}

          <Route path="/resume" element={<ResumeComponent />} />

          {/** ----- CGPTDataRendererV1 MANAGEMENT ---------------------- */}

          <Route path="/cgpt/v1" element={<CGPTDataRendererDashboardV1 />} />

          {/** PragyamDashboardV2 MANAGEMENT*/}

          <Route path="/cgpt/v2" element={<PragyamDashboardV2 />} />

          {/** ----- SETTINGS MANAGEMENT ---------------------- */}
          <Route path="/settings" element={<CustomBackdropV1 />} />

          {/** ----- NOT FOUND ---------------------- */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <CustomBackdropV3 />
    </>
  );
};

export default CGPTAppRoutes;
