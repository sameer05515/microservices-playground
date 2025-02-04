import React from "react";
import { sectionData } from "./data";
import "highlight.js/styles/github-dark.css";
import MDSectionV1 from "../common/components/MDSection/v1";
import MDSectionV7 from "../common/components/MDSection/v7";

const AboutThisProject = () => {
  return (
    <div className="p-10 font-sans leading-relaxed min-h-screen">
      {sectionData.map(({ id, content }) => (
        <MDSectionV1 key={id} content={content} />
      ))}
      <MDSectionV7 mdFileUrl="/analysis/Questions-As-per-my-expertise.md"/>
    </div>
  );
};


export const TargettedQuestions=()=>{

  return(
    <div className="p-10 font-sans leading-relaxed min-h-screen">
      <MDSectionV7 mdFileUrl="/analysis/Questions-As-per-my-expertise.md"/>
    </div>
  )
}

export default AboutThisProject;
