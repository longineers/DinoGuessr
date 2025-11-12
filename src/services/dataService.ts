import { QuizData, Difficulty, DinosaurQuestion } from '../types';
import dinosaurs from '../assets/dinosaurs.json';

const dinoNames = dinosaurs.map(dino => dino.name);

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const fetchDinosaurQuiz = async (difficulty: Difficulty): Promise<QuizData> => {
  const optionsMap = {
    easy: 2,
    medium: 3,
    hard: 4,
  };
  const numOptions = optionsMap[difficulty];

  const questionsMap = {
    easy: 5,
    medium: 7,
    hard: 10,
  };
  const totalQuestions = questionsMap[difficulty];

  const selectedDinos = shuffleArray(dinoNames).slice(0, totalQuestions);

  const hints: { [key: string]: string } = {};
  try {
    const response = await fetch('https://dinosaur-facts-api.shultzlab.com/dinosaurs');
    const data = await response.json();
    data.forEach((dino: { Name: string; Description: string }) => {
      hints[dino.Name] = dino.Description;
    });
  } catch (error) {
    console.error("Error fetching hints from API, using fallback hints:", error);
  }

  const questions: DinosaurQuestion[] = selectedDinos.map(correctDinoName => {
    const wrongAnswers = dinoNames.filter(name => name !== correctDinoName);
    const options = [correctDinoName, ...shuffleArray(wrongAnswers).slice(0, numOptions - 1)];
    const dinoData = dinosaurs.find(dino => dino.name === correctDinoName);

    return {
      correctAnswer: correctDinoName,
      options: shuffleArray(options),
      imageUrl: dinoData ? dinoData.image : '',
      hint: hints[correctDinoName] || `This is a hint about ${correctDinoName}`
    }
  });

  return { questions };
};