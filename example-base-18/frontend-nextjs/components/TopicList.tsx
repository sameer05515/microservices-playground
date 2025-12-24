'use client';

import { useState } from 'react';
import type { Topic } from '@/types';
import MarkdownRenderer from './MarkdownRenderer';

interface TopicListProps {
  topics: Topic[];
  onEdit?: (topic: Topic) => void;
  onDelete?: (topic: Topic) => void;
}

export default function TopicList({ topics, onEdit, onDelete }: TopicListProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  if (topics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No topics in this directory
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">📄</span>
                <h3 className="font-semibold">{topic.title}</h3>
              </div>
              {topic.content && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <MarkdownRenderer content={topic.content} />
                </div>
              )}
              {topic.path && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Path: {topic.path}
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Created: {new Date(topic.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(topic)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  title="Edit"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <>
                  <button
                    onClick={() => setShowConfirmDelete(topic.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete"
                  >
                    🗑️
                  </button>
                  {showConfirmDelete === topic.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
                        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                        <p className="mb-4">
                          Are you sure you want to delete &quot;{topic.title}&quot;?
                        </p>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setShowConfirmDelete(null)}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              onDelete(topic);
                              setShowConfirmDelete(null);
                            }}
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
        </div>
      ))}
    </div>
  );
}

