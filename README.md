# DinoGuessr

DinoGuessr is a web-based dinosaur guessing game designed to test your knowledge of the prehistoric world. Players are presented with an image of a dinosaur and must select the correct name from a list of multiple-choice options. The game is built with React, TypeScript, and Vite, and features a clean, modern interface.

## Table of Contents

-   [Features](#features)
-   [Main Technologies](#main-technologies)
-   [Architecture](#architecture)
-   [Building and Running](#building-and-running)
-   [Adding New Dinosaurs](#adding-new-dinosaurs)
-   [Development Conventions](#development-conventions)
-   [Testing](#testing)

## Features

-   **Multiple Difficulty Levels:** Choose from easy, medium, or hard difficulty settings to tailor the challenge to your knowledge level.
-   **Engaging Gameplay:** Guess the dinosaur from a partially revealed image, with the option to reveal more of the image over time.
-   **Scoring System:** Earn points for correct answers and compete for a high score.
-   **Hints:** Use hints to help you identify the dinosaur if you get stuck.
-   **Sound Effects:** Enjoy a more immersive experience with sound effects for correct and incorrect answers.

## Game Screenshots

### Main Screen
![Main Screen](public/assets/screenshots/MainScreen.png)

### Play Screen
![Play Screen](public/assets/screenshots/PlayScreen.png)

### Final Screen
![Final Screen](public/assets/screenshots/FinalScreen.png)

## Main Technologies

-   **Frontend:** React, TypeScript
-   **Build Tool:** Vite

## Architecture

The application's source code is located in the `src/` directory and is structured into several components:

-   `src/App.tsx`: The main component that manages the game state (start, loading, playing, finished), score, and rounds.
-   `src/components/`: This directory contains the individual React components for different parts of the game.
    -   `src/components/screens/`: Contains top-level screen components like `StartScreen`, `GameScreen`, and `EndScreen`.
    -   `src/components/common/`: Contains reusable, generic UI components like `LoadingSpinner` and `VolumeControl`.
-   `src/services/dataService.ts`: This service is responsible for generating the quiz data locally.
-   `src/types.ts`: This file defines the TypeScript types used throughout the application.
-   `src/assets/dinosaurs.json`: A centralized JSON file that contains the list of dinosaurs, making it easy to add new dinosaurs to the game.
-   `public/`: This directory contains static assets that are served directly to the browser, such as `manifest.json`, `service-worker.js`, and the dinosaur images in `public/assets`.

## Building and Running

**Prerequisites:** Node.js

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
3.  **Build for production:**
    ```bash
    npm run build
    ```
4.  **Preview the production build:**
    ```bash
    npm run preview
    ```

## Dockerization

The application can be run using Docker.

1.  **Build the Docker image:**
    ```bash
    docker build -t dinoguessr .
    ```

2.  **Run the Docker container:**
    ```bash
    docker run -p 8080:80 dinoguessr
    ```
    Once the container is running, you can access the application by opening your web browser and navigating to `http://localhost:8080`.

## Adding New Dinosaurs

Adding new dinosaurs to the game is a straightforward process:

1.  **Add the dinosaur to `src/assets/dinosaurs.json`:**
    Open the `src/assets/dinosaurs.json` file and add a new entry for the dinosaur, following the existing format:

    ```json
    {
      "name": "New Dinosaur",
      "image": "/assets/New Dinosaur.jpg"
    }
    ```

2.  **Add the dinosaur's image:**
    Add a corresponding image for the new dinosaur to the `public/assets` directory. The image name should match the `name` property in the `dinosaurs.json` file.

    If you need help finding and downloading images, you can use the `scripts/download-images.mjs` script:

    ```bash
    node scripts/download-images.mjs
    ```

    This script will generate a list of search URLs for each dinosaur, making it easier to find and download the images you need.

## Development Conventions

-   **Component-Based Architecture:** The application is built using a component-based architecture, with each component responsible for a specific part of the UI.
-   **TypeScript:** The project uses TypeScript for static typing, which helps to catch errors early and improve code quality.
-   **State Management:** The application state is managed within the `App.tsx` component using React's `useState` and `useCallback` hooks.

## Testing

To run the unit tests for the application, use the following command:

```bash
npm test
```

This will execute all tests located within the `src/services/` directory (and other `src` subdirectories if more tests are added) and provide a summary of the results.
