import { expect, test, type Page } from '@playwright/test';

const createProfileForTopics = async (page: Page, name: string, topics: string[] = ['Géographie']) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Une idée à la fois/ })).toBeVisible();
  await page.getByPlaceholder('Votre prénom').fill(name);
  for (const topic of ['Géographie', 'Histoire', 'Sciences']) {
    if (!topics.includes(topic)) await page.getByRole('button', { name: new RegExp(topic) }).click();
  }
  for (const topic of topics.filter(topic => !['Géographie', 'Histoire', 'Sciences'].includes(topic))) {
    await page.getByRole('button', { name: new RegExp(topic) }).click();
  }
  await page.getByRole('button', { name: /Créer mon espace/ }).click();
  await expect(page.locator('.question-card h1')).toBeVisible();
  await expect(page.locator('.study-head')).toContainText('1 /');
};

const createFirstProfile = async (page: Page, name: string) => createProfileForTopics(page, name);

const revealAndRate = async (page: Page, rating: RegExp | string = /Correct/) => {
  const reveal = page.getByRole('button', { name: /Afficher la réponse/ });
  if (await reveal.isVisible()) {
    await reveal.click();
  } else {
    // QCM cards reveal the answer after a choice instead of using the
    // flashcard button. The selected choice is intentionally immaterial here;
    // the rating below records the learner's own assessment.
    await page.locator('.choices button').first().click();
  }
  await expect(page.getByText('Réponse', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: rating }).click();
};

const readReviewStates = async (page: Page, profileId: string) => page.evaluate(async (id) => {
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('flashmemory');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return await new Promise<unknown[]>((resolve, reject) => {
    const request = database.transaction('states', 'readonly').objectStore('states').getAll();
    request.onsuccess = () => resolve((request.result as Array<{ profileId: string }>).filter(state => state.profileId === id));
    request.onerror = () => reject(request.error);
  });
}, profileId);

const readReviewEvents = async (page: Page, profileId: string) => page.evaluate(async (id) => {
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('flashmemory');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return await new Promise<unknown[]>((resolve, reject) => {
    const request = database.transaction('events', 'readonly').objectStore('events').getAll();
    request.onsuccess = () => resolve((request.result as Array<{ profileId: string }>).filter(event => event.profileId === id));
    request.onerror = () => reject(request.error);
  });
}, profileId);

const readSettings = async (page: Page, profileId: string) => page.evaluate(async (id) => {
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('flashmemory');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return await new Promise<Record<string, unknown> | undefined>((resolve, reject) => {
    const request = database.transaction('settings', 'readonly').objectStore('settings').get(id);
    request.onsuccess = () => resolve(request.result as Record<string, unknown> | undefined);
    request.onerror = () => reject(request.error);
  });
}, profileId);

