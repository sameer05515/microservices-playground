import React, { useMemo } from "react";
import { useConsolidatedReportContext } from "../context/v1";
import { StringifiedPreV2 } from "../../../common/components/StringifiedPre/v2";
import TopicCard from "./TopicCard/v1";
import TagCard from "./TagCard/v1";
import TaskCard from "./TaskCard/v1";
import LinkCard from "./LinkCard/v1";
import ItemNavigation from "./ItemNavigation/v1";

const debug = true;

const Right = ({ className }) => {
  const { selectedSectionItemData: selItem, selectedSectionItemNavigation: selNav } =
    useConsolidatedReportContext();
  const { title } = useMemo(
    () => ({
      title:
        selItem && selNav?.selectedIndex >= 0
          ? `[${selNav?.selectedIndex + 1}]: [${selItem.type}]: ${selItem?.name}`
          : "",
    }),
    [selItem, selNav]
  );
  if (!selItem) {
    return (
      <div className={`${className} flex flex-col gap-4 p-4`}>
        <p>Please select any item</p>
      </div>
    );
  }
  return (
    <div className={`${className} flex flex-col gap-4 p-4`}>
      {/* {title && <h2 className="text-xl font-semibold">{title}</h2>} */}
      {"Topic" === selItem.type && <TopicCard data={selItem} title={title} />}
      {"Tag" === selItem.type && <TagCard data={selItem} title={title} />}
      {"Task" === selItem.type && <TaskCard data={selItem} title={title} />}
      {"Link" === selItem.type && <LinkCard data={selItem} title={title} />}
      {debug && <StringifiedPreV2 obj={selItem} space={4} />}
      <ItemNavigation />
    </div>
  );
};

export default Right;
