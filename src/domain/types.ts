export type QuestionType = 'flashcard' | 'multiple-choice' | 'true-false';
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
export type ReviewStatus = 'new' | 'learning' | 'review' | 'relearning';
export type Theme = 'light' | 'dark' | 'system';
export type DifficultyPreference = 1 | 2 | 3 | 4 | 5 | 'any';
export type SessionMode = 'daily' | 'review' | 'discover' | 'free' | 'topic';
export type StudySessionStatus = 'active' | 'completed' | 'abandoned';
/** Editorial workflow state; approved means reviewed for publication, not that a URL is an automatic truth oracle. */
export type ContentReviewStatus = 'approved' | 'draft' | 'rejected';

export interface QuestionProvenance {
  factId: string;
  source: string;
  url: string;
  license: string;
  checkedAt: string;
  method: string;
  status: ContentReviewStatus;
}

export interface Question {
  id: string; factId: string; version: number; type: QuestionType; question: string; answer: string;
  acceptedAnswers?: string[]; choices?: string[]; correctChoice?: number; explanation: string;
  category: string; subcategory?: string; tags?: string[]; difficulty: 1 | 2 | 3 | 4 | 5;
  source?: string; provenance: QuestionProvenance;
}
export interface Profile { id: string; name: string; createdAt: string; activeTopics: string[]; level: 'beginner' | 'intermediate' | 'advanced' | 'any'; }
export interface ReviewState {
  id: string; questionId: string; profileId: string; state: ReviewStatus; dueAt: string;
  lastReviewedAt?: string; reviewCount: number; lapseCount: number; difficulty: number; stability: number; lastRating?: ReviewRating;
}
export interface ReviewEvent { id: string; profileId: string; questionId: string; reviewedAt: string; rating: ReviewRating; previousDueAt?: string; nextDueAt: string; responseTimeMs?: number; }
export interface Settings {
  id: string;
  newCardsPerDay: number;
  maxReviewsPerSession: number;
  theme: Theme;
  sound: boolean;
  haptics: boolean;
  /** Editorial difficulty preferred for genuinely new cards; existing due cards are never hidden. */
  desiredDifficulty: DifficultyPreference;
}
/** Persisted cursor for an interrupted study session. Question ids are a snapshot,
 * so a catalogue update cannot silently change the order of a session in progress. */
export interface StudySession {
  id: string;
  profileId: string;
  mode: SessionMode;
  questionIds: string[];
  currentIndex: number;
  startedAt: string;
  updatedAt: string;
  status: StudySessionStatus;
  completedAt?: string;
  topics?: string[];
}
export interface ExportBundle { format: 'general-knowledge-trainer'; version: 1; exportedAt: string; profile: Profile; reviewStates: ReviewState[]; reviewEvents: ReviewEvent[]; settings: Settings; }

export const REVIEW_RATINGS: ReviewRating[] = ['again', 'hard', 'good', 'easy'];
export const TOPICS = ['Histoire', 'Géographie', 'Sciences', 'Biologie', 'Psychologie', 'Sociologie', 'Mathématiques', 'Nature', 'Astronomie', 'Technologie', 'Informatique', 'Arts', 'Littérature', 'Cinéma', 'Séries', 'Musique', 'Sport', 'Politique', 'Institutions', 'Économie', 'Philosophie', 'Mythologie', 'Religions', 'Langues', 'Inventions', 'Culture française', 'Europe', 'Monde'];
