import { GoogleGenAI, Type } from '@google/genai';
import { QuizData, Difficulty, DinosaurQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// A hardcoded, reliable "local directory" of dinosaur images.
const dinoImageMap: { [key: string]: string } = {
  "Tyrannosaurus Rex": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/SUE_the_Trex_at_the_Field_Museum.jpg/1280px-SUE_the_Trex_at_the_Field_Museum.jpg",
  "Velociraptor": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Velociraptor_Restoration.png/1280px-Velociraptor_Restoration.png",
  "Stegosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Stegosaurus_stenops_restoration.jpg/1280px-Stegosaurus_stenops_restoration.jpg",
  "Triceratops": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Triceratops_Restoration_1.jpg/1280px-Triceratops_Restoration_1.jpg",
  "Brachiosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Brachiosaurus_altithorax_holotype_reconstruction.jpg/1024px-Brachiosaurus_altithorax_holotype_reconstruction.jpg",
  "Ankylosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Ankylosaurus_magniventris_reconstruction.jpg/1280px-Ankylosaurus_magniventris_reconstruction.jpg",
  "Spinosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Spinosaurus_aegyptiacus_reconstruction.jpg/1280px-Spinosaurus_aegyptiacus_reconstruction.jpg",
  "Allosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Allosaurus_Reconstruction.jpg/1280px-Allosaurus_Reconstruction.jpg",
  "Apatosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Apatosaurus_excelsus_reconstruction.jpg/1280px-Apatosaurus_excelsus_reconstruction.jpg",
  "Diplodocus": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Diplodocus_carnegii_by_durbed.jpg/1280px-Diplodocus_carnegii_by_durbed.jpg",
  "Pteranodon": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pteranodon_longiceps_reconstruction.jpg/1280px-Pteranodon_longiceps_reconstruction.jpg",
  "Parasaurolophus": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Parasaurolophus_NT.jpg/1280px-Parasaurolophus_NT.jpg",
  "Iguanodon": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Iguanodon_bernissartensis_Reconstruction_by_Stanton_FIN.jpg/1280px-Iguanodon_bernissartensis_Reconstruction_by_Stanton_FIN.jpg",
  "Carnotaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Carnotaurus_sastrei_reconstruction.jpg/1280px-Carnotaurus_sastrei_reconstruction.jpg",
  "Gallimimus": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Gallimimus_bullatus_reconstruction.jpg/1280px-Gallimimus_bullatus_reconstruction.jpg",
  "Dilophosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Dilophosaurus_wetherilli_reconstruction.jpg/1280px-Dilophosaurus_wetherilli_reconstruction.jpg",
  "Giganotosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Giganotosaurus_carolinii_transparent.png/1280px-Giganotosaurus_carolinii_transparent.png",
  "Therizinosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Therizinosaurus_NT.jpg/1280px-Therizinosaurus_NT.jpg",
  "Compsognathus": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Compsognathus_longipes_reconstruction.jpg/1024px-Compsognathus_longipes_reconstruction.jpg",
  "Archaeopteryx": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Archaeopteryx_lithographica_paleonerd.jpg/1280px-Archaeopteryx_lithographica_paleonerd.jpg",
  "Pachycephalosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pachycephalosaurus_wyomingensis_reconstruction.jpg/1280px-Pachycephalosaurus_wyomingensis_reconstruction.jpg",
  "Mosasaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Mosasaurus_beaugei_reconstruction.jpg/1280px-Mosasaurus_beaugei_reconstruction.jpg",
  "Plesiosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Plesiosaurus_makrognathus_reconstruction.jpg/1280px-Plesiosaurus_makrognathus_reconstruction.jpg",
  "Ichthyosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Ichthyosaurus_communis_reconstruction.jpg/1280px-Ichthyosaurus_communis_reconstruction.jpg",
  "Dimorphodon": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Dimorphodon_macronyx_reconstruction.jpg/1280px-Dimorphodon_macronyx_reconstruction.jpg",
  "Baryonyx": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Baryonyx_walkeri_reconstruction.jpg/1280px-Baryonyx_walkeri_reconstruction.jpg",
  "Corythosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Corythosaurus_casuarius_reconstruction.jpg/1280px-Corythosaurus_casuarius_reconstruction.jpg",
  "Edmontosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Edmontosaurus_annectens_reconstruction.jpg/1280px-Edmontosaurus_annectens_reconstruction.jpg",
  "Maiasaura": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Maiasaura_peeblesorum_reconstruction.jpg/1280px-Maiasaura_peeblesorum_reconstruction.jpg",
  "Styracosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Styracosaurus_albertensis_reconstruction.jpg/1280px-Styracosaurus_albertensis_reconstruction.jpg",
  "Protoceratops": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Protoceratops_andrewsi_reconstruction.jpg/1280px-Protoceratops_andrewsi_reconstruction.jpg",
  "Euoplocephalus": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Euoplocephalus_tutus_reconstruction.jpg/1280px-Euoplocephalus_tutus_reconstruction.jpg",
  "Oviraptor": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Oviraptor_philoceratops_reconstruction.jpg/1280px-Oviraptor_philoceratops_reconstruction.jpg",
  "Deinonychus": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Deinonychus_Reconstruction.jpg/1280px-Deinonychus_Reconstruction.jpg",
  "Troodon": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Troodon_formosus_reconstruction.jpg/1280px-Troodon_formosus_reconstruction.jpg",
  "Coelophysis": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Coelophysis_bauri_reconstruction.jpg/1280px-Coelophysis_bauri_reconstruction.jpg",
  "Ceratosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Ceratosaurus_nasicornis_reconstruction.jpg/1280px-Ceratosaurus_nasicornis_reconstruction.jpg",
  "Carcharodontosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Carcharodontosaurus_saharicus_reconstruction.jpg/1280px-Carcharodontosaurus_saharicus_reconstruction.jpg",
  "Acrocanthosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Acrocanthosaurus_atokensis_reconstruction.jpg/1280px-Acrocanthosaurus_atokensis_reconstruction.jpg",
  "Albertosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Albertosaurus_sarcophagus_reconstruction.jpg/1280px-Albertosaurus_sarcophagus_reconstruction.jpg",
  "Tarbosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Tarbosaurus_bataar_reconstruction.jpg/1280px-Tarbosaurus_bataar_reconstruction.jpg",
  "Utahraptor": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Utahraptor_ostrommaysorum_reconstruction.jpg/1280px-Utahraptor_ostrommaysorum_reconstruction.jpg",
  "Microraptor": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Microraptor_gui_reconstruction.jpg/1024px-Microraptor_gui_reconstruction.jpg",
  "Kentrosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kentrosaurus_aethiopicus_reconstruction.jpg/1280px-Kentrosaurus_aethiopicus_reconstruction.jpg",
  "Amargasaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Amargasaurus_cazaui_reconstruction.jpg/1280px-Amargasaurus_cazaui_reconstruction.jpg",
  "Argentinosaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Argentinosaurus_huinculensis_reconstruction.jpg/1280px-Argentinosaurus_huinculensis_reconstruction.jpg",
  "Quetzalcoatlus": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Quetzalcoatlus_northropi_reconstruction.jpg/1280px-Quetzalcoatlus_northropi_reconstruction.jpg",
  "placeholder": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Crect width='100%' height='100%' fill='%23334155'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='32' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'%3EImage Not Found%3C/text%3E%3C/svg%3E"
};
const dinoNames = Object.keys(dinoImageMap).filter(name => name !== "placeholder");


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

  // --- NEW ROBUST LOGIC ---
  // 1. We select the dinosaurs first, ensuring they exist in our image map.
  const selectedDinos = shuffleArray(dinoNames).slice(0, totalQuestions);

  // 2. We ask the AI to generate details ONLY for the dinosaurs we have selected.
  const schema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            // Note: We no longer ask for correctAnswer in the schema. We will add it ourselves.
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `An array of ${numOptions} possible dinosaur names, including the correct one.`
            },
            funFact: {
              type: Type.STRING,
              description: "A short, interesting fun fact about this specific dinosaur."
            },
            hint: {
              type: Type.STRING,
              description: "A short, helpful clue about this specific dinosaur that doesn't give away the answer directly."
            }
          },
          required: ["options", "funFact", "hint"]
        }
      }
    },
    required: ["questions"]
  };

  const prompt = `
    Generate a quiz with exactly ${totalQuestions} questions.
    The quiz questions must be about the following dinosaurs, in this exact order: ${selectedDinos.join(', ')}.
    For each dinosaur, create a question object with the following properties:
    1. 'options': An array of ${numOptions} multiple-choice options. One must be the correct answer (the name of the dinosaur for this question). The other ${numOptions - 1} options should be other plausible dinosaur names from the full list provided. The full list of possible options is: ${dinoNames.join(', ')}.
    2. 'funFact': A short, engaging fun fact about the dinosaur.
    3. 'hint': A helpful hint for guessing the dinosaur.
    
    Return a single JSON object with a "questions" key, containing an array of these ${totalQuestions} question objects.
    The order of the questions in the final array must exactly match the order of the dinosaur names provided above.
    Do not include a 'correctAnswer' field in your response.
    Do not include any markdown formatting.
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
    const rawData = JSON.parse(jsonText);

    if (!rawData.questions || rawData.questions.length !== totalQuestions) {
        throw new Error("Invalid data structure or question count received from API");
    }
    
    // 3. Enrich the AI-generated data with our guaranteed-to-exist image URLs and correct answers.
    const questionsWithImages = rawData.questions.map((q: Omit<DinosaurQuestion, 'imageUrl' | 'correctAnswer'>, index: number) => {
      // We trust the order from the AI, as requested in the prompt.
      // We get the correct name from our own list, which is guaranteed to be in the image map.
      const correctDinoName = selectedDinos[index];
      
      return {
        ...q,
        // We add our trusted answer and image URL, ignoring anything the AI might have provided.
        correctAnswer: correctDinoName,
        imageUrl: dinoImageMap[correctDinoName]
      };
    });

    const data: QuizData = { questions: questionsWithImages };
    return data;

  } catch (error) {
    console.error("Error fetching quiz data from Gemini, using fallback:", error);
    // Fallback data now uses the reliable dinoImageMap
    const shuffledFallbackDinos = shuffleArray(dinoNames);
    const fallbackAllNames = dinoNames;

    const questions: DinosaurQuestion[] = shuffledFallbackDinos.slice(0, totalQuestions).map(correctDinoName => {
        const wrongAnswers = fallbackAllNames.filter(name => name !== correctDinoName);
        const options = [correctDinoName, ...shuffleArray(wrongAnswers).slice(0, numOptions - 1)];
        return {
            correctAnswer: correctDinoName,
            options: shuffleArray(options),
            funFact: `This is a dinosaur known for its distinctive features. A full fun fact would normally be generated here by the AI.`,
            imageUrl: dinoImageMap[correctDinoName],
            hint: `This dinosaur's name often gives a clue to its most prominent feature. A full hint would be generated here.`
        }
    });

    return { questions };
  }
};