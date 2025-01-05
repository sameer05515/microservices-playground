import React from "react";
import useNodeServiceApis from "../InterviewFinalRoundPreparation/useNodeServiceApis/v1";

const APITestingV1 = () => {
  const { fetchAllNodes } = useNodeServiceApis();
  const handleClick = () => {
    fetchAllNodes()
      .then(({ data, isError, message }) => {
        console.log("response", {
          data,
          isError,
          message,
        });
      })
      .catch((error) => console.error("Unexpected error: ", error));
  };
  return <div>
    <h1>APITestingV1</h1>
    <button onClick={handleClick}>Fetch All</button>
  </div>;
};

export default APITestingV1;
