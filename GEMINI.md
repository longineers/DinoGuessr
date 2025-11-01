# Project Overview

This is a web-based dinosaur guessing game called "DinoGuessr". It is a React application built with Vite and TypeScript. The game quizzes the user on their dinosaur knowledge, presenting them with an image and a set of multiple-choice answers. The quiz questions are generated locally, and the application is completely self-contained.

## Main Technologies

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite

## Architecture

The application is structured into several components:

*   `App.tsx`: The main component that manages the game state (start, loading, playing, finished), score, and rounds.
*   `components/`: This directory contains the individual React components for different parts of the game, such as the start screen, game screen, and end screen.
*   `services/dataService.ts`: This service is responsible for generating the quiz data locally.
*   `types.ts`: This file defines the TypeScript types used throughout the application.

# Building and Running

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

# Development Conventions

*   **Component-Based Architecture:** The application is built using a component-based architecture, with each component responsible for a specific part of the UI.
*   **TypeScript:** The project uses TypeScript for static typing, which helps to catch errors early and improve code quality.
*   **State Management:** The application state is managed within the `App.tsx` component using React's `useState` and `useCallback` hooks.