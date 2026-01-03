import { render, screen, fireEvent } from '@testing-library/react';
import DirectoryTree from '@/components/DirectoryTree';
import type { Directory } from '@/types';

describe('DirectoryTree', () => {
  const mockDirectory: Directory = {
    id: 'dir1',
    name: 'Test Directory',
    description: 'Test Description',
    subDirectoryCount: 2,
    topicCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    children: [],
  };

  it('renders directory name', () => {
    render(<DirectoryTree directory={mockDirectory} />);
    expect(screen.getByText('Test Directory')).toBeInTheDocument();
  });

  it('calls onSelect when directory is clicked', () => {
    const onSelect = jest.fn();
    render(<DirectoryTree directory={mockDirectory} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Test Directory'));
    expect(onSelect).toHaveBeenCalledWith(mockDirectory);
  });

  it('shows expand/collapse button for directories with children', () => {
    const directoryWithChildren: Directory = {
      ...mockDirectory,
      children: [
        {
          id: 'dir2',
          name: 'Child Directory',
          subDirectoryCount: 0,
          topicCount: 0,
          createdAt: '2024-01-01T00:00:00Z',
        },
      ],
    };

    render(<DirectoryTree directory={directoryWithChildren} />);
    expect(screen.getByText('▶')).toBeInTheDocument();
  });

  it('calls onAddSubDirectory when +Dir button is clicked', () => {
    const onAddSubDirectory = jest.fn();
    render(
      <DirectoryTree
        directory={mockDirectory}
        onAddSubDirectory={onAddSubDirectory}
      />
    );

    const addDirButton = screen.getByTitle('Add Sub-Directory');
    fireEvent.click(addDirButton);
    expect(onAddSubDirectory).toHaveBeenCalledWith('dir1');
  });

  it('calls onAddTopic when +Topic button is clicked', () => {
    const onAddTopic = jest.fn();
    render(
      <DirectoryTree
        directory={mockDirectory}
        onAddTopic={onAddTopic}
      />
    );

    const addTopicButton = screen.getByTitle('Add Topic');
    fireEvent.click(addTopicButton);
    expect(onAddTopic).toHaveBeenCalledWith('dir1');
  });

  it('calls onAddQuestion when +Q button is clicked', () => {
    const onAddQuestion = jest.fn();
    render(
      <DirectoryTree
        directory={mockDirectory}
        onAddQuestion={onAddQuestion}
      />
    );

    const addQuestionButton = screen.getByTitle('Add Question');
    fireEvent.click(addQuestionButton);
    expect(onAddQuestion).toHaveBeenCalledWith('dir1', 'directory');
  });
});

