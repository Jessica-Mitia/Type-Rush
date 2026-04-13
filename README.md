# TypeRush - Web Typing Test

## Introduction
This project is an enriched and fully completed version of the original Vanilla Typing assignment. Built strictly with HTML, CSS, and Vanilla Javascript, **TypeRush** is an interactive typing game designed to help users test and improve their typing speed and accuracy in a modern interface.

## New Features Implemented
- **Modern UI/UX Redesign**: A sleek, dark-themed aesthetic with completely custom CSS and responsive layouts.
- **Dynamic Typing Engine**: Live highlighting logic tracking every keypress, calculating your exact Words Per Minute (WPM) and precision percentage.
- **Customizable Tests**: 
  - 3 difficulty levels (Easy, Medium, Hard) with curated dictionaries.
  - Multi-length timers (15s, 30s, 60s, 120s).
- **Firebase Authentication**: Fully functional external Backend authentication for User Login and Registration natively in Vanilla JS using Firebase compat scripts (no bundler setup required). It handles sessions, profile syncs, and friendly error alerts.
- **Persistent Profile & Statistics**: The application uses browser memory (`localStorage`) to record test performances over time. Players can log in and view their personal Dashboard showing their **Highest WPM, Lowest WPM, and Average Score**.

## Technical Details
- **Frameworks**: 100% Vanilla JS (No React, NextJS, or Svelte).
- **Graphing**: Integration with Chart.js to map speed and accuracy evolutions instantly at the end of a round.
- **Architecture**: Separated assets (`/CSS`, `/JS`, `/Images`) to preserve logic modularity.

## How to Run it
1. Simply clone or download the repository.
2. If configuring your own Database, enable **Email/Password** Authentication through the Firebase Console and overwrite the keys in `assets/JS/firebase-config.js`.
3. Double-click on `home.html` or `login.html` to open the site locally in any web browser and enjoy!

*Built for HEI L1 - WEB1 Final Exam (April 2025)*
