import { describe, expect, it } from 'vitest';
import { defaultReviewState, SpacedRepetitionScheduler } from '../domain/scheduler';
const at = new Date('2026-01-01T12:00:00.000Z');
describe('SpacedRepetitionScheduler', () => {
  it('programme les ratings croissants', () => { const s = new SpacedRepetitionScheduler(); const base = defaultReviewState('p','q',at); const again = s.review(base,'again',at); const hard = s.review(base,'hard',at); const good = s.review(base,'good',at); const easy = s.review(base,'easy',at); expect(new Date(again.dueAt).getTime()).toBeLessThan(new Date(hard.dueAt).getTime()); expect(new Date(hard.dueAt).getTime()).toBeLessThan(new Date(good.dueAt).getTime()); expect(new Date(good.dueAt).getTime()).toBeLessThan(new Date(easy.dueAt).getTime()); });
  it('augmente la stabilité et compte les lapses', () => { const s = new SpacedRepetitionScheduler(); const first = s.review(defaultReviewState('p','q',at),'good',at); const second = s.review(first,'good',new Date(first.dueAt)); const lapse = s.review(second,'again',at); expect(second.stability).toBeGreaterThan(first.stability); expect(lapse.lapseCount).toBe(1); expect(lapse.state).toBe('relearning'); });
});
