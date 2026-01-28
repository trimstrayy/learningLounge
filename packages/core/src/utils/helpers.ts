// Shared utility functions

/**
 * Count words in a text string
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format time in seconds to HH:MM:SS format
 */
export function formatTimeLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate IELTS band score from raw score (Listening/Reading)
 */
export function calculateBandScore(correctCount: number, totalQuestions: number = 40): number {
  const percentage = (correctCount / totalQuestions) * 100;
  
  if (percentage >= 97.5) return 9.0;
  if (percentage >= 92.5) return 8.5;
  if (percentage >= 87.5) return 8.0;
  if (percentage >= 82.5) return 7.5;
  if (percentage >= 75) return 7.0;
  if (percentage >= 67.5) return 6.5;
  if (percentage >= 57.5) return 6.0;
  if (percentage >= 50) return 5.5;
  if (percentage >= 40) return 5.0;
  if (percentage >= 32.5) return 4.5;
  if (percentage >= 25) return 4.0;
  if (percentage >= 15) return 3.5;
  if (percentage >= 10) return 3.0;
  if (percentage >= 5) return 2.5;
  if (percentage > 0) return 2.0;
  return 0;
}

/**
 * Calculate overall IELTS band score from individual scores
 */
export function calculateOverallBand(scores: number[]): number {
  const sum = scores.reduce((acc, score) => acc + score, 0);
  const avg = sum / scores.length;
  // Round to nearest 0.5
  return Math.round(avg * 2) / 2;
}

/**
 * Calculate Writing final band score (Task 1 = 1/3, Task 2 = 2/3 weight)
 */
export function calculateWritingBand(task1Score: number, task2Score: number): number {
  const rawScore = (task1Score + 2 * task2Score) / 3;
  return Math.round(rawScore * 2) / 2;
}

/**
 * Normalize answer string for comparison
 */
export function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Check if two answers match (case-insensitive, with normalization)
 */
export function answersMatch(userAnswer: string, correctAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
