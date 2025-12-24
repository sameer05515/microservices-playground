'use client';

import { useState } from 'react';
import type { Question } from '@/types';

interface QuestionListProps {
  questions: Question[];
  onEdit?: (question: Question) => void;
  onDelete?: (question: Question) => void;
}

export default function QuestionList({ questions, onEdit, onDelete }: QuestionListProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());

  const toggleAnswer = (questionId: string) => {
    const newExpanded = new Set(expandedAnswers);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedAnswers(newExpanded);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No questions in this node
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <div
          key={question.id}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">❓</span>
                <h3 className="font-semibold text-lg">{question.questionText}</h3>
              </div>
              
              {question.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-2">
                  {question.description}
                </p>
              )}

              {question.answer && (
                <div className="mt-3">
                  <button
                    onClick={() => toggleAnswer(question.id)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2"
                  >
                    {expandedAnswers.has(question.id) ? '▼ Hide Answer' : '▶ Show Answer'}
                  </button>
                  {expandedAnswers.has(question.id) && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">✓ Answer:</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {question.answer}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {question.path && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Path: {question.path}
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Created: {new Date(question.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(question)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  title="Edit"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <>
                  <button
                    onClick={() => setShowConfirmDelete(question.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete"
                  >
                    🗑️
                  </button>
                  {showConfirmDelete === question.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
                        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                        <p className="mb-4">
                          Are you sure you want to delete this question?
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
                              onDelete(question);
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