test.describe('parcours persistants Flashmemory', () => {
  test('premier lancement, réponse puis reprise après rechargement', async ({ page }) => {
    await createFirstProfile(page, 'Alice');
    await revealAndRate(page);
    await expect(page.locator('.study-head')).toContainText('2 /');

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Votre moment de curiosité.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Reprendre où vous en étiez' })).toBeVisible();
    await expect(page.getByText(/\d+ questions restantes/)).toBeVisible();

    await page.getByRole('button', { name: /Continuer/ }).click();
    await expect(page.locator('.study-head')).toContainText('2 /');
  });

  test('les états d’une carte sont isolés entre deux profils', async ({ page }) => {
    await createFirstProfile(page, 'Alice');
    await revealAndRate(page, /Correct/);
    await expect(page.locator('.study-head')).toContainText('2 /');

    await page.getByRole('button', { name: 'Accueil' }).click();
    await page.getByRole('button', { name: 'Réglages' }).click();
    await page.getByRole('button', { name: 'Gérer les profils' }).click();
    await page.getByLabel('Nom du nouveau profil').fill('Bob');
    await page.getByRole('button', { name: 'Créer le profil' }).click();
    await expect(page.getByRole('heading', { name: 'Votre moment de curiosité.' })).toBeVisible();

    const bobId = await page.getByLabel('Profil actif').inputValue();
    await expect.poll(() => readReviewStates(page, bobId)).toHaveLength(0);
    await page.getByRole('button', { name: /Commencer/ }).click();
    await expect(page.locator('.study-head')).toContainText('1 /');
    await expect(page.locator('.question-card h1')).toBeVisible();
    await expect.poll(() => readReviewStates(page, bobId)).toHaveLength(0);
  });

  test('une session déjà chargée reste utilisable hors connexion', async ({ page, context }) => {
    await createFirstProfile(page, 'Offline');
    await page.getByRole('button', { name: /Quitter/ }).click();
    await expect(page.getByRole('heading', { name: 'Votre moment de curiosité.' })).toBeVisible();

    await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return;
      await navigator.serviceWorker.ready;
    });
    await page.reload();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller));

    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('status').filter({ hasText: 'Hors connexion' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Reprendre où vous en étiez' })).toBeVisible();

    await page.getByRole('button', { name: /Continuer/ }).click();
    await expect(page.locator('.question-card h1')).toBeVisible();
    await revealAndRate(page, /Facile/);
    await expect(page.locator('.study-head')).toContainText('2 /');
  });

  test('les réglages de difficulté, son et vibrations sont persistés', async ({ page }) => {
    await createFirstProfile(page, 'Réglages');
    await page.getByRole('button', { name: /Quitter/ }).click();
    await page.getByRole('button', { name: 'Réglages' }).click();
    await page.getByLabel(/Difficulté des nouvelles questions/).selectOption('3');
    await page.getByLabel(/Son des feedbacks/).click();
    await expect.poll(() => page.getByLabel(/Son des feedbacks/).isChecked()).toBe(true);
    await page.getByLabel(/Vibrations/).click();
    await expect.poll(() => page.getByLabel(/Vibrations/).isChecked()).toBe(true);
    const profileId = await page.getByLabel('Profil actif').inputValue();
    await expect.poll(() => readSettings(page, profileId)).toMatchObject({ desiredDifficulty: 3, sound: true, haptics: true });
    await page.reload();
    await page.getByRole('button', { name: 'Réglages' }).click();
    await expect(page.getByLabel(/Difficulté des nouvelles questions/)).toHaveValue('3');
    await expect(page.getByLabel(/Son des feedbacks/)).toBeChecked();
    await expect(page.getByLabel(/Vibrations/)).toBeChecked();
  });

  test('la sélection rapide des thèmes est persistée par profil', async ({ page }) => {
    await createFirstProfile(page, 'Thèmes');
    await page.getByRole('button', { name: /Quitter/ }).click();
    await page.getByRole('button', { name: 'Thèmes' }).click();
    await page.getByRole('button', { name: 'Tout désélectionner' }).click();
    await expect(page.getByRole('button', { name: 'Enregistrer' })).toBeDisabled();
    await page.getByRole('button', { name: 'Tout sélectionner' }).click();
    await expect(page.locator('.topic-list button.selected')).toHaveCount(28);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect.poll(() => page.locator('.topic-list button.selected').count()).toBe(28);
    await page.reload();
    await page.getByRole('button', { name: 'Thèmes' }).click();
    await expect(page.locator('.topic-list button.selected')).toHaveCount(28);
  });

  test('un quiz libre ne modifie pas la planification des révisions', async ({ page }) => {
    await createFirstProfile(page, 'Quiz libre');
    const profileId = await page.getByLabel('Profil actif').inputValue();
    await page.getByRole('button', { name: /Quitter/ }).click();
    await page.getByRole('button', { name: 'Quiz libre' }).click();
    await revealAndRate(page, /Correct/);
    await expect.poll(() => readReviewStates(page, profileId)).toHaveLength(0);
    await expect.poll(() => readReviewEvents(page, profileId)).toHaveLength(0);
  });

  test('un QCM montre la réponse et un feedback non punitif', async ({ page }) => {
    // Keep the session seeds deterministic, but do not couple this scenario to
    // one particular question's position as the verified catalogue grows.
    await page.addInitScript(() => {
      // createProfile, the onboarding session, then the Discover session each
      // consume UUIDs in this order. Seed 209 is the first stable shuffle that
      // puts the Sciences QCM `science-elements-fe` first in the current
      // verified catalogue (the session UUID itself is immaterial).
      const values = ['e2e-profile', 'e2e-initial-seed', 'e2e-initial-session', 'e2e-qcm-209', 'e2e-qcm-session'];
      let counter = 0;
      Object.defineProperty(crypto, 'randomUUID', {
        configurable: true,
        value: () => values[counter++] ?? `e2e-extra-${counter}`,
      });
    });
    await createProfileForTopics(page, 'QCM', ['Sciences']);
    await page.getByRole('button', { name: 'Accueil' }).click();
    await page.getByRole('button', { name: 'Découvrir' }).click();
    await expect(page.locator('.choices')).toBeVisible();
    const options = page.locator('.choices button');
    await options.nth(0).click();
    await expect(page.locator('.choice-feedback')).toContainText(/Bonne réponse|La bonne réponse était/);
    await expect(page.locator('.choices button.correct')).toBeVisible();
    await expect(page.locator('.choices button.selected')).toBeVisible();
    await expect(page.getByText('Réponse', { exact: true })).toBeVisible();
    await expect(page.getByText('Piste de contrôle', { exact: false })).toBeVisible();
    await expect(page.getByRole('link', { name: /Consulter/i })).toBeVisible();
  });
});
