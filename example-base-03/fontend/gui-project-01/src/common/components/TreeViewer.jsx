import React, { useState, useCallback, useMemo, useEffect } from "react";
// import JSONDataViewer from "../json-data-viewer/JSONDataViewer";

const styles = {
  container: {
    paddingLeft: "20px",
    margin: "5px 0",
    borderLeft: "1px solid #ccc",
  },
  node: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },
  toggleButton: {
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "bold",
    color: "green",
  },
  nodeName: {
    fontSize: "14px",
    color: "#333",
  },
};

const TreeNode = ({
  node,
  renderNode,
  uniqueIdFieldName,
  selectedNodeId,
  expandAll,
  isDraggable = false,
  onDragStart = () => { },
  onDrop = () => { },
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const checkIfIdOfNodeOrItsOneOfTheChildren = (id, currentNode) => {
    if (!id) return false;
    if (id === currentNode[uniqueIdFieldName]) return true;
    if (currentNode.children && currentNode.children.length > 0) {
      return currentNode.children.some((child) =>
        checkIfIdOfNodeOrItsOneOfTheChildren(id, child)
      );
    }
    return false;
  };

  const shouldExpand = useMemo(() => {
    return (
      checkIfIdOfNodeOrItsOneOfTheChildren(selectedNodeId, node) || expandAll
    );
  }, [selectedNodeId, node, expandAll]);

  useEffect(() => {
    if (shouldExpand) {
      setExpanded(true);
    }
  }, [shouldExpand]);

  const toggleExpand = useCallback(() => {
    setExpanded((prevExpanded) => !prevExpanded);
  }, []);

  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart && onDragStart(node);
      }}
      onDrop={(e) => {
        e.stopPropagation();
        onDrop(node);
      }}
      onDragOver={(e) => e.preventDefault()} // Needed to allow drop
      style={styles.container}
    >
      <div style={styles.node}>
        <span style={styles.toggleButton} onClick={toggleExpand}>
          {hasChildren ? (expanded ? "v" : ">") : "*"}
        </span>
        {renderNode ? (
          renderNode(node)
        ) : (
          <DefaultNodeComponent
            node={node}
            uniqueIdFieldName={uniqueIdFieldName}
          />
        )}
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child[uniqueIdFieldName]}
              node={child}
              renderNode={renderNode}
              uniqueIdFieldName={uniqueIdFieldName}
              selectedNodeId={selectedNodeId}
              isDraggable={isDraggable}
              onDragStart={onDragStart}
              onDrop={onDrop}
            // expandAll={expandAll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DefaultNodeComponent = ({ node, uniqueIdFieldName }) => (
  <span style={styles.nodeName}>
    {/* <b></b> */}
    {node.name || node[uniqueIdFieldName]}
  </span>
);

const Tree = ({
  data,
  renderNode,
  uniqueIdFieldName = "uniqueId",
  selectedNodeId = "",
  expandAll = false,
  areNodesDraggable = false,
  onDragStart,
  onDrop
}) => {
  return (
    <div>
      {data.map((node) => (
        <TreeNode
          key={node[uniqueIdFieldName]}
          node={node}
          renderNode={renderNode}
          uniqueIdFieldName={uniqueIdFieldName}
          selectedNodeId={selectedNodeId}
          expandAll={expandAll}
          isDraggable={areNodesDraggable}
          onDragStart={onDragStart}
          onDrop={onDrop}
        />
      ))}
      {/* <JSONDataViewer metadata={{data}} title="Data"/> */}
    </div>
  );
};

export default Tree;
