import { render, screen, fireEvent } from '@testing-library/react';
import QuestionList from '@/components/QuestionList';
import type { Question } from '@/types';

describe('QuestionList', () => {
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      questionText: 'What is this?',
      description: 'Test description',
      answer: 'This is a test answer',
      parentId: 'dir1',
      parentType: 'directory',
      createdAt: '2024-01-01T00:00:00Z',
      tags: ['test', 'example'],
    },
    {
      id: 'q2',
      questionText: 'How does it work?',
      parentId: 'dir1',
      parentType: 'directory',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  it('renders empty state when no questions', () => {
    render(<QuestionList questions={[]} />);
    expect(screen.getByText('No questions in this node')).toBeInTheDocument();
  });

  it('renders list of questions', () => {
    render(<QuestionList questions={mockQuestions} />);
    expect(screen.getByText('What is this?')).toBeInTheDocument();
    expect(screen.getByText('How does it work?')).toBeInTheDocument();
  });

  it('shows answer when expand button is clicked', () => {
    render(<QuestionList questions={[mockQuestions[0]]} />);
    
    const expandButton = screen.getByText('▶ Show Answer');
    fireEvent.click(expandButton);
    
    expect(screen.getByText('This is a test answer')).toBeInTheDocument();
    expect(screen.getByText('▼ Hide Answer')).toBeInTheDocument();
  });

  it('displays tags', () => {
    render(<QuestionList questions={[mockQuestions[0]]} />);
    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#example')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<QuestionList questions={[mockQuestions[0]]} onEdit={onEdit} />);
    
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    
    expect(onEdit).toHaveBeenCalledWith(mockQuestions[0]);
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    const onDelete = jest.fn();
    render(<QuestionList questions={[mockQuestions[0]]} onDelete={onDelete} />);
    
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    expect(onDelete).toHaveBeenCalledWith(mockQuestions[0]);
  });
});

