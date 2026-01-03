import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../common/utils/apiClient/v1";

const Step2DataRenderer = ({ onConvClick, slug }) => {
  const [step2Data, setStep1Data] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !step2Data.length) return step2Data;
    return [...step2Data].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      // Handle date sorting for createdOn and updatedOn
      if (sortKey === "createdOn" || sortKey === "updatedOn") {
        const aTime = new Date(aVal).getTime();
        const bTime = new Date(bVal).getTime();
        if (!isNaN(aTime) && !isNaN(bTime)) {
          return sortDir === "asc" ? aTime - bTime : bTime - aTime;
        }
        // fallback to string compare if not valid dates
        aVal = String(aVal ?? "").toLowerCase();
        bVal = String(bVal ?? "").toLowerCase();
        const cmp = aVal.localeCompare(bVal);
        return sortDir === "asc" ? cmp : -cmp;
      }

      const isNum = typeof aVal === "number" && typeof bVal === "number";
      if (isNum) {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      aVal = String(aVal ?? "").toLowerCase();
      bVal = String(bVal ?? "").toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [step2Data, sortKey, sortDir]);

  const SortIcon = ({ columnKey }) => {
    if (sortKey !== columnKey) return <span className="opacity-40">↕</span>;
    return sortDir === "asc" ? <span>↑</span> : <span>↓</span>;
  };
  const fetchItr2 = useCallback(() => {
    apiRequest({
      url: `http://localhost:3000/analyse-cgpt/api/step-2-fetch-count-of-conversation/itr1/${slug}`,
    })
      .then((resp) => {
        console.log(resp);
        setStep1Data(resp.data);
      })
      .catch((err) => console.error(err));
  }, [slug]);

  useEffect(() => fetchItr2(), [fetchItr2]);

  if (!step2Data || step2Data.length < 1) {
    return null;
  }
  return (
    <div className="p-6">
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="">
          <tr>
            {/* <th className="px-4 py-2 text-left border">ID</th> */}
            <th
              className="px-4 py-2 text-left border cursor-pointer select-none hover:bg-gray-100"
              onClick={() => handleSort("title")}
            >
              Title <SortIcon columnKey="title" />
            </th>
            <th
              className="px-4 py-2 text-left border cursor-pointer select-none hover:bg-gray-100"
              onClick={() => handleSort("createdOn")}
            >
              createdOn <SortIcon columnKey="createdOn" />
            </th>
            <th
              className="px-4 py-2 text-left border cursor-pointer select-none hover:bg-gray-100"
              onClick={() => handleSort("updatedOn")}
            >
              updatedOn <SortIcon columnKey="updatedOn" />
            </th>
            <th
              className="px-4 py-2 text-left border cursor-pointer select-none hover:bg-gray-100"
              onClick={() => handleSort("msgCount")}
            >
              Total Msg Count <SortIcon columnKey="msgCount" />
            </th>
            <th
              className="px-4 py-2 text-left border cursor-pointer select-none hover:bg-gray-100"
              onClick={() => handleSort("messages")}
            >
              Questions <SortIcon columnKey="messages" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.id} className="">
              {/* <td className="px-4 py-2 border">{item.id}</td> */}
              <td className="px-4 py-2 border cursor-pointer" onClick={() => onConvClick(slug, item.id)}>
                {item.title}
              </td>
              <td className="px-4 py-2 border">{item.createdOn}</td>
              <td className="px-4 py-2 border">{item.updatedOn}</td>
              <td className="px-4 py-2 border">{item.msgCount}</td>
              <td className="px-4 py-2 border">{item.messages}</td>
            </tr>
          ))}

          <tr>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 border">
              Total: {step2Data.map((item) => item.msgCount).reduce((acc, a) => acc + a, 0)}
            </td>
            <td className="px-4 py-2 border">
              Total: {step2Data.map((item) => item.messages).reduce((acc, a) => acc + a, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Step2DataRenderer;
