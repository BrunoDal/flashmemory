import swSource from '../../public/sw.js?raw';
import { SERVICE_WORKER_URL, serviceWorkerUrlFor, SKIP_WAITING_MESSAGE } from '../pwa/registration';

describe('PWA offline contract', () => {
  it('keeps the service worker cache versioned and removes stale versions', () => {
    expect(swSource).toContain("const CACHE_PREFIX = 'flashmemory-cache-'");
    expect(swSource).toContain("const CACHE_VERSION = 'v2'");
    expect(swSource).toContain("key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME");
    expect(swSource).toContain("cache.addAll(SHELL_URLS)");
    expect(swSource).toContain("if (!self.registration.active) self.skipWaiting()");
  });

  it('limits shell fallback to navigation and runtime cache to same-origin assets', () => {
    expect(swSource).toContain("request.method !== 'GET' || !isSameOrigin(request)");
    expect(swSource).toContain("if (isNavigation(request))");
    expect(swSource).toContain("if (!ASSET_DESTINATIONS.has(request.destination)) return");
    expect(swSource).toContain("const appUrl = (path) => new URL(path, self.registration.scope).toString()");
    expect(swSource).toContain(".catch(() => caches.match(APP_SHELL_URL))");
  });

  it('exposes the explicit update handshake used by the accessible CTA', () => {
    expect(SERVICE_WORKER_URL).toBe('/sw.js');
    expect(serviceWorkerUrlFor('/flashmemory/')).toBe('/flashmemory/sw.js');
    expect(SKIP_WAITING_MESSAGE).toEqual({ type: 'SKIP_WAITING' });
    expect(swSource).toContain("event.data?.type === 'SKIP_WAITING'");
  });
});
