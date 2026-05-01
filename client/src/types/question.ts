export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}
