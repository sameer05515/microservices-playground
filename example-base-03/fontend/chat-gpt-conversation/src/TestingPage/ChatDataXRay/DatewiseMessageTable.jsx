import React, { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../common/utils/apiClient/v1";

const DatewiseMessageTable = ({ slug, onDateClick }) => {
  const [step2Data, setStep1Data] = useState([]);
  const fetchItr2 = useCallback(() => {
    apiRequest({
      url: `http://localhost:3000/analyse-cgpt/api/step-7-fetch-datewise-message-count/itr1/${slug}`,
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
            <th className="px-4 py-2 text-left border">Date</th>
            <th className="px-4 py-2 text-left border">User query count</th>
            {/* <th className="px-4 py-2 text-left border">updatedOn</th>
            <th className="px-4 py-2 text-left border">Total Msg Count</th>
            <th className="px-4 py-2 text-left border">Questions</th> */}
          </tr>
        </thead>
        <tbody>
          {step2Data.map((item) => (
            <tr key={item.date} className="">
              {/* <td className="px-4 py-2 border">{item.id}</td> */}
              <td className="px-4 py-2 border cursor-pointer" onClick={() => onDateClick(slug, item.date)}>
                {item.date}
              </td>
              {/* <td className="px-4 py-2 border">{item.date}</td> */}
              <td className="px-4 py-2 border">{item.msgCount}</td>
              {/* <td className="px-4 py-2 border">{item.msgCount}</td>
              <td className="px-4 py-2 border">{item.messages}</td> */}
            </tr>
          ))}

          {/* <tr>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 border">
              Total: {step2Data.map((item) => item.msgCount).reduce((acc, a) => acc + a, 0)}
            </td>
            <td className="px-4 py-2 border">
              Total: {step2Data.map((item) => item.messages).reduce((acc, a) => acc + a, 0)}
            </td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
};

export default DatewiseMessageTable;
