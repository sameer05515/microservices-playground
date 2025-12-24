'use client';

import { useState, useEffect } from 'react';
import { directoryApi, topicApi } from '@/lib/api';
import type { Directory, Topic, DirectoryRequest, TopicRequest, UpdateDirectoryRequest, UpdateTopicRequest, SearchResponse } from '@/types';
import DirectoryTree from '@/components/DirectoryTree';
import TopicList from '@/components/TopicList';
import DirectoryForm from '@/components/DirectoryForm';
import TopicForm from '@/components/TopicForm';
import SearchBar from '@/components/SearchBar';
import Modal from '@/components/Modal';

export default function DirectoriesPage() {
  const [hierarchy, setHierarchy] = useState<Directory[]>([]);
  const [selectedDirectory, setSelectedDirectory] = useState<Directory | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showDirectoryForm, setShowDirectoryForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingDirectory, setEditingDirectory] = useState<Directory | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [parentIdForNew, setParentIdForNew] = useState<string | undefined>();
  const [directoryIdForNewTopic, setDirectoryIdForNewTopic] = useState<string | undefined>();

  // Search state
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    loadHierarchy();
  }, []);

  useEffect(() => {
    if (selectedDirectory) {
      loadTopics(selectedDirectory.id);
    } else {
      setTopics([]);
    }
  }, [selectedDirectory]);

  const loadHierarchy = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await directoryApi.getFullHierarchy();
      setHierarchy(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load directories');
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (directoryId: string) => {
    try {
      const data = await topicApi.getByDirectory(directoryId);
      setTopics(data);
    } catch (err: any) {
      console.error('Failed to load topics:', err);
    }
  };

  const handleCreateDirectory = async (data: DirectoryRequest) => {
    try {
      await directoryApi.create(data);
      setSuccess('Directory created successfully');
      setShowDirectoryForm(false);
      setParentIdForNew(undefined);
      await loadHierarchy();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      throw err;
    }
  };

  const handleUpdateDirectory = async (data: DirectoryRequest) => {
    if (!editingDirectory) return;
    try {
      await directoryApi.update(editingDirectory.id, data as UpdateDirectoryRequest);
      setSuccess('Directory updated successfully');
      setShowDirectoryForm(false);
      setEditingDirectory(null);
      await loadHierarchy();
      if (selectedDirectory?.id === editingDirectory.id) {
        const updated = await directoryApi.getById(editingDirectory.id);
        setSelectedDirectory(updated);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteDirectory = async (directory: Directory) => {
    try {
      await directoryApi.delete(directory.id);
      setSuccess('Directory deleted successfully');
      if (selectedDirectory?.id === directory.id) {
        setSelectedDirectory(null);
      }
      await loadHierarchy();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete directory');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCreateTopic = async (data: TopicRequest) => {
    try {
      await topicApi.create(data);
      setSuccess('Topic created successfully');
      setShowTopicForm(false);
      setDirectoryIdForNewTopic(undefined);
      if (selectedDirectory) {
        await loadTopics(selectedDirectory.id);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      throw err;
    }
  };

  const handleUpdateTopic = async (data: TopicRequest) => {
    if (!editingTopic) return;
    try {
      await topicApi.update(editingTopic.id, data as UpdateTopicRequest);
      setSuccess('Topic updated successfully');
      setShowTopicForm(false);
      setEditingTopic(null);
      if (selectedDirectory) {
        await loadTopics(selectedDirectory.id);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteTopic = async (topic: Topic) => {
    try {
      await topicApi.delete(topic.id);
      setSuccess('Topic deleted successfully');
      if (selectedDirectory) {
        await loadTopics(selectedDirectory.id);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete topic');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSearchResults = (results: SearchResponse) => {
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const openDirectoryForm = (parentId?: string) => {
    setParentIdForNew(parentId);
    setEditingDirectory(null);
    setShowDirectoryForm(true);
  };

  const openEditDirectoryForm = (directory: Directory) => {
    setEditingDirectory(directory);
    setParentIdForNew(undefined);
    setShowDirectoryForm(true);
  };

  const openTopicForm = (directoryId: string) => {
    setDirectoryIdForNewTopic(directoryId);
    setEditingTopic(null);
    setShowTopicForm(true);
  };

  const openEditTopicForm = (topic: Topic) => {
    setEditingTopic(topic);
    setDirectoryIdForNewTopic(undefined);
    setShowTopicForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Directory & Topic Management</h1>
            <button
              onClick={() => openDirectoryForm()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              + New Root Directory
            </button>
          </div>
          <SearchBar onResults={handleSearchResults} />
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        </div>
      )}
      {success && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">
            {success}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : showSearchResults && searchResults ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Search Results</h2>
              <button
                onClick={() => {
                  setShowSearchResults(false);
                  setSearchResults(null);
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
              >
                Back to Hierarchy
              </button>
            </div>

            {searchResults.directories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Directories ({searchResults.directories.length})</h3>
                <div className="space-y-2">
                  {searchResults.directories.map((dir) => (
                    <div
                      key={dir.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        setSelectedDirectory(dir);
                        setShowSearchResults(false);
                      }}
                    >
                      <div className="font-medium">📁 {dir.name}</div>
                      {dir.path && <div className="text-sm text-gray-500">Path: {dir.path}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.topics.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Topics ({searchResults.topics.length})</h3>
                <TopicList
                  topics={searchResults.topics}
                  onEdit={openEditTopicForm}
                  onDelete={handleDeleteTopic}
                />
              </div>
            )}

            {searchResults.directories.length === 0 && searchResults.topics.length === 0 && (
              <div className="text-center py-8 text-gray-500">No results found</div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Directory Tree */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Directory Hierarchy</h2>
              {hierarchy.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No directories yet. Create a root directory to get started.
                </div>
              ) : (
                <div className="space-y-1">
                  {hierarchy.map((dir) => (
                    <DirectoryTree
                      key={dir.id}
                      directory={dir}
                      onSelect={setSelectedDirectory}
                      onEdit={openEditDirectoryForm}
                      onDelete={handleDeleteDirectory}
                      onAddSubDirectory={openDirectoryForm}
                      onAddTopic={openTopicForm}
                      selectedId={selectedDirectory?.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Selected Directory & Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              {selectedDirectory ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">📁 {selectedDirectory.name}</h2>
                    {selectedDirectory.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {selectedDirectory.description}
                      </p>
                    )}
                    <div className="text-sm text-gray-500">
                      {selectedDirectory.subDirectoryCount} sub-directories • {selectedDirectory.topicCount} topics
                    </div>
                    {selectedDirectory.path && (
                      <div className="text-xs text-gray-400 mt-1">Path: {selectedDirectory.path}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <button
                      onClick={() => openTopicForm(selectedDirectory.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      + Add Topic
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Topics</h3>
                    <TopicList
                      topics={topics}
                      onEdit={openEditTopicForm}
                      onDelete={handleDeleteTopic}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Select a directory to view its topics
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showDirectoryForm}
        onClose={() => {
          setShowDirectoryForm(false);
          setEditingDirectory(null);
          setParentIdForNew(undefined);
        }}
        title={editingDirectory ? 'Edit Directory' : 'Create Directory'}
      >
        <DirectoryForm
          directory={editingDirectory || undefined}
          parentId={parentIdForNew}
          onSubmit={editingDirectory ? handleUpdateDirectory : handleCreateDirectory}
          onCancel={() => {
            setShowDirectoryForm(false);
            setEditingDirectory(null);
            setParentIdForNew(undefined);
          }}
        />
      </Modal>

      <Modal
        isOpen={showTopicForm}
        onClose={() => {
          setShowTopicForm(false);
          setEditingTopic(null);
          setDirectoryIdForNewTopic(undefined);
        }}
        title={editingTopic ? 'Edit Topic' : 'Create Topic'}
      >
        <TopicForm
          topic={editingTopic || undefined}
          directoryId={directoryIdForNewTopic}
          onSubmit={editingTopic ? handleUpdateTopic : handleCreateTopic}
          onCancel={() => {
            setShowTopicForm(false);
            setEditingTopic(null);
            setDirectoryIdForNewTopic(undefined);
          }}
        />
      </Modal>
    </div>
  );
}

