export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DinosaurQuestion {
  correctAnswer: string;
  options: string[];
  imageUrl: string;
  hint: string;
}

export interface QuizData {
  questions: DinosaurQuestion[];
}
