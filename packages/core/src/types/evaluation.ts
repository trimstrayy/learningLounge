// Evaluation types for Writing and Speaking tests

export interface WritingCriterionScore {
  score: number;
  feedback: string;
  ceilingReached?: boolean;
  reason?: string;
}

export interface WritingEvaluation {
  taskAchievement: WritingCriterionScore;
  coherenceCohesion: WritingCriterionScore;
  lexicalResource: WritingCriterionScore;
  grammarAccuracy: WritingCriterionScore;
  overallBand: number;
  strengths?: string[];
  improvements?: string[];
  examinerNotes?: string;
  wordCount?: number;
}

export interface SpeakingCriterionScore {
  score: number;
  feedback: string;
}

export interface SpeakingEvaluation {
  fluencyCoherence: SpeakingCriterionScore;
  lexicalResource: SpeakingCriterionScore;
  grammaticalRange: SpeakingCriterionScore;
  pronunciation: SpeakingCriterionScore;
  estimatedBand: number;
  strengths?: string[];
  improvements?: string[];
  examinerNotes?: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  test_id: string;
  test_type: 'listening' | 'reading' | 'writing' | 'speaking';
  correct_count: number;
  total_questions: number;
  band_score: number | null;
  duration_minutes: number | null;
  answers?: Record<string, unknown>;
  created_at: string;
}
