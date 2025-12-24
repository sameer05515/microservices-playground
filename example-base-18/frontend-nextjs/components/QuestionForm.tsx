'use client';

import { useState, useEffect } from 'react';
import type { Question, QuestionRequest } from '@/types';

interface QuestionFormProps {
  question?: Question;
  parentId?: string;
  parentType?: 'directory' | 'topic';
  onSubmit: (data: QuestionRequest) => Promise<void>;
  onCancel: () => void;
}

export default function QuestionForm({ question, parentId, parentType, onSubmit, onCancel }: QuestionFormProps) {
  const [questionText, setQuestionText] = useState('');
  const [description, setDescription] = useState('');
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (question) {
      setQuestionText(question.questionText);
      setDescription(question.description || '');
      setAnswer(question.answer || '');
      setTags(question.tags ? question.tags.join(', ') : '');
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const data: QuestionRequest = {
        questionText: questionText.trim(),
        description: description.trim() || undefined,
        answer: answer.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        parentId: question ? question.parentId : (parentId!),
        parentType: question ? question.parentType : (parentType!),
      };
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="questionText" className="block text-sm font-medium mb-1">
          Question <span className="text-red-500">*</span>
        </label>
        <input
          id="questionText"
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          placeholder="Enter your question"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          placeholder="Optional description or context"
        />
      </div>

      <div>
        <label htmlFor="answer" className="block text-sm font-medium mb-1">
          Answer
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          placeholder="Optional answer to the question"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags <span className="text-gray-500 text-xs">(comma-separated)</span>
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : question ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

