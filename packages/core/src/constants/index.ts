// App-wide constants

export const APP_NAME = 'Lexora IELTS';
export const APP_DESCRIPTION = 'AI-Powered IELTS Preparation Platform';

// Test durations in minutes
export const TEST_DURATIONS = {
  listening: 30,
  reading: 60,
  writing: 60,
  speaking: 14,
} as const;

// Minimum word counts for writing
export const WRITING_MIN_WORDS = {
  task1: 150,
  task2: 250,
} as const;

// Band score ranges
export const BAND_SCORES = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9] as const;

// Cambridge book numbers available
export const CAMBRIDGE_BOOKS = [13, 14, 15, 16, 17, 18, 19] as const;

// Tests per book
export const TESTS_PER_BOOK = 4;

// API endpoints
export const API_ENDPOINTS = {
  evaluateWriting: '/functions/v1/evaluate-writing',
  evaluateSpeaking: '/functions/v1/evaluate-speaking',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  theme: 'theme',
  writingTask1Answer: 'writing:task1:answer',
  writingTask2Answer: 'writing:task2:answer',
  writingTask1Image: 'writing:task1:image',
  writingTask2Image: 'writing:task2:image',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  networkError: 'Network error. Please check your connection and try again.',
  authRequired: 'Please sign in to continue.',
  evaluationFailed: 'Failed to evaluate your submission. Please try again.',
  loadFailed: 'Failed to load data. Please refresh the page.',
} as const;
