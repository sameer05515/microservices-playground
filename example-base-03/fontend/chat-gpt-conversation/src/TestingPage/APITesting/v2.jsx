import GroupedSectionView from "./GroupedSectionView/v1";
// import ConsolidatedServiceApis from "../ConsolidatedReport/ConsolidatedServiceApis/v1";
// import { useEffect, useState } from "react";
// import { mapResponseToSections } from "./GroupedSectionView/Section";

export const groupedData = [
  {
    type: "Task",
    items: [
      { name: "Task 1", uniqueId: "1" },
      { name: "Task 2", uniqueId: "2" },
    ],
  },
  {
    type: "Topic",
    items: [
      { name: "Topic 1", uniqueId: "3" },
      { name: "Topic 2", uniqueId: "4" },
    ],
  },
];

const fetchDetails = ({ uniqueId, type }) => {
  console.log(`Fetching details for ${type} with ID ${uniqueId}`);
  // Call your API here
};

/**
 * Below code is commented intentionally.
 *
 * The purpose of this component to test use of `IntersectionObserver` with `GroupedSectionView`.
 * 
 * However, to avoid unneccesary backend call, we are commenting below code.
 * */

const APITestingV2 = () => {
  //     const [myGroupedData,setMyGroupedData]=useState([]);
  //     const [loading,setLoading]=useState(false);
  //   const callApi = (asyncFunction) => {
  //     setMyGroupedData([]);
  //     setLoading(true);
  //     asyncFunction()
  //       .then((response) => {
  //         console.log("response", response);
  //         if(!response.isError){
  //             setMyGroupedData(mapResponseToSections([...response.data]));
  //         }else{
  //             console.error(response.error);
  //         }
  //     })
  //       .catch((error) => console.log(error))
  //       .finally(()=>setLoading(false));
  //   };

  //   useEffect(()=>{
  //     callApi(ConsolidatedServiceApis.fetchAllSectionsV7)
  //   },[]);
  //   if(loading){
  //     return <div>Loading....</div>
  //   }
  return (
    <div>
      <h1>Grouped Data View</h1>
      {/* <GroupedSectionView groupedData={myGroupedData} onItemClick={fetchDetails} /> */}
      <GroupedSectionView groupedData={groupedData} onItemClick={fetchDetails} />
      <pre>{JSON.stringify(groupedData, null, 2)}</pre>
      {/* <pre>{JSON.stringify(myGroupedData,null,2)}</pre> */}
    </div>
  );
};

export default APITestingV2;
