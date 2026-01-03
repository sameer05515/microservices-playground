'use client';

import { useState } from 'react';
import type { Directory } from '@/types';

interface DirectoryTreeProps {
  directory: Directory;
  level?: number;
  onSelect?: (directory: Directory) => void;
  onEdit?: (directory: Directory) => void;
  onDelete?: (directory: Directory) => void;
  onAddSubDirectory?: (parentId: string) => void;
  onAddTopic?: (directoryId: string) => void;
  onAddQuestion?: (parentId: string, parentType: 'directory' | 'topic') => void;
  selectedId?: string;
}

export default function DirectoryTree({
  directory,
  level = 0,
  onSelect,
  onEdit,
  onDelete,
  onAddSubDirectory,
  onAddTopic,
  onAddQuestion,
  selectedId,
}: DirectoryTreeProps) {
  const [expanded, setExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const hasChildren = directory.children && directory.children.length > 0;
  const isSelected = selectedId === directory.id;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(directory);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
          ${isSelected ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
        `}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        {/* Directory Icon & Name */}
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => onSelect?.(directory)}
        >
          <span className="text-lg">📁</span>
          <div className="flex-1">
            <div className="font-medium">{directory.name}</div>
            {directory.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {directory.description}
              </div>
            )}
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {directory.subDirectoryCount} sub-dirs • {directory.topicCount} topics
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {onAddSubDirectory && (
            <button
              onClick={() => onAddSubDirectory(directory.id)}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              title="Add Sub-Directory"
            >
              +Dir
            </button>
          )}
          {onAddTopic && (
            <button
              onClick={() => onAddTopic(directory.id)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Add Topic"
            >
              +Topic
            </button>
          )}
          {onAddQuestion && (
            <button
              onClick={() => onAddQuestion(directory.id, 'directory')}
              className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
              title="Add Question"
            >
              +Q
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(directory)}
              className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              title="Edit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <>
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                title="Delete"
              >
                🗑️
              </button>
              {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
                    <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                    <p className="mb-4">
                      Are you sure you want to delete &quot;{directory.name}&quot;?
                      This will also delete all sub-directories and topics.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowConfirmDelete(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {directory.children!.map((child) => (
            <DirectoryTree
              key={child.id}
              directory={child}
              level={level + 1}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubDirectory={onAddSubDirectory}
              onAddTopic={onAddTopic}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

