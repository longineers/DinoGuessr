import { describe, it, expect } from 'vitest';
import { fetchDinosaurQuiz } from './dataService';

describe('fetchDinosaurQuiz', () => {
  it('should return a quiz with the correct number of questions for easy difficulty', async () => {
    const quiz = await fetchDinosaurQuiz('easy');
    expect(quiz.questions.length).toBe(5);
  });

  it('should return a quiz with the correct number of questions for medium difficulty', async () => {
    const quiz = await fetchDinosaurQuiz('medium');
    expect(quiz.questions.length).toBe(7);
  });

  it('should return a quiz with the correct number of questions for hard difficulty', async () => {
    const quiz = await fetchDinosaurQuiz('hard');
    expect(quiz.questions.length).toBe(10);
  });

  it('should return questions with the correct number of options for easy difficulty', async () => {
    const quiz = await fetchDinosaurQuiz('easy');
    quiz.questions.forEach(question => {
      expect(question.options.length).toBe(2);
    });
  });

  it('should return questions with the correct number of options for medium difficulty', async () => {
    const quiz = await fetchDinosaurQuiz('medium');
    quiz.questions.forEach(question => {
      expect(question.options.length).toBe(3);
    });
  });

  it('should return questions with the correct number of options for hard difficulty', async () => {
    const quiz = await fetchDinosaurQuiz('hard');
    quiz.questions.forEach(question => {
      expect(question.options.length).toBe(4);
    });
  });

  it('should ensure the correctAnswer is always one of the options', async () => {
    const quiz = await fetchDinosaurQuiz('medium');
    quiz.questions.forEach(question => {
      expect(question.options).toContain(question.correctAnswer);
    });
  });

  it('should have unique dinosaur names for each question', async () => {
    const quiz = await fetchDinosaurQuiz('hard');
    const correctAnswers = quiz.questions.map(q => q.correctAnswer);
    const uniqueAnswers = new Set(correctAnswers);
    expect(uniqueAnswers.size).toBe(quiz.questions.length);
  });

  it('should populate the hint property with a non-empty string', async () => {
    const quiz = await fetchDinosaurQuiz('easy');
    quiz.questions.forEach(question => {
      expect(question.hint).toBeDefined();
      expect(question.hint.length).toBeGreaterThan(0);
    });
  });
});