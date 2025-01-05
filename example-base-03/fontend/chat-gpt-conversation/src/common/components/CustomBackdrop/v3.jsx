import React from "react";
import { useSelector } from "react-redux";
import {
  selectCustomBackdropV3CurrentDescription,
  selectCustomBackdropV3CurrentSubtitle,
  selectCustomBackdropV3CurrentTitle,
  selectIsCustomBackdropV3Active
} from "../../../store/v2/selectors";

const CustomBackdropV3 = () => {
  const isActive = useSelector(selectIsCustomBackdropV3Active);
  const title = useSelector(selectCustomBackdropV3CurrentTitle);
  const subtitle = useSelector(selectCustomBackdropV3CurrentSubtitle);
  const description = useSelector(selectCustomBackdropV3CurrentDescription);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center animate-fadeIn backdrop-blur-md p-6">
      {title && (
        <h1 className="text-white text-4xl font-bold drop-shadow-lg animate-slideDown hover:scale-105 transform transition-all">
          {title}
        </h1>
      )}
      {subtitle && (
        <h2 className="text-gray-300 text-2xl mt-4 drop-shadow-md hover:text-white transition-colors">
          {subtitle}
        </h2>
      )}
      {description && (
        <p className="text-gray-400 text-lg mt-4 text-center max-w-4xl leading-relaxed hover:text-gray-200 transition-colors">
          {description}
        </p>
      )}
    </div>
  );
};

export default CustomBackdropV3;
