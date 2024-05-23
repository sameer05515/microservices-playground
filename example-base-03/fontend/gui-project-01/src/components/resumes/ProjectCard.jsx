import React from 'react'
import { useLocation } from 'react-router-dom';
import JSONDataViewer from '../../common/components/JSONDataViewer';
import HoverActions from '../../common/components/hover-actions/HoverActions';
import { renderCard } from '../../common/components/custom-card/Card';

const styles = {
  boldText: { fontWeight: "bold" },
};

const ProjectCard = () => {
  const location = useLocation();
  const { state } = location;
  const { project } = state;
  // Destructure company data
  const {
    uniqueId,
    name,
    // processedDetails: { metadata = {} } = {},
    // projects = [],
  } = project;
  return (
    <div>
      ProjectCard
      <div>
        <span style={styles.boldText}>Name:</span> {name} <br />
        <HoverActions />
      </div>

      {renderCard({
        title: "Project Employment Details",
        objectToBeRendered: project
      })}
      <JSONDataViewer metadata={{ project, state }} title='X-Ray' />
    </div>
  )
}

export default ProjectCard