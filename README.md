# Mobile Lab Test

## Project Description
A mobile-first attendance and reflection app for classrooms. Students check in with a QR code, capture their location for verification, and log pre- and post-class reflections. Instructors can review session data recorded in local SQLite storage (and exported for web hosting via Firebase).

## Tech Stack
- React Native (Expo)
- expo-camera (QR scanning), expo-location, expo-sqlite
- React Navigation
- Firebase (web config required)

## Setup Instructions
1. Clone the repo
2. npm install
3. npx expo start
4. Scan QR with Expo Go app (ensure Expo Go supports SDK 54)

## How to Run
- iOS: Press i in terminal
- Android: Press a in terminal
- Web: Press w in terminal

## Firebase Configuration
App uses email/password auth; provide your own Firebase web config in `src/services/firebase.ts` (or via `expo.extra`).

## AI Usage Report
- GitHub Copilot: component scaffolding, hook logic, SQLite queries, QR scanner migration
- Claude: PRD, project structure, prompt chain
- Student: form validation, navigation flow, error handling, UI styling adjustments
