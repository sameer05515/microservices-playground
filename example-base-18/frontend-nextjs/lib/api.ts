import axios from 'axios';
import type { Directory, Topic, Question, DirectoryRequest, TopicRequest, UpdateDirectoryRequest, UpdateTopicRequest, QuestionRequest, UpdateQuestionRequest, SearchResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Directory API
export const directoryApi = {
  create: async (data: DirectoryRequest): Promise<Directory> => {
    const response = await api.post<Directory>('/directories', data);
    return response.data;
  },

  getById: async (id: string): Promise<Directory> => {
    const response = await api.get<Directory>(`/directories/${id}`);
    return response.data;
  },

  getRoots: async (): Promise<Directory[]> => {
    const response = await api.get<Directory[]>('/directories/roots');
    return response.data;
  },

  getChildren: async (parentId: string): Promise<Directory[]> => {
    const response = await api.get<Directory[]>(`/directories/${parentId}/children`);
    return response.data;
  },

  getHierarchy: async (id: string): Promise<Directory> => {
    const response = await api.get<Directory>(`/directories/${id}/hierarchy`);
    return response.data;
  },

  getFullHierarchy: async (): Promise<Directory[]> => {
    const response = await api.get<Directory[]>('/directories/hierarchy/all');
    return response.data;
  },

  update: async (id: string, data: UpdateDirectoryRequest): Promise<Directory> => {
    const response = await api.put<Directory>(`/directories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/directories/${id}`);
  },
};

// Topic API
export const topicApi = {
  create: async (data: TopicRequest): Promise<Topic> => {
    const response = await api.post<Topic>('/topics', data);
    return response.data;
  },

  getById: async (id: string): Promise<Topic> => {
    const response = await api.get<Topic>(`/topics/${id}`);
    return response.data;
  },

  getByDirectory: async (directoryId: string): Promise<Topic[]> => {
    const response = await api.get<Topic[]>(`/topics/directory/${directoryId}`);
    return response.data;
  },

  update: async (id: string, data: UpdateTopicRequest): Promise<Topic> => {
    const response = await api.put<Topic>(`/topics/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/topics/${id}`);
  },
};

// Search API
export const searchApi = {
  search: async (query: string): Promise<SearchResponse> => {
    const response = await api.get<SearchResponse>('/search', { params: { q: query } });
    return response.data;
  },
};

// Question API
export const questionApi = {
  create: async (data: QuestionRequest): Promise<Question> => {
    const response = await api.post<Question>('/questions', data);
    return response.data;
  },

  getById: async (id: string): Promise<Question> => {
    const response = await api.get<Question>(`/questions/${id}`);
    return response.data;
  },

  getByDirectory: async (directoryId: string): Promise<Question[]> => {
    const response = await api.get<Question[]>(`/questions/directory/${directoryId}`);
    return response.data;
  },

  getByTopic: async (topicId: string): Promise<Question[]> => {
    const response = await api.get<Question[]>(`/questions/topic/${topicId}`);
    return response.data;
  },

  getByParent: async (parentId: string): Promise<Question[]> => {
    const response = await api.get<Question[]>(`/questions/parent/${parentId}`);
    return response.data;
  },

  update: async (id: string, data: UpdateQuestionRequest): Promise<Question> => {
    const response = await api.put<Question>(`/questions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/questions/${id}`);
  },
};

// Health API
export const healthApi = {
  check: async (): Promise<{ status: string; service: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

