import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { getIconDetailsByParentId, getAllIconParents, filterIconFamilyByParentId, getIcon } from "./utils-v2";
import { useNavigate, useSearchParams, createSearchParams, NavLink } from "react-router-dom";
import withModal from "../../common/hoc/withModal/v2";

const createSearchParamsString = (params) => {
  return createSearchParams(params).toString();
};

const TreeNode = ({ node, onNodeSelection, isSelected, refNode }) => (
  <span
    ref={refNode}
    className={`block p-2 rounded cursor-pointer ${
      isSelected ? "bg-blue-200 text-blue-800 font-bold" : "hover:bg-gray-200"
    }`}
    onClick={() => onNodeSelection && onNodeSelection(node)}
  >
    {node.name}
  </span>
);

const IconFamilyList = () => {
  const iconParents = useMemo(() => getAllIconParents(), []);
  return (
    <div className="mt-0 flex flex-col items-center text-xs">
      <div className="text-4xl">SELECT AN ICON PARENT</div>
      {iconParents.map(({ id, name }) => (
        <NavLink
          key={id}
          to={{
            pathname: "/testing",
            search: createSearchParamsString({ tester: "IconFamilyV8", iconParentId: id }),
          }}
          className="text-blue-600 hover:underline"
        >
          <strong className="text-sm">{name}</strong>
        </NavLink>
      ))}
    </div>
  );
};

const IconFamilyListPopup = withModal(IconFamilyList);

const IconFamilyV8 = () => {
  const [searchParams] = useSearchParams();
  const iconId = searchParams.get("iconId") || "";
  const iconParentId = searchParams.get("iconParentId") || "";
  const shouldShowIconFamilyPopup = searchParams.get("showIconFamilyPopup") || "no";
  const navigate = useNavigate();
  const selectedRef = useRef(null);

  const { iconParents, PopupOpenIcon, PopupCloseIcon } = useMemo(
    () => ({
      iconParents: getAllIconParents(),
      PopupOpenIcon: getIcon("ReactIconsBI_BiMinusBack"),
      PopupCloseIcon: getIcon("ReactIconsBI_BiMinus"),
    }),
    []
  );

  const iconFamily = useMemo(() => filterIconFamilyByParentId(iconParentId), [iconParentId]);

  const { selectedIcon, IconComponent, next, prev } = useMemo(
    () => getIconDetailsByParentId(iconId, iconParentId),
    [iconId, iconParentId]
  );

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedIcon]);

  const showIconFamilyPopup = useCallback(
    (command = false, icon, iconParentId) => {
      const searchObj = {
        tester: "IconFamilyV8",
        showIconFamilyPopup: command ? "yes" : "no",
        iconParentId,
      };
      if (icon && icon.uniqueId) {
        searchObj.iconId = icon.uniqueId;
      }
      navigate({
        pathname: "/testing",
        search: createSearchParamsString({
          ...searchObj,
        }),
      });
    },
    [navigate]
  );

  const setSelectedIcon = useCallback(
    (icon, iconParentId) => {
      if (!icon || !iconParentId) return;
      navigate({
        pathname: "/testing",
        search: createSearchParamsString({ tester: "IconFamilyV8", iconParentId, iconId: icon.uniqueId }),
      });
    },
    [navigate]
  );

  const handleNavigation = useCallback(
    (increment = 0, iconParentId = "") => {
      if (!next || !prev || !iconParentId) {
        console.error(`Invalid next : '${next}', or prev : ${prev}`);
        return;
      }
      if (next && increment === 1) {
        setSelectedIcon(next, iconParentId);
      }
      if (prev && increment === -1) {
        setSelectedIcon(prev, iconParentId);
      }
    },
    [next, prev, setSelectedIcon]
  );

  if (!iconParentId) {
    return <IconFamilyList />;
  }

  return (
    <div className="flex flex-col h-[70vh]">
      {
        <IconFamilyListPopup
          isOpen={shouldShowIconFamilyPopup === "yes"}
          onClose={() => showIconFamilyPopup(false, selectedIcon, iconParentId)}
          showCloseButton
        />
      }
      {/* Header Section */}
      <header className="h-[5vh] bg-blue-500 flex items-center justify-center text-white">
        <button
          title="Change Icon Family"
          onClick={() => showIconFamilyPopup(true, selectedIcon, iconParentId)}
        >
          {shouldShowIconFamilyPopup === "yes" ? <PopupCloseIcon /> : <PopupOpenIcon />}
        </button>
        <div className="text-xl font-semibold">
          Selected Parent: {iconParents.find(({ id }) => id === iconParentId)?.name || "None"}, Selected Icon:{" "}
          {selectedIcon?.name || "None"}
        </div>
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
                  onNodeSelection={(node) => setSelectedIcon(node, iconParentId)}
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
                  onClick={() => handleNavigation(-1, iconParentId)}
                  disabled={!prev}
                >
                  Prev
                </button>
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                  onClick={() => handleNavigation(1, iconParentId)}
                  disabled={!next}
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
            {/* <ul>
              {Array.from({ length: 100 }, (_, i) => (
                <li key={i} className="py-1 border-b">
                  Item {i + 1}
                  <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis
                    euismod semper. Fusce dapibus, tellus ac cursus commodo.
                  </p>
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconFamilyV8;
