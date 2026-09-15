import type { ReviewRating, ReviewState } from './types';

export interface Scheduler { review(state: ReviewState, rating: ReviewRating, now?: Date): ReviewState; }
const DAY = 86_400_000;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** A small FSRS-inspired scheduler. Stability grows with successful recalls and drops on lapses. */
export class SpacedRepetitionScheduler implements Scheduler {
  review(input: ReviewState, rating: ReviewRating, now = new Date()): ReviewState {
    const state = { ...input };
    const previousStability = Math.max(0.25, state.stability || 0.5);
    let intervalDays: number;
    if (rating === 'again') {
      intervalDays = 10 / (60 * 24); // ten minutes
      state.state = state.reviewCount === 0 ? 'learning' : 'relearning';
      state.lapseCount += 1;
      state.stability = Math.max(0.25, previousStability * 0.35);
      state.difficulty = clamp(state.difficulty + 0.25, 1, 10);
    } else {
      const multiplier = rating === 'hard' ? 1.35 : rating === 'good' ? 2.4 : 3.8;
      intervalDays = state.reviewCount === 0 ? (rating === 'easy' ? 4 : rating === 'hard' ? 0.5 : 1) : previousStability * multiplier;
      state.stability = clamp(previousStability * (rating === 'hard' ? 1.15 : rating === 'good' ? 1.45 : 1.9), 0.5, 3650);
      state.difficulty = clamp(state.difficulty + (rating === 'hard' ? 0.1 : rating === 'easy' ? -0.2 : -0.05), 1, 10);
      state.state = intervalDays < 1 ? 'learning' : 'review';
    }
    state.lastRating = rating;
    state.reviewCount += 1;
    state.lastReviewedAt = now.toISOString();
    state.dueAt = new Date(now.getTime() + intervalDays * DAY).toISOString();
    return state;
  }
}

export const defaultReviewState = (profileId: string, questionId: string, now = new Date()): ReviewState => ({
  id: `${profileId}:${questionId}`, profileId, questionId, state: 'new', dueAt: now.toISOString(), reviewCount: 0, lapseCount: 0, difficulty: 5, stability: 0.5
});
