import { GoogleGenAI, Type } from '@google/genai';
import { QuizData, Difficulty, DinosaurQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to shuffle an array (Fisher-Yates algorithm)
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
  const totalQuestions = 7;

  const schema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            correctAnswer: {
              type: Type.STRING,
              description: "The correct name of the dinosaur."
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `An array of ${numOptions} possible dinosaur names, including the correct one.`
            },
            funFact: {
              type: Type.STRING,
              description: "A short, interesting fun fact about the dinosaur."
            },
            imageUrl: {
              type: Type.STRING,
              description: "A direct, publicly accessible URL to a high-quality image of the dinosaur. Prioritize sources like Wikipedia or Wikimedia Commons."
            },
            hint: {
              type: Type.STRING,
              description: "A short, helpful clue about the dinosaur that doesn't give away the answer directly."
            }
          },
          required: ["correctAnswer", "options", "funFact", "imageUrl", "hint"]
        }
      }
    },
    required: ["questions"]
  };

  const prompt = `
    Generate a list of ${totalQuestions} dinosaur quiz questions for a game.
    The difficulty is '${difficulty}'.
    Each question must have exactly ${numOptions} multiple-choice options. One option must be the correct dinosaur name, and the others should be plausible but incorrect dinosaur names.
    For each dinosaur, provide a short, engaging fun fact, a direct, publicly accessible URL to a high-quality image of the dinosaur, AND a helpful hint. The hint should be a clue that guides the player to the correct answer without being too obvious.
    Prioritize images from reliable sources like Wikipedia or Wikimedia Commons.
    The list of options for each question should be randomized.
    Provide the output in JSON format according to the provided schema. Do not include any markdown formatting.
    Only include well-known dinosaurs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);

    if (!data.questions || data.questions.length !== totalQuestions) {
        throw new Error("Invalid data structure received from API");
    }

    return data as QuizData;

  } catch (error) {
    console.error("Error fetching quiz data from Gemini:", error);
    // Fallback data in case of API error
    const fallbackDinos = [
        { name: "Tyrannosaurus Rex", description: "Tyrannosaurus Rex had a bite force powerful enough to crush a car.", imageUrl: "https://loremflickr.com/512/512/dinosaur,tyrannosaurus%20rex?lock=1", hint: "This famous carnivore is often called the 'king' of the dinosaurs." },
        { name: "Velociraptor", description: "Despite what movies show, Velociraptors were about the size of a turkey and had feathers.", imageUrl: "https://loremflickr.com/512/512/dinosaur,velociraptor?lock=2", hint: "Known for being a swift and clever hunter, its name means 'swift seizer'." },
        { name: "Stegosaurus", description: "The plates on a Stegosaurus's back may have been used to regulate its body temperature.", imageUrl: "https://loremflickr.com/512/512/dinosaur,stegosaurus?lock=3", hint: "This herbivore is famous for the large, bony plates on its back." },
        { name: "Triceratops", description: "Triceratops had three horns on its face, which it likely used for defense against predators.", imageUrl: "https://loremflickr.com/512/512/dinosaur,triceratops?lock=4", hint: "Its name literally means 'three-horned face'." },
        { name: "Brachiosaurus", description: "Brachiosaurus was one of the tallest dinosaurs, with its long neck allowing it to eat from tall trees.", imageUrl: "https://loremflickr.com/512/512/dinosaur,brachiosaurus?lock=5", hint: "This long-necked giant had front legs that were longer than its back legs." },
        { name: "Ankylosaurus", description: "Ankylosaurus was a heavily armored dinosaur with a large club on the end of its tail.", imageUrl: "https://loremflickr.com/512/512/dinosaur,ankylosaurus?lock=6", hint: "Often described as a 'living tank', it had a powerful club on its tail." },
        { name: "Spinosaurus", description: "Spinosaurus is the largest known carnivorous dinosaur, even bigger than T-Rex, and is believed to have been semi-aquatic.", imageUrl: "https://loremflickr.com/512/512/dinosaur,spinosaurus?lock=7", hint: "This massive predator is unique for the large sail-like fin on its back." },
    ];
    
    const shuffledFallbackDinos = shuffleArray(fallbackDinos);
    const fallbackAllNames = fallbackDinos.map(d => d.name);

    const questions: DinosaurQuestion[] = shuffledFallbackDinos.slice(0, totalQuestions).map(correctDino => {
        const wrongAnswers = fallbackAllNames.filter(name => name !== correctDino.name);
        const options = [correctDino.name, ...shuffleArray(wrongAnswers).slice(0, numOptions - 1)];
        return {
            correctAnswer: correctDino.name,
            options: shuffleArray(options),
            funFact: correctDino.description,
            imageUrl: correctDino.imageUrl,
            hint: correctDino.hint
        }
    });

    return { questions };
  }
};
