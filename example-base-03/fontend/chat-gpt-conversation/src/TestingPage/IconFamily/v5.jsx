import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { iconFamily, iconFamilyLength, getIconComponent, getSelectedIndex } from "./utils";
import { useNavigate, useSearchParams, createSearchParams } from "react-router-dom";

const TreeNode = ({ node, setSelectedIcon, isSelected, refNode }) => (
  <span
    ref={refNode}
    className={`block p-2 rounded cursor-pointer ${
      isSelected ? "bg-blue-200 text-blue-800 font-bold" : "hover:bg-gray-200"
    }`}
    onClick={() => setSelectedIcon(node)}
  >
    {node.name}
  </span>
);

const createSearchParamsString = (params) => {
  return createSearchParams(params).toString();
};

const IconFamilyV5 = () => {
  const [searchParams] = useSearchParams();
  const iconId = searchParams.get("iconId") || "";
  const navigate = useNavigate();
  // const [] = useState(null);
  const selectedRef = useRef(null);

  const { selectedIndex, selectedIcon } = useMemo(() => {
    const selectedIndex = getSelectedIndex({ uniqueId: iconId });
    const selectedIcon = iconFamily[selectedIndex] || null;
    return { selectedIndex, selectedIcon };
  }, [iconId]);

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

  const setSelectedIcon = useCallback(
    (icon) => {
      if (!icon) return;
      navigate({
        pathname: "/testing",
        search: createSearchParamsString({ tester: "IconFamilyV5", iconId: icon.uniqueId }),
      });
    },
    [navigate]
  );

  const handleNavigation = useCallback(
    (increment = 0) => {
      if (selectedIndex >= 0) {
        setSelectedIcon(iconFamily[(selectedIndex + iconFamilyLength + increment) % iconFamilyLength]);
      }
    },
    [selectedIndex, setSelectedIcon]
  );

  return (
    <div className="flex flex-col h-[70vh]">
      {/* Header Section */}
      <header className="h-[5vh] bg-blue-500 flex items-center justify-center text-white">
        <h1 className="text-xl font-semibold">Dashboard Header: {selectedIcon?.name || "Select an icon"}</h1>
      </header>

      {/* Main Content Section */}
      <div className="flex flex-grow overflow-auto">
        {/* List Section */}
        <div className="w-1/4 bg-gray-100 p-4 border-r overflow-auto">
          <h2 className="text-lg font-bold mb-2">List Section</h2>
          <ul>
            {iconFamily.map((node) => (
              <li key={node.uniqueId} className="py-1">
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
        <div className="flex-grow bg-gray-300 p-4 flex flex-col justify-between overflow-auto">
          {selectedIcon ? (
            <div className="flex flex-col items-center">
              <IconComponent className="w-32 h-32 mb-4 text-blue-600" />
              <div className="flex space-x-4 text-xs">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                  onClick={() => handleNavigation(-1)}
                  disabled={selectedIndex < 0}
                >
                  Prev
                </button>
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                  onClick={() => handleNavigation(1)}
                  disabled={selectedIndex > iconFamily.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center mt-4 text-gray-600">Please select an icon</div>
          )}

          <div>
            <h2 className="text-lg font-bold mb-2">
              Detail Section: {selectedIcon?.name || "Select an icon"}
            </h2>
            <ul>
              {Array.from({ length: 100 }, (_, i) => (
                <li key={i} className="py-1 border-b">
                  Item {i + 1}
                  <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis
                    euismod semper. Fusce dapibus, tellus ac cursus commodo.
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconFamilyV5;
