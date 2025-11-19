// TypeScript types for question bank JSON schemas

export type TestType = "listening" | "reading" | "writing" | "speaking";

// Listening schema
export type ListeningQuestionType =
  | "multiple-choice"
  | "form-completion"
  | "matching";

export interface ListeningMatchingPair {
  left: string;
  rightOptions: string[];
}

export interface ListeningQuestion {
  id: string;
  type: ListeningQuestionType;
  question?: string;
  options?: string[];
  correctOptionIndex?: number | null;
  answerLength?: "short" | "medium";
  pairs?: ListeningMatchingPair[];
}

export interface ListeningSection {
  sectionNumber: number;
  audioUrl: string;
  questions: ListeningQuestion[];
}

export interface ListeningTest {
  testId: string;
  sections: ListeningSection[];
}

// Reading schema
export type ReadingQuestionType =
  | "multiple-choice"
  | "true-false-notgiven"
  | "matching-headings";

export interface ReadingQuestion {
  id: string;
  type: ReadingQuestionType;
  question?: string;
  statement?: string;
  headings?: string[];
  options?: string[];
  correctOptionIndex?: number | null;
}

export interface ReadingPassage {
  id: string;
  title: string;
  textFile: string; // path to passage text file (served from public)
  questions: ReadingQuestion[];
}

export interface ReadingTest {
  testId: string;
  passages: ReadingPassage[];
}

// Writing schema
export interface WritingTask1 {
  type: "visual-report";
  prompt: string;
  imageUrl?: string;
}

export interface WritingTask2 {
  type: "essay";
  prompt: string;
}

export interface WritingTest {
  testId: string;
  task1: WritingTask1;
  task2: WritingTask2;
}

// Speaking schema
export interface SpeakingCueCard {
  topic: string;
  points: string[];
}

export interface SpeakingTest {
  testId: string;
  part1: { topic: string; questions: string[] };
  part2: { cueCard: SpeakingCueCard };
  part3: { discussion: string[] };
}

// Union type for convenience
export type AnyTest = ListeningTest | ReadingTest | WritingTest | SpeakingTest;
