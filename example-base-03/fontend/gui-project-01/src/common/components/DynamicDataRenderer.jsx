import React from "react";
import CustomCollapse from "./CustomCollapse";

const DynamicDataRenderer = ({ data = {} }) => {
  const renderValue = (value) => {
    if (value === null) {
      return "null"; // Display "null" for null values
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value.toString();
    } else if (Array.isArray(value)) {
      // return value.join(', ');
      // return value.map((element, index) => (
      //   <div key={index}>{renderValue(element)}</div>
      // ));
      // return value.map((element, index) => (
      //   <div key={index}>
      //     {renderValue(element)}
      //     {/* {index < value.length - 1 && ', '} */}
      //   </div>
      // ));
      return (
        <ul>
          {value.map((element, index) => (
            <li key={index}>{renderValue(element)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <ul>
          {Object.keys(value).map((subKey, index) => (
            <li key={index}>
              <strong>{subKey}:</strong> {renderValue(value[subKey])}
            </li>
          ))}
        </ul>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      {/* <ul>
        {Object.keys(data).map((key, index) => (
          <li key={index}>
            <strong>{key}:</strong> {renderValue(data[key])}
          </li>
        ))}
      </ul> */}
      {renderValue(data)}
    </div>
  );
};

const WithCCDynamicDataRenderer = ({
  data = {},
  headerText = "No header text provided",
  showBoldTitle = true,
}) => {
  return (
    <CustomCollapse
      style={{
        border: "1px solid #ccc",
        padding: "5px",
        borderRadius: "10px",
      }}
      headerText={headerText || "No header text provided"}
      showBoldTitle={showBoldTitle}
    >
      <DynamicDataRenderer data={data} />
    </CustomCollapse>
  );
};

// export default DynamicDataRenderer;
// export { WithCCDynamicDataRenderer };
export { DynamicDataRenderer as default, WithCCDynamicDataRenderer };

