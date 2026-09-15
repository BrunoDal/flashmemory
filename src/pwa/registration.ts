export const serviceWorkerUrlFor = (baseUrl: string) => `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}sw.js`;
export const SERVICE_WORKER_URL = serviceWorkerUrlFor(import.meta.env.BASE_URL);
export const SKIP_WAITING_MESSAGE = { type: 'SKIP_WAITING' } as const;

export type ServiceWorkerUpdateHandler = (registration: ServiceWorkerRegistration) => void;

export interface ServiceWorkerRegistrationOptions {
  onUpdate?: ServiceWorkerUpdateHandler;
  scriptUrl?: string;
}

/**
 * Registers the app worker and reports only updates to an already-controlled
 * page. The first install is intentionally silent: there is no new version for
 * the user to activate yet.
 */
export function registerServiceWorker({
  onUpdate,
  scriptUrl = SERVICE_WORKER_URL,
}: ServiceWorkerRegistrationOptions = {}): () => void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return () => undefined;

  let disposed = false;
  let registration: ServiceWorkerRegistration | undefined;
  let updateFoundListener: (() => void) | undefined;
  let stateChangeWorker: ServiceWorker | undefined;
  let stateChangeListener: (() => void) | undefined;

  const reportUpdate = () => {
    if (!disposed && registration && navigator.serviceWorker.controller) onUpdate?.(registration);
  };

  const watchInstallingWorker = () => {
    const worker = registration?.installing;
    if (!worker) return;
    stateChangeWorker?.removeEventListener('statechange', stateChangeListener as EventListener);
    stateChangeWorker = worker;
    stateChangeListener = () => {
      if (worker.state === 'installed') reportUpdate();
    };
    worker.addEventListener('statechange', stateChangeListener);
  };

  void navigator.serviceWorker.register(scriptUrl).then((nextRegistration) => {
    if (disposed) return;
    registration = nextRegistration;
    if (registration.waiting && navigator.serviceWorker.controller) reportUpdate();
    updateFoundListener = watchInstallingWorker;
    registration.addEventListener('updatefound', updateFoundListener);
  }).catch((error: unknown) => {
    // A registration failure must never prevent the IndexedDB-backed app from
    // loading. Keep the diagnostic useful without surfacing a blocking error.
    console.warn('[Flashmemory] service worker registration failed', error);
  });

  return () => {
    disposed = true;
    if (registration && updateFoundListener) registration.removeEventListener('updatefound', updateFoundListener);
    stateChangeWorker?.removeEventListener('statechange', stateChangeListener as EventListener);
  };
}

export function activateWaitingServiceWorker(registration: ServiceWorkerRegistration): boolean {
  if (!registration.waiting) return false;
  registration.waiting.postMessage(SKIP_WAITING_MESSAGE);
  return true;
}
