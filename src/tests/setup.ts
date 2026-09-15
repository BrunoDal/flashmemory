// IndexedDB is not provided by jsdom. Keep the implementation test-only so
// the production bundle continues to use the browser's native IndexedDB.
import 'fake-indexeddb/auto';
