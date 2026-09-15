/**
 * Application-facing repository facade. React components/hooks import this
 * module instead of depending on the IndexedDB adapter directly.
 */
export { profileRepo, reviewRepo, settingsRepo, sessionRepo, persistReviewAndSession } from '../storage/db';
