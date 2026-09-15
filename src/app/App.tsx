import { useEffect, useMemo, useState } from 'react';
import { QUESTIONS, CATEGORIES } from '../content/questions';
import { TOPICS, type Profile, type Question, type ReviewEvent, type ReviewRating, type SessionMode, type StudySession } from '../domain/types';
import { calculateStatistics, type StatisticsPeriod } from '../domain/statistics';
import { useAppData } from '../hooks/useAppData';
import { createProfile, deleteProfile, renameProfile } from '../services/profile';
import { exportProfile, importProfile } from '../services/data';
import { createStudySession, getActiveStudySession, saveReview } from '../services/study';
import { profileRepo, settingsRepo } from '../services/repositories';
import { activateWaitingServiceWorker, registerServiceWorker } from '../pwa/registration';

type View = 'home' | 'study' | 'topics' | 'stats' | 'explore' | 'settings' | 'profiles';
const ratingLabels: Record<ReviewRating, string> = { again: 'À revoir', hard: 'Difficile', good: 'Correct', easy: 'Facile' };

export default function App() {
  const [activeId, setActiveId] = useState<string | undefined>(() => localStorage.getItem('flashmemory.profile') || undefined);
  const { profiles, profilesLoading, states, events, settings, refresh, refreshProfiles, setSettings } = useAppData(activeId);
  const profile = profiles.find(p => p.id === activeId); const [view, setView] = useState<View>('home'); const [onboarding, setOnboarding] = useState(false);
  const [session, setSession] = useState<Question[]>([]); const [studySession, setStudySession] = useState<StudySession>(); const [index, setIndex] = useState(0); const [revealed, setRevealed] = useState(false); const [sessionRatings, setSessionRatings] = useState<ReviewRating[]>([]); const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now()); const [search, setSearch] = useState(''); const [statsPeriod, setStatsPeriod] = useState<StatisticsPeriod>('today');
  const [selectedChoice, setSelectedChoice] = useState<number>();
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);
  const [pendingUpdate, setPendingUpdate] = useState<ServiceWorkerRegistration | null>(null);
  useEffect(() => registerServiceWorker({ onUpdate: setPendingUpdate }), []);
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);
  const activateUpdate = () => {
    if (!pendingUpdate) return;
    const handleControllerChange = () => window.location.reload();
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange, { once: true });
    if (!activateWaitingServiceWorker(pendingUpdate)) {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      window.location.reload();
    }
  };
  const stats = useMemo(() => calculateStatistics(events, states, QUESTIONS, new Date(), statsPeriod), [events, states, statsPeriod]);
  useEffect(() => {
    if (profilesLoading) return;
    if (!profiles.length) {
      setOnboarding(true);
      return;
    }
    setOnboarding(false);
    if (!activeId || !profile) {
      setActiveId(profiles[0].id);
      localStorage.setItem('flashmemory.profile', profiles[0].id);
    }
  }, [profilesLoading, profiles, activeId, profile]);
  useEffect(() => { if (settings) document.documentElement.dataset.theme = settings.theme; }, [settings]);
  useEffect(() => {
    if (!profile) return;
    let cancelled = false;
    setStudySession(undefined);
    setSession([]);
    setIndex(0);
    setSelectedChoice(undefined);
    void getActiveStudySession(profile.id).then(saved => {
      if (cancelled || !saved) return;
      const questions = saved.questionIds.map(id => QUESTIONS.find(question => question.id === id)).filter((question): question is Question => Boolean(question));
      setStudySession(saved);
      setSession(questions);
      setIndex(Math.min(saved.currentIndex, questions.length));
      setSessionRatings([]);
      setRevealed(false);
      setSelectedChoice(undefined);
    });
    return () => { cancelled = true; };
  }, [profile?.id]);
  const start = async (mode: SessionMode = 'daily', topics = profile?.activeTopics ?? TOPICS) => {
    if (!profile) return;
    const created = await createStudySession({
      questions: QUESTIONS,
      states,
      events,
      topics,
      mode,
      maxReviewsPerSession: settings?.maxReviewsPerSession ?? 20,
      newCardsPerDay: settings?.newCardsPerDay ?? 10,
      desiredDifficulty: settings?.desiredDifficulty ?? 'any',
      profileId: profile.id,
      seed: crypto.randomUUID(),
    });
    setStudySession(created.session); setSession(created.questions); setIndex(0); setRevealed(false); setSelectedChoice(undefined); setSessionRatings([]); setQuestionStartedAt(Date.now()); setView('study');
  };
  const answer = async (rating: ReviewRating) => {
    if (!profile || !session[index]) return;
    const responseTimeMs = Math.max(0, Date.now() - questionStartedAt);
    triggerFeedback(settings, rating === 'again' ? 'neutral' : 'positive');
    const result = await saveReview(profile.id, session[index].id, rating, states, new Date(), responseTimeMs, studySession);
    setSessionRatings(x => [...x, rating]);
    await refresh();
    if (result.session) setStudySession(result.session);
    if (index + 1 < session.length) { setIndex(i => i + 1); setQuestionStartedAt(Date.now()); setRevealed(false); setSelectedChoice(undefined); }
    else setIndex(session.length);
  };
  const selectProfile = (id: string) => { setActiveId(id); localStorage.setItem('flashmemory.profile', id); setView('home'); };
  const q = session[index];
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (view !== 'study') return; if (event.code === 'Space' && !revealed && q?.type !== 'multiple-choice') { event.preventDefault(); setRevealed(true); } if (revealed && ['1', '2', '3', '4'].includes(event.key)) void answer((['again', 'hard', 'good', 'easy'] as ReviewRating[])[Number(event.key) - 1]); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [view, revealed, answer, q]);
  const createAdditionalProfile = async (name: string) => {
    if (!profile) return;
    const created = await createProfile(name, profile.activeTopics, 'any');
    await refreshProfiles();
    selectProfile(created.id);
  };
  const deleteActiveProfile = async () => {
    if (!profile) return;
    await deleteProfile(profile.id);
    const remaining = (await profileRepo.all()).filter(candidate => candidate.id !== profile.id);
    await refreshProfiles();
    setSession([]); setStudySession(undefined); setIndex(0);
    if (remaining.length) {
      const next = remaining[0];
      setActiveId(next.id);
      localStorage.setItem('flashmemory.profile', next.id);
      setView('home');
    } else {
      localStorage.removeItem('flashmemory.profile');
      setActiveId(undefined);
      setOnboarding(true);
    }
  };
  const pwaNotices = <PwaNotices isOffline={isOffline} hasUpdate={Boolean(pendingUpdate)} onActivateUpdate={activateUpdate} />;
  if (profilesLoading) return <>{pwaNotices}<main className="loading-screen" aria-busy="true"><p>Chargement de votre espace…</p></main></>;
  if (onboarding || !profile) return <>{pwaNotices}<Onboarding onDone={async (name, topics, level) => { const p = await createProfile(name, topics, level); await refreshProfiles(); setActiveId(p.id); localStorage.setItem('flashmemory.profile', p.id); const created = await createStudySession({ questions: QUESTIONS, states: [], events: [], topics: p.activeTopics, mode: 'daily', maxReviewsPerSession: 10, newCardsPerDay: 10, desiredDifficulty: 'any', profileId: p.id, seed: crypto.randomUUID() }); setStudySession(created.session); setSession(created.questions); setIndex(0); setSelectedChoice(undefined); setQuestionStartedAt(Date.now()); setRevealed(false); setOnboarding(false); setView('study'); }} /></>;
  return <>{pwaNotices}<div className="shell"><header className="topbar"><button className="brand" onClick={() => setView('home')} aria-label="Accueil"><span className="brand-mark">✦</span> flashmemory</button><div className="profile-chip"><span>{profile.name.slice(0, 1).toUpperCase()}</span><select value={profile.id} onChange={e => selectProfile(e.target.value)} aria-label="Profil actif">{profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div></header>
    <main>{view === 'home' && <Home profile={profile} stats={stats} states={states} activeSession={studySession} onStart={() => void start()} onResume={() => { setIndex(studySession?.currentIndex ?? 0); setView('study'); }} onReview={() => void start('review')} onDiscover={() => void start('discover')} onFree={() => void start('free', CATEGORIES)} onTopic={topic => void start('topic', [topic])} />}
      {view === 'study' && <Study q={q} index={index} total={session.length} revealed={revealed} setRevealed={setRevealed} selectedChoice={selectedChoice} setSelectedChoice={setSelectedChoice} ratings={sessionRatings} onAnswer={answer} onHome={() => setView('home')} settings={settings} />}
      {view === 'topics' && <Topics profile={profile} onSave={async p => { await profileRepo.put(p); await refreshProfiles(); }} />}
      {view === 'stats' && <Stats stats={stats} period={statsPeriod} onPeriodChange={setStatsPeriod} />}
      {view === 'explore' && <Explore states={states} events={events} search={search} setSearch={setSearch} />}
      {view === 'settings' && <Settings settings={settings} onSave={async next => { if (next) { await settingsRepo.put(next); setSettings(next); } }} profile={profile} onRename={async name => { const p = await renameProfile(profile, name); await profileRepo.put(p); await refreshProfiles(); }} onManageProfiles={() => setView('profiles')} onExport={async () => { const b = await exportProfile(profile); download(JSON.stringify(b, null, 2), `flashmemory-${profile.name}.json`, 'application/json'); }} onImport={async file => { try { const b: unknown = JSON.parse(await file.text()); await importProfile(b); await refreshProfiles(); alert('Profil importé.'); } catch (e) { alert(e instanceof Error ? e.message : 'Import impossible.'); } }} />}
      {view === 'profiles' && <Profiles profiles={profiles} activeId={profile.id} onBack={() => setView('settings')} onSelect={selectProfile} onCreate={createAdditionalProfile} onDelete={deleteActiveProfile} />}
    </main><nav className="bottom-nav" aria-label="Navigation principale">{([['home','Aujourd’hui','⌂'],['topics','Thèmes','◈'],['explore','Explorer','⌕'],['stats','Stats','◒'],['settings','Réglages','⚙']] as const).map(([v, label, icon]) => <button key={v} className={view === v ? 'active' : ''} aria-current={view === v ? 'page' : undefined} onClick={() => setView(v)}><b aria-hidden="true">{icon}</b><small>{label}</small></button>)}</nav></div></>;
}

