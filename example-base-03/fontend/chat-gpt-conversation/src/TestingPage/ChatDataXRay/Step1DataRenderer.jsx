import { useEffect, useState } from "react";
import { apiRequest } from "../../common/utils/apiClient/v1";

const Step1DataRenderer = () => {
    const [step1Data, setStep1Data] = useState([]);
      const fetchItr2 = () => {
        apiRequest({ url: "http://localhost:3000/analyse-cgpt/api/step-1-fetch-all-snapshot-names/itr2" })
          .then((resp) => {
            console.log(resp);
            setStep1Data(resp.data.step1);
          })
          .catch((err) => console.error(err));
      };
    
      useEffect(() => fetchItr2(), []);
    
      if (!step1Data || step1Data.length < 1) {
        return null;
      }
  return (
    <div className="p-6">
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="">
            <tr>
              <th className="px-4 py-2 text-left border">ID</th>
              <th className="px-4 py-2 text-left border">Slug</th>
              <th className="px-4 py-2 text-left border">Order</th>
              <th className="px-4 py-2 text-left border">Location</th>
              <th className="px-4 py-2 text-left border">Is Latest</th>
              <th className="px-4 py-2 text-left border">Created On</th>
              <th className="px-4 py-2 text-left border">Created By</th>
              <th className="px-4 py-2 text-left border">Conv Count</th>
              <th className="px-4 py-2 text-left border">Total Msg Count</th>
            </tr>
          </thead>
          <tbody>
            {step1Data.map((item) => (
              <tr key={item.id} className="">
                <td className="px-4 py-2 border">{item.id}</td>
                <td className="px-4 py-2 border">{item.slug}</td>
                <td className="px-4 py-2 border">{item.order}</td>
                <td className="px-4 py-2 border">{item.location}</td>
                <td className="px-4 py-2 border">{item.isLatest ? "✅" : "❌"}</td>
                <td className="px-4 py-2 border">{item.createdOn}</td>
                <td className="px-4 py-2 border">{item.createdBy}</td>
                <td className="px-4 py-2 border">{item.convCount}</td>
                <td className="px-4 py-2 border">{item.totalMsgCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )
}

export default Step1DataRenderer