import React, { useEffect, useState, useRef } from "react";

const debug = true;

const GroupedSectionView = ({ groupedData, onItemClick }) => {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef({}); // To track references for each type

  useEffect(() => {
    console.log("visibleSections",visibleSections)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const type = entry.target.getAttribute("data-type");
            if (!visibleSections.includes(type)) {
              setVisibleSections((prev) => [...prev, type]);
            }
          }
        });
      },
      { threshold: 0.80 } // Trigger when 80% of the section is visible
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleSections]);

  return (
    <div>
      {debug && <pre>{JSON.stringify(visibleSections)}</pre>}
      {groupedData.map(({ type, items }) => (
        <div
          key={type}
          data-type={type}
          ref={(ref) => (sectionRefs.current[type] = ref)}
          style={{ minHeight: "100px", margin: "20px 0" }}
        >
          {visibleSections.includes(type) && (
            <div>
              <h3>{type}</h3>
              <ul>
                {items.map(({ name, uniqueId }) => (
                  <li key={uniqueId}>
                    <button
                      onClick={() => onItemClick({ uniqueId, type })}
                      style={{
                        background: "none",
                        border: "none",
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupedSectionView;