function PwaNotices({ isOffline, hasUpdate, onActivateUpdate }: { isOffline: boolean; hasUpdate: boolean; onActivateUpdate: () => void }) {
  if (!isOffline && !hasUpdate) return null;
  return <div className="pwa-notices" aria-live="polite">
    {isOffline && <div className="pwa-banner offline" role="status"><span aria-hidden="true">⌁</span><span>Hors connexion · vos progrès restent enregistrés sur cet appareil.</span></div>}
    {hasUpdate && <div className="pwa-banner update" role="status"><span>Une nouvelle version est disponible.</span><button type="button" onClick={onActivateUpdate}>Recharger</button></div>}
  </div>;
}

function Home({ profile, stats, states, activeSession, onStart, onResume, onReview, onDiscover, onFree, onTopic }: { profile: Profile; stats: ReturnType<typeof calculateStatistics>; states: ReturnType<typeof useAppData>['states']; activeSession?: StudySession; onStart: () => void; onResume: () => void; onReview: () => void; onDiscover: () => void; onFree: () => void; onTopic: (topic: string) => void }) {
  const due = states.filter(s => new Date(s.dueAt) <= new Date()).length;
  const fresh = profile.activeTopics.reduce((n, c) => n + QUESTIONS.filter(q => q.category === c && !states.some(s => s.questionId === q.id)).length, 0);
  const hasResume = activeSession?.status === 'active' && activeSession.currentIndex < activeSession.questionIds.length;
  const [topic, setTopic] = useState(profile.activeTopics[0] ?? '');
  return <section className="page home"><p className="eyebrow">Bonjour {profile.name} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p><h1>Votre moment de curiosité.</h1>
    {hasResume && <div className="resume-card"><div><span className="kicker">Session en cours</span><h2>Reprendre où vous en étiez</h2><p>{activeSession.questionIds.length - activeSession.currentIndex} question{activeSession.questionIds.length - activeSession.currentIndex > 1 ? 's' : ''} restante{activeSession.questionIds.length - activeSession.currentIndex > 1 ? 's' : ''}</p></div><button className="primary" onClick={onResume}>Continuer <span>→</span></button></div>}
    <div className="hero-card"><div><span className="kicker">Aujourd’hui</span><h2>{due} révision{due > 1 ? 's' : ''}</h2><p>{Math.min(fresh, 10)} nouvelle{fresh > 1 ? 's' : ''} question{fresh > 1 ? 's' : ''} disponible{fresh > 1 ? 's' : ''}</p></div><button className="primary big" onClick={onStart}>{hasResume ? 'Nouvelle session' : 'Commencer'} <span>→</span></button></div>
    <div className="quick-actions"><button onClick={onReview}>Révisions uniquement</button><button onClick={onDiscover}>Découvrir</button><button onClick={onFree}>Quiz libre</button></div>
    <div className="topic-launch"><label>Réviser un thème<select value={topic} onChange={event => setTopic(event.target.value)}>{profile.activeTopics.map(value => <option key={value} value={value}>{value}</option>)}</select></label><button className="primary" disabled={!topic} onClick={() => onTopic(topic)}>Lancer</button></div>
    <div className="stat-row"><div><strong>{stats.streak}</strong><span>jours de série</span></div><div><strong>{stats.seen}</strong><span>questions vues</span></div><div><strong>{stats.successRate}%</strong><span>taux de réussite</span></div></div><p className="muted small streak-rule">La série avance après 3 révisions dans une même journée.</p><h3>Vos thèmes</h3><div className="topic-pills">{profile.activeTopics.slice(0, 6).map(t => <span key={t}>{t}</span>)}</div></section>;
}
function Study({ q, index, total, revealed, setRevealed, selectedChoice, setSelectedChoice, ratings, onAnswer, onHome, settings }: { q?: Question; index: number; total: number; revealed: boolean; setRevealed: (v: boolean) => void; selectedChoice?: number; setSelectedChoice: (v: number | undefined) => void; ratings: ReviewRating[]; onAnswer: (r: ReviewRating) => void; onHome: () => void; settings?: ReturnType<typeof useAppData>['settings'] }) {
  if (!q || index >= total) return <section className="page session-end"><div className="end-icon">✓</div><p className="eyebrow">Session terminée</p><h1>Bien joué.</h1><p>{total} question{total > 1 ? 's' : ''} parcourue{total > 1 ? 's' : ''} · {ratings.filter(r => r !== 'again').length} à retenir</p><button className="primary" onClick={onHome}>Retour à l’accueil</button></section>;
  const choose = (choice: number) => { setSelectedChoice(choice); setRevealed(true); triggerFeedback(settings, choice === q.correctChoice ? 'positive' : 'neutral'); };
  return <section className="page study"><div className="study-head"><button className="text-button" onClick={onHome}>× Quitter</button><span>{index + 1} / {total}</span></div><div className="progress" role="progressbar" aria-label="Progression de la session" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index + 1}><i style={{ width: `${((index + 1) / total) * 100}%` }} /></div><article className={`question-card${revealed ? ' is-revealed' : ''}`}><div className="question-meta"><span>{q.category}</span><span>Niveau {q.difficulty}/5</span></div><h1>{q.question}</h1>{q.type === 'multiple-choice' && <div className="choices" role="group" aria-label="Propositions de réponse">{q.choices?.map((c, i) => { const correct = revealed && i === q.correctChoice; const selected = selectedChoice === i; return <button key={c} type="button" disabled={revealed} aria-pressed={selected} className={[correct ? 'correct' : '', selected ? 'selected' : '', selected && !correct ? 'wrong' : ''].filter(Boolean).join(' ')} onClick={() => choose(i)}>{String.fromCharCode(65 + i)} <span>{c}</span>{correct && <b aria-label="Bonne réponse">✓</b>}</button>; })}</div>}{revealed && q.type === 'multiple-choice' && selectedChoice !== undefined && <p className={`choice-feedback ${selectedChoice === q.correctChoice ? 'positive' : 'neutral'}`} role="status">{selectedChoice === q.correctChoice ? 'Bonne réponse.' : `La bonne réponse était ${q.answer}.`}</p>}{!revealed && q.type !== 'multiple-choice' && <button className="primary reveal" onClick={() => setRevealed(true)}>Afficher la réponse <kbd>Espace</kbd></button>}{revealed && <div className="answer"><p className="answer-label">Réponse</p><h2>{q.answer}</h2><p>{q.explanation}</p><QuestionSource question={q} /></div>}{revealed && <div className="rating-grid">{(['again','hard','good','easy'] as ReviewRating[]).map((r, i) => <button key={r} className={`rating ${r}`} onClick={() => onAnswer(r)}><kbd>{i + 1}</kbd>{ratingLabels[r]}<small>{r === 'again' ? '10 min' : r === 'hard' ? 'demain' : r === 'good' ? 'quelques jours' : 'plus tard'}</small></button>)}</div>}</article></section>;
}
function QuestionSource({ question }: { question: Question }) { const { provenance } = question; const isEditorialPointer = provenance.method === 'editorial-review-with-source-pointer'; const label = isEditorialPointer ? 'Piste de contrôle' : 'Source approuvée'; return <p className="question-source"><span>{label} · {provenance.source}</span><a href={provenance.url} target="_blank" rel="noreferrer" aria-label={`Consulter : ${provenance.source}`}>{isEditorialPointer ? 'Rechercher ↗' : 'Consulter ↗'}</a></p>; }
function Topics({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => Promise<void> }) { const [active, setActive] = useState(profile.activeTopics); const toggle = (t: string) => setActive(x => x.includes(t) ? x.filter(a => a !== t) : [...x, t]); return <section className="page"><p className="eyebrow">Personnalisez votre parcours</p><h1>Thèmes actifs</h1><p className="muted">Choisissez les domaines qui vous donnent envie d’apprendre.</p><div className="topic-actions" role="group" aria-label="Sélection rapide des thèmes"><button type="button" onClick={() => setActive([...TOPICS])}>Tout sélectionner</button><button type="button" onClick={() => setActive([])}>Tout désélectionner</button></div><div className="topic-list">{TOPICS.map(t => <button type="button" aria-pressed={active.includes(t)} className={active.includes(t) ? 'selected' : ''} key={t} onClick={() => toggle(t)}><span aria-hidden="true">{active.includes(t) ? '✓' : '+'}</span>{t}</button>)}</div><div className="sticky-action"><button className="primary" disabled={!active.length} onClick={() => void onSave({ ...profile, activeTopics: active })}>Enregistrer</button></div></section>; }
const periodLabels: Record<StatisticsPeriod, string> = { today: 'Aujourd’hui', '7d': '7 jours', '30d': '30 jours', all: 'Tout' };
function Stats({ stats, period, onPeriodChange }: { stats: ReturnType<typeof calculateStatistics>; period: StatisticsPeriod; onPeriodChange: (period: StatisticsPeriod) => void }) { return <section className="page"><p className="eyebrow">Votre progression</p><h1>Des petits pas, souvent.</h1><div className="period-picker" role="group" aria-label="Période des statistiques">{(Object.keys(periodLabels) as StatisticsPeriod[]).map(option => <button key={option} className={period === option ? 'selected' : ''} aria-pressed={period === option} onClick={() => onPeriodChange(option)}>{periodLabels[option]}</button>)}</div><div className="metric-grid"><Metric value={String(stats.answers)} label="réponses"/><Metric value={`${stats.successRate}%`} label="taux de réussite"/><Metric value={String(stats.seen)} label="questions vues"/><Metric value={String(stats.learned)} label="questions apprises"/><Metric value={String(stats.mastered)} label="questions maîtrisées"/><Metric value={String(stats.forgotten)} label="questions oubliées"/><Metric value={String(stats.streak)} label="jours de série"/><Metric value={`${stats.minutes} min`} label="temps passé (estimé)"/></div><p className="muted small">Fenêtre : {periodLabels[period]} · les cartes et catégories sont recalculées depuis vos événements et états de révision.</p><p className="muted small streak-rule">Règle de série : une journée compte à partir de 3 révisions, sans obligation de terminer toutes les cartes dues.</p><h3>Progression par catégorie</h3>{Object.keys(stats.byCategory).length ? Object.entries(stats.byCategory).sort(([,a],[,b]) => b - a).slice(0, 12).map(([c, v]) => <div className="category-bar" key={c}><span>{c}</span><b>{Math.round(v)}%</b><i><em style={{ width: `${Math.min(100, v)}%` }} /></i></div>) : <p className="muted">Aucune réponse dans cette période.</p>}</section>; }
function Metric({ value, label }: { value: string; label: string }) { return <div className="metric"><strong>{value}</strong><span>{label}</span></div>; }
type ExploreStatus = 'all' | 'seen' | 'unseen' | 'mastered' | 'difficult';
const ratingHistoryLabels: Record<ReviewRating, string> = { again: 'À revoir', hard: 'Difficile', good: 'Correct', easy: 'Facile' };
function Explore({ states, events, search, setSearch }: { states: ReturnType<typeof useAppData>['states']; events: ReviewEvent[]; search: string; setSearch: (s: string) => void }) {
  const [category, setCategory] = useState('all'); const [subcategory, setSubcategory] = useState('all'); const [difficulty, setDifficulty] = useState('all'); const [status, setStatus] = useState<ExploreStatus>('all'); const [selected, setSelected] = useState<Question>();
  const stateByQuestion = new Map(states.map(state => [state.questionId, state]));
  const subcategories = [...new Set(QUESTIONS.filter(question => category === 'all' || question.category === category).map(question => question.subcategory).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, 'fr'));
  const lower = search.trim().toLocaleLowerCase('fr');
  const items = QUESTIONS.filter(question => {
    const state = stateByQuestion.get(question.id); const isSeen = Boolean(state?.reviewCount); const isMastered = (state?.stability ?? 0) >= 30; const isDifficult = Boolean(state && (state.lapseCount > 0 || state.lastRating === 'again' || state.difficulty >= 6));
    const searchable = `${question.question} ${question.answer} ${question.explanation} ${question.category} ${question.subcategory ?? ''} ${(question.tags ?? []).join(' ')}`.toLocaleLowerCase('fr');
    return (!lower || searchable.includes(lower)) && (category === 'all' || question.category === category) && (subcategory === 'all' || question.subcategory === subcategory) && (difficulty === 'all' || question.difficulty === Number(difficulty)) && (status === 'all' || (status === 'seen' && isSeen) || (status === 'unseen' && !isSeen) || (status === 'mastered' && isMastered) || (status === 'difficult' && isDifficult));
  });
  const selectedState = selected ? stateByQuestion.get(selected.id) : undefined; const selectedHistory = selected ? events.filter(event => event.questionId === selected.id).sort((a, b) => Date.parse(b.reviewedAt) - Date.parse(a.reviewedAt)) : [];
  const statusLabel = (question: Question) => { const state = stateByQuestion.get(question.id); if (!state?.reviewCount) return 'nouvelle'; if ((state.stability ?? 0) >= 30) return 'maîtrisée'; if (state.lapseCount > 0 || state.lastRating === 'again' || state.difficulty >= 6) return 'difficile'; return 'vue'; };
  return <section className="page"><p className="eyebrow">Le catalogue</p><h1>Explorer</h1><label className="sr-only" htmlFor="explore-search">Rechercher dans le catalogue</label><input id="explore-search" className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une question…" /><div className="explore-filters"><label>Catégorie<select value={category} onChange={e => { setCategory(e.target.value); setSubcategory('all'); }}><option value="all">Toutes</option>{CATEGORIES.map(value => <option key={value} value={value}>{value}</option>)}</select></label><label>Sous-catégorie<select value={subcategory} onChange={e => setSubcategory(e.target.value)}><option value="all">Toutes</option>{subcategories.map(value => <option key={value} value={value}>{value}</option>)}</select></label><label>Difficulté<select value={difficulty} onChange={e => setDifficulty(e.target.value)}><option value="all">Toutes</option>{[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>Niveau {value}/5</option>)}</select></label><label>Statut<select value={status} onChange={e => setStatus(e.target.value as ExploreStatus)}><option value="all">Toutes</option><option value="seen">Déjà vue</option><option value="unseen">Jamais vue</option><option value="mastered">Maîtrisée</option><option value="difficult">Difficile pour moi</option></select></label></div><p className="muted">{items.length} question{items.length > 1 ? 's' : ''} · {CATEGORIES.length} thèmes</p><div className="explore-list">{items.map(question => <article key={question.id}><button className="explore-card-trigger" onClick={() => setSelected(question)} aria-label={`Ouvrir ${question.question}`}><div><span className="tag">{question.category}{question.subcategory ? ` · ${question.subcategory}` : ''}</span><h3>{question.question}</h3><p>{question.answer}</p></div><span className={statusLabel(question) === 'nouvelle' ? 'new-dot' : 'seen-dot'}>{statusLabel(question)}</span></button></article>)}</div>{selected && <div className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="explore-detail-title"><div className="detail-head"><div><span className="tag">{selected.category}{selected.subcategory ? ` · ${selected.subcategory}` : ''}</span><h2 id="explore-detail-title">Détail de la question</h2></div><button className="text-button" onClick={() => setSelected(undefined)} aria-label="Fermer le détail">× Fermer</button></div><h3>{selected.question}</h3><p className="answer-label">Réponse</p><p className="detail-answer">{selected.answer}</p><p className="answer-label">Explication</p><p>{selected.explanation}</p><QuestionSource question={selected} /><h3>Votre historique</h3>{selectedState && <p className="muted small">{selectedState.reviewCount} réponse{selectedState.reviewCount > 1 ? 's' : ''} · {selectedState.lapseCount} oubli{selectedState.lapseCount > 1 ? 's' : ''} · stabilité {Math.round(selectedState.stability)} jours</p>}{selectedHistory.length ? <ul className="history-list">{selectedHistory.map(event => <li key={event.id}><span>{new Date(event.reviewedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span><b>{ratingHistoryLabels[event.rating]}</b>{event.responseTimeMs !== undefined && <small>{Math.round(event.responseTimeMs / 1000)} s</small>}</li>)}</ul> : <p className="muted">Aucune réponse enregistrée pour cette question.</p>}</div>}</section>;
}
function Settings({ settings, profile, onSave, onRename, onManageProfiles, onExport, onImport }: { settings?: ReturnType<typeof useAppData>['settings']; profile: Profile; onSave: (s?: NonNullable<ReturnType<typeof useAppData>['settings']>) => Promise<void>; onRename: (n: string) => Promise<void>; onManageProfiles: () => void; onExport: () => Promise<void>; onImport: (f: File) => Promise<void> }) { const [name, setName] = useState(profile.name); if (!settings) return null; return <section className="page"><p className="eyebrow">Votre espace</p><h1>Réglages</h1><label className="field">Nom du profil<input value={name} onChange={e => setName(e.target.value)} onBlur={() => { if (name.trim() && name !== profile.name) void onRename(name); }} /></label><button className="profile-management-button" onClick={onManageProfiles}>Gérer les profils</button><h3>Apprentissage</h3><label className="field">Nouvelles questions par jour<input type="number" min="1" max="50" value={settings.newCardsPerDay} onChange={e => void onSave({ ...settings, newCardsPerDay: Number(e.target.value) })} /></label><label className="field">Maximum par session<input type="number" min="5" max="100" value={settings.maxReviewsPerSession} onChange={e => void onSave({ ...settings, maxReviewsPerSession: Number(e.target.value) })} /></label><label className="field">Difficulté des nouvelles questions<select value={settings.desiredDifficulty} onChange={e => { const value = e.target.value === 'any' ? 'any' : Number(e.target.value) as 1 | 2 | 3 | 4 | 5; void onSave({ ...settings, desiredDifficulty: value }); }}><option value="any">Toutes les difficultés</option>{[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>Niveau {value}/5</option>)}</select></label><p className="muted small">Ce choix classe les nouvelles cartes par proximité. Les cartes déjà dues restent prioritaires.</p><label className="toggle-field"><input type="checkbox" checked={settings.sound} onChange={e => void onSave({ ...settings, sound: e.target.checked })} /> Son des feedbacks</label><label className="toggle-field"><input type="checkbox" checked={settings.haptics} onChange={e => void onSave({ ...settings, haptics: e.target.checked })} /> Vibrations (si disponibles)</label><h3>Apparence</h3><label className="field">Mode couleur<select value={settings.theme} onChange={e => void onSave({ ...settings, theme: e.target.value as 'light' | 'dark' | 'system' })}><option value="system">Système</option><option value="light">Clair</option><option value="dark">Sombre</option></select></label><h3>Données</h3><div className="settings-actions"><button onClick={() => void onExport()}>Exporter mon profil</button><label className="file-button">Importer un profil<input type="file" accept="application/json" onChange={e => { const f = e.target.files?.[0]; if (f) void onImport(f); }} /></label></div><p className="muted small">Vos données restent sur cet appareil. L’application fonctionne sans connexion.</p></section>; }
function Profiles({ profiles, activeId, onBack, onSelect, onCreate, onDelete }: { profiles: Profile[]; activeId: string; onBack: () => void; onSelect: (id: string) => void; onCreate: (name: string) => Promise<void>; onDelete: () => Promise<void> }) { const [name, setName] = useState(''); return <section className="page profiles-page"><button className="text-button" onClick={onBack}>← Réglages</button><p className="eyebrow">Espaces indépendants</p><h1>Profils</h1><div className="profile-list">{profiles.map(candidate => <button key={candidate.id} className={candidate.id === activeId ? 'selected' : ''} onClick={() => onSelect(candidate.id)}><span className="profile-avatar">{candidate.name.slice(0, 1).toUpperCase()}</span><span>{candidate.name}</span>{candidate.id === activeId && <small>actif</small>}</button>)}</div><h3>Créer un profil supplémentaire</h3><label className="field">Nom du nouveau profil<input value={name} onChange={e => setName(e.target.value)} placeholder="Ex. Marie" /></label><button className="primary" disabled={!name.trim()} onClick={() => { void onCreate(name.trim()); setName(''); }}>Créer le profil</button><div className="danger-zone"><h3>Supprimer le profil actif</h3><p className="muted small">Toutes ses cartes, réglages et événements seront supprimés de cet appareil.</p><button className="danger-button" onClick={() => { if (window.confirm(`Supprimer définitivement le profil « ${profiles.find(candidate => candidate.id === activeId)?.name ?? ''} » et toutes ses données ?`)) void onDelete(); }}>Supprimer ce profil</button></div></section>; }
function Onboarding({ onDone }: { onDone: (name: string, topics: string[], level: Profile['level']) => Promise<void> }) { const [name, setName] = useState(''); const [topics, setTopics] = useState(['Géographie', 'Histoire', 'Sciences']); const [level, setLevel] = useState<Profile['level']>('any'); const toggle = (t: string) => setTopics(x => x.includes(t) ? x.filter(a => a !== t) : [...x, t]); return <main className="onboarding"><div className="onboard-mark">✦</div><p className="eyebrow">Bienvenue dans flashmemory</p><h1>Une idée à la fois,<br />pour longtemps.</h1><p>Répondez à de courtes questions. Nous vous les représenterons au moment où votre mémoire en a besoin.</p><label className="field">Comment vous appelez-vous ?<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Votre prénom" /></label><h3>Vos premiers thèmes</h3><div className="onboard-topics">{TOPICS.slice(0, 10).map(t => <button className={topics.includes(t) ? 'selected' : ''} key={t} onClick={() => toggle(t)}>{topics.includes(t) ? '✓ ' : ''}{t}</button>)}</div><label className="field">Votre niveau<select value={level} onChange={e => setLevel(e.target.value as Profile['level'])}><option value="any">Peu importe</option><option value="beginner">Débutant</option><option value="intermediate">Intermédiaire</option><option value="advanced">Avancé</option></select></label><button className="primary big" disabled={!name.trim() || !topics.length} onClick={() => void onDone(name, topics, level)}>Créer mon espace <span>→</span></button></main>; }
function triggerFeedback(settings: ReturnType<typeof useAppData>['settings'], tone: 'positive' | 'neutral') {
  if (settings?.haptics && typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(tone === 'positive' ? 18 : 8);
  if (!settings?.sound || typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = tone === 'positive' ? 660 : 440;
  gain.gain.setValueAtTime(0.035, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
  oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.08);
}
function download(content: string, name: string, type: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href); }
