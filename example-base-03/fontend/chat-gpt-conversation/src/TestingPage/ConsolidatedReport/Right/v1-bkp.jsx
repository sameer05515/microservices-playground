import React from "react";
import ConsolidatedServiceApis from "../../../common/utils/ConsolidatedServiceApis/v1";
// const debug=false;
const Right = ({ className }) => {
  const callApi = (asyncFunction) => {
    asyncFunction()
      .then((response) => console.log("response", response))
      .catch((error) => console.log(error));
  };
  return (
    <div className={`${className} flex flex-col gap-4 p-4`}>
      <button onClick={() => callApi(ConsolidatedServiceApis.getWelcomeMessage)}>getWelcomeMessage</button>
      <button onClick={() => callApi(ConsolidatedServiceApis.fetchAllSectionsV1)}>fetchAllSectionsV1</button>
      <button onClick={() => callApi(ConsolidatedServiceApis.fetchAllSectionsV2)}>fetchAllSectionsV2</button>
      <button onClick={() => callApi(ConsolidatedServiceApis.fetchAllSectionsV3)}>fetchAllSectionsV3</button>
      <button onClick={() => callApi(ConsolidatedServiceApis.fetchAllSectionsV4)}>fetchAllSectionsV4</button>
      <button onClick={() => callApi(ConsolidatedServiceApis.fetchAllSectionsV5)}>fetchAllSectionsV5</button>
      <button onClick={() => callApi(ConsolidatedServiceApis.fetchAllSectionsV6)}>fetchAllSectionsV6</button>
      <button onClick={() => callApi(ConsolidatedServiceApis.fetchAllSectionsV7)}>fetchAllSectionsV7</button>
    </div>
  );
};

export default Right;
