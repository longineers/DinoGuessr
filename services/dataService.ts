import { QuizData, Difficulty, DinosaurQuestion } from '../types';

const dinoImageMap: { [key: string]: string } = {
  "Tyrannosaurus Rex": "/assets/Tyrannosaurus Rex.jpg",
  "Velociraptor": "/assets/Velociraptor.jpg",
  "Stegosaurus": "/assets/Stegosaurus.jpg",
  "Triceratops": "/assets/Triceratops.jpg",
  "Brachiosaurus": "/assets/Brachiosaurus.jpg",
  "Ankylosaurus": "/assets/Ankylosaurus.jpg",
  "Spinosaurus": "/assets/Spinosaurus.jpg",
  "Allosaurus": "/assets/Allosaurus.jpg",
  "Apatosaurus": "/assets/Apatosaurus.jpg",
  "Diplodocus": "/assets/Diplodocus.jpg",
};

const dinoNames = Object.keys(dinoImageMap);

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
    return {
      correctAnswer: correctDinoName,
      options: shuffleArray(options),
      funFact: `This is a fun fact about ${correctDinoName}`,
      imageUrl: dinoImageMap[correctDinoName],
      hint: hints[correctDinoName] || `This is a hint about ${correctDinoName}`
    }
  });

  return { questions };
};