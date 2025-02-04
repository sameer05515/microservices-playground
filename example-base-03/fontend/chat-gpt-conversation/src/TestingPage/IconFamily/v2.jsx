import React, { useMemo, useState, useRef, useEffect } from "react";
import { iconFamily, iconFamilyLength, getIconComponent, getSelectedIndex } from "./utils";

const TreeNode = ({ node, setSelectedIcon, isSelected, refNode }) => (
  <span ref={refNode} className={`${""} ${isSelected ? "" : ""}`} onClick={() => setSelectedIcon(node)}>
    {node.name}
  </span>
);

const IconFamilyV2 = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const selectedRef = useRef(null);

  const selectedIndex = useMemo(() => {
    return getSelectedIndex(selectedIcon);
  }, [selectedIcon]);

  const IconComponent = useMemo(() => {
    return getIconComponent(selectedIcon);
  }, [selectedIcon]);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedIcon]);

  const handleNavigation = (increment = 0) => {
    if (selectedIndex >= 0) {
      setSelectedIcon(iconFamily[(selectedIndex + iconFamilyLength + increment) % iconFamilyLength]);
    }
  };
  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <header className="h-[10vh] bg-blue-500 flex items-center justify-center text-white">
        <h1>Dashboard Header</h1>
      </header>

      {/* Main Content Section */}
      <div className="flex flex-grow">
        {/* List Section */}
        <div className="w-1/4 bg-gray-100 overflow-auto p-4">
          <h2 className="text-lg font-bold mb-2">List Section</h2>
          <ul>
            {iconFamily.map((node) => (
              <li key={node.uniqueId} className="py-1 border-b">
                <TreeNode
                  node={node}
                  setSelectedIcon={setSelectedIcon}
                  isSelected={selectedIcon?.uniqueId === node.uniqueId}
                  refNode={selectedIcon?.uniqueId === node.uniqueId ? selectedRef : null}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Detail Section */}
        <div className="flex-grow bg-gray-300 p-4">
          <h2 className="text-lg font-bold mb-2">Detail Section: {selectedIcon?.name || "Select an icon"}</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod
            semper. Fusce dapibus, tellus ac cursus commodo.
          </p>
          <div className={""}>
            {selectedIcon ? (
              <>
                <IconComponent className={""} />
                <div className={""}>
                  <button className={""} onClick={() => handleNavigation(-1)} disabled={selectedIndex < 0}>
                    Prev
                  </button>
                  <button
                    className={""}
                    onClick={() => handleNavigation(1)}
                    disabled={selectedIndex > iconFamily.length - 1}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              "Please select an icon"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconFamilyV2;
