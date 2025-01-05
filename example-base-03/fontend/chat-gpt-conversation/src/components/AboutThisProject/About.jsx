import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./About.module.css"; // Importing the CSS module
import { getDetailsForKey, ContentKeys as Elements } from "./data";

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.markdownSection}>
        <ReactMarkdown>{getDetailsForKey(Elements.DESCRIPTION)}</ReactMarkdown>
      </div>
      <div className={styles.markdownSection}>
        <ReactMarkdown>{getDetailsForKey(Elements.OVERALL_PLAN)}</ReactMarkdown>
      </div>
      <div className={styles.markdownSection}>
        <ReactMarkdown>{getDetailsForKey(Elements.CURRENT_PHASE_PLAN)}</ReactMarkdown>
      </div>
      <div className={styles.markdownSection}>
        <ReactMarkdown>{getDetailsForKey(Elements.PROGRESS_TRACKER)}</ReactMarkdown>
      </div>
      <div className={styles.markdownSection}>
        <ReactMarkdown>{getDetailsForKey(Elements.BUG_FIX_TRACKER)}</ReactMarkdown>
      </div>
      <div className={styles.markdownSection}>
        <ReactMarkdown>{getDetailsForKey(Elements.FUTURE_PLANS)}</ReactMarkdown>
      </div>
    </div>
  );
};

export default About;
