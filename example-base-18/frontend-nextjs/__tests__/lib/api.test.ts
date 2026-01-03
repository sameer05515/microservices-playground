import axios from 'axios';
import { directoryApi, topicApi, questionApi, searchApi } from '@/lib/api';
import type { Directory, Topic, Question } from '@/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('directoryApi', () => {
    it('creates directory', async () => {
      const mockResponse = { data: { id: 'dir1', name: 'Test Directory' } };
      mockedAxios.create = jest.fn(() => ({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      })) as any;

      const result = await directoryApi.create({
        name: 'Test Directory',
        description: 'Test',
      });

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('topicApi', () => {
    it('creates topic', async () => {
      const mockResponse = { data: { id: 'topic1', title: 'Test Topic' } };
      mockedAxios.create = jest.fn(() => ({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      })) as any;

      const result = await topicApi.create({
        title: 'Test Topic',
        directoryId: 'dir1',
      });

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('questionApi', () => {
    it('creates question', async () => {
      const mockResponse = {
        data: {
          id: 'q1',
          questionText: 'What is this?',
          parentType: 'directory',
        },
      };
      mockedAxios.create = jest.fn(() => ({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      })) as any;

      const result = await questionApi.create({
        questionText: 'What is this?',
        parentId: 'dir1',
        parentType: 'directory',
      });

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('searchApi', () => {
    it('searches all', async () => {
      const mockResponse = {
        data: {
          directories: [],
          topics: [],
          questions: [],
        },
      };
      mockedAxios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue(mockResponse),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      })) as any;

      const result = await searchApi.search('test');

      expect(result).toEqual(mockResponse.data);
    });
  });
});

