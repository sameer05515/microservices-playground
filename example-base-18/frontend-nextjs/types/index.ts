export interface Directory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  createdAt: string;
  updatedAt?: string;
  subDirectoryCount: number;
  topicCount: number;
  children?: Directory[];
  path?: string;
}

export interface Topic {
  id: string;
  title: string;
  content?: string;
  directoryId: string;
  directoryName?: string;
  path?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DirectoryRequest {
  name: string;
  description?: string;
  parentId?: string;
}

export interface TopicRequest {
  title: string;
  content?: string;
  directoryId: string;
}

export interface UpdateDirectoryRequest {
  name: string;
  description?: string;
}

export interface UpdateTopicRequest {
  title: string;
  content?: string;
}

export interface Question {
  id: string;
  questionText: string;
  description?: string;
  answer?: string;
  tags?: string[];
  directoryId?: string;
  directoryName?: string;
  topicId?: string;
  topicName?: string;
  parentType: 'directory' | 'topic';
  parentId: string;
  parentName?: string;
  path?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface QuestionRequest {
  questionText: string;
  description?: string;
  answer?: string;
  tags?: string[];
  parentId: string;
  parentType: 'directory' | 'topic';
}

export interface UpdateQuestionRequest {
  questionText: string;
  description?: string;
  answer?: string;
  tags?: string[];
}

export interface SearchResponse {
  directories: Directory[];
  topics: Topic[];
  questions: Question[];
}

