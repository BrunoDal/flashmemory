import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Historical UN membership facts reviewed one country at a time.
 *
 * This file is intentionally a standalone batch: the catalogue entry point
 * can opt into it after the batch has been reviewed alongside the other
 * verified sources. One row is one country → one admission date; no wording
 * variants or generated repetitions are included.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'United Nations — Member States';
const LICENSE = 'United Nations website — official informational content';
const METHOD = 'Date historique reprise du répertoire officiel des États membres de l’ONU; l’URL de la fiche officielle correspondante est conservée pour audit manuel. Une relation pays–date indépendante par ligne, sans variante générée. Les pages n’ont pas été récupérées directement dans cet environnement.';

type MembershipRow = readonly [slug: string, country: string, date: string, isoDate: string];

const MEMBERSHIPS: readonly MembershipRow[] = [
  ['afghanistan', 'l’Afghanistan', '19 novembre 1946', '1946-11-19'],
  ['iceland', 'l’Islande', '19 novembre 1946', '1946-11-19'],
  ['sweden', 'la Suède', '19 novembre 1946', '1946-11-19'],
  ['thailand', 'la Thaïlande', '15 décembre 1946', '1946-12-15'],
  ['pakistan', 'le Pakistan', '30 septembre 1947', '1947-09-30'],
  ['yemen', 'le Yémen', '30 septembre 1947', '1947-09-30'],
  ['myanmar', 'le Myanmar', '19 avril 1948', '1948-04-19'],
  ['israel', 'Israël', '11 mai 1949', '1949-05-11'],
  ['libya', 'la Libye', '14 décembre 1955', '1955-12-14'],
  ['sudan', 'le Soudan', '12 novembre 1956', '1956-11-12'],
  ['morocco', 'le Maroc', '12 novembre 1956', '1956-11-12'],
  ['tunisia', 'la Tunisie', '12 novembre 1956', '1956-11-12'],
  ['ghana', 'le Ghana', '8 mars 1957', '1957-03-08'],
  ['malaysia', 'la Malaisie', '17 septembre 1957', '1957-09-17'],
  ['guinea', 'la Guinée', '12 décembre 1958', '1958-12-12'],
  ['benin', 'le Bénin', '20 septembre 1960', '1960-09-20'],
  ['burkina-faso', 'le Burkina Faso', '20 septembre 1960', '1960-09-20'],
  ['cameroon', 'le Cameroun', '20 septembre 1960', '1960-09-20'],
  ['central-african-republic', 'la République centrafricaine', '20 septembre 1960', '1960-09-20'],
  ['chad', 'le Tchad', '20 septembre 1960', '1960-09-20'],
  ['congo', 'le Congo (Brazzaville)', '20 septembre 1960', '1960-09-20'],
  ['cote-divoire', 'la Côte d’Ivoire', '20 septembre 1960', '1960-09-20'],
  ['cyprus', 'Chypre', '20 septembre 1960', '1960-09-20'],
  ['democratic-republic-of-the-congo', 'la République démocratique du Congo (Kinshasa)', '20 septembre 1960', '1960-09-20'],
  ['gabon', 'le Gabon', '20 septembre 1960', '1960-09-20'],
  ['madagascar', 'Madagascar', '20 septembre 1960', '1960-09-20'],
  ['mali', 'le Mali', '28 septembre 1960', '1960-09-28'],
  ['niger', 'le Niger', '20 septembre 1960', '1960-09-20'],
  ['senegal', 'le Sénégal', '28 septembre 1960', '1960-09-28'],
  ['somalia', 'la Somalie', '20 septembre 1960', '1960-09-20'],
  ['togo', 'le Togo', '20 septembre 1960', '1960-09-20'],
  ['nigeria', 'le Nigeria', '7 octobre 1960', '1960-10-07'],
  ['mauritania', 'la Mauritanie', '27 octobre 1961', '1961-10-27'],
  ['sierra-leone', 'la Sierra Leone', '27 septembre 1961', '1961-09-27'],
  ['tanzania', 'la Tanzanie', '14 décembre 1961', '1961-12-14'],
  ['algeria', 'l’Algérie', '8 octobre 1962', '1962-10-08'],
  ['rwanda', 'le Rwanda', '18 septembre 1962', '1962-09-18'],
  ['burundi', 'le Burundi', '18 septembre 1962', '1962-09-18'],
  ['jamaica', 'la Jamaïque', '18 septembre 1962', '1962-09-18'],
  ['trinidad-and-tobago', 'Trinité-et-Tobago', '18 septembre 1962', '1962-09-18'],
  ['uganda', 'l’Ouganda', '25 octobre 1962', '1962-10-25'],
  ['kuwait', 'le Koweït', '14 mai 1963', '1963-05-14'],
  ['kenya', 'le Kenya', '16 décembre 1963', '1963-12-16'],
  ['malawi', 'le Malawi', '1 décembre 1964', '1964-12-01'],
  ['zambia', 'la Zambie', '1 décembre 1964', '1964-12-01'],
  ['gambia', 'la Gambie', '21 septembre 1965', '1965-09-21'],
  ['singapore', 'Singapour', '21 septembre 1965', '1965-09-21'],
  ['guyana', 'le Guyana', '20 septembre 1966', '1966-09-20'],
  ['botswana', 'le Botswana', '17 octobre 1966', '1966-10-17'],
  ['lesotho', 'le Lesotho', '17 octobre 1966', '1966-10-17'],
  ['barbados', 'la Barbade', '9 décembre 1966', '1966-12-09'],
  ['mauritius', 'Maurice', '24 avril 1968', '1968-04-24'],
  ['eswatini', 'l’Eswatini', '24 septembre 1968', '1968-09-24'],
  ['equatorial-guinea', 'la Guinée équatoriale', '12 novembre 1968', '1968-11-12'],
  ['bahrain', 'Bahreïn', '21 septembre 1971', '1971-09-21'],
  ['bhutan', 'le Bhoutan', '21 septembre 1971', '1971-09-21'],
  ['qatar', 'le Qatar', '21 septembre 1971', '1971-09-21'],
  ['united-arab-emirates', 'les Émirats arabes unis', '9 décembre 1971', '1971-12-09'],
  ['bangladesh', 'le Bangladesh', '17 septembre 1974', '1974-09-17'],
  ['grenada', 'la Grenade', '17 septembre 1974', '1974-09-17'],
  ['guinea-bissau', 'la Guinée-Bissau', '17 septembre 1974', '1974-09-17'],
  ['cape-verde', 'le Cabo Verde', '16 septembre 1975', '1975-09-16'],
  ['mozambique', 'le Mozambique', '16 septembre 1975', '1975-09-16'],
  ['sao-tome-and-principe', 'Sao Tomé-et-Principe', '16 septembre 1975', '1975-09-16'],
  ['angola', 'l’Angola', '1 décembre 1976', '1976-12-01'],
  ['seychelles', 'les Seychelles', '21 septembre 1976', '1976-09-21'],
  ['djibouti', 'Djibouti', '20 septembre 1977', '1977-09-20'],
  ['vietnam', 'le Viet Nam', '20 septembre 1977', '1977-09-20'],
  ['dominica', 'la Dominique', '18 décembre 1978', '1978-12-18'],
  ['solomon-islands', 'les Îles Salomon', '19 septembre 1978', '1978-09-19'],
  ['saint-lucia', 'Sainte-Lucie', '18 septembre 1979', '1979-09-18'],
  ['saint-vincent-and-the-grenadines', 'Saint-Vincent-et-les-Grenadines', '16 septembre 1980', '1980-09-16'],
  ['zimbabwe', 'le Zimbabwe', '25 août 1980', '1980-08-25'],
  ['antigua-and-barbuda', 'Antigua-et-Barbuda', '11 novembre 1981', '1981-11-11'],
  ['belize', 'le Belize', '25 septembre 1981', '1981-09-25'],
  ['vanuatu', 'le Vanuatu', '15 septembre 1981', '1981-09-15'],
  ['namibia', 'la Namibie', '23 avril 1990', '1990-04-23'],
  ['liechtenstein', 'le Liechtenstein', '18 septembre 1990', '1990-09-18'],
  ['estonia', 'l’Estonie', '17 septembre 1991', '1991-09-17'],
  ['latvia', 'la Lettonie', '17 septembre 1991', '1991-09-17'],
  ['lithuania', 'la Lituanie', '17 septembre 1991', '1991-09-17'],
  ['armenia', 'l’Arménie', '2 mars 1992', '1992-03-02'],
  ['azerbaijan', 'l’Azerbaïdjan', '2 mars 1992', '1992-03-02'],
  ['kazakhstan', 'le Kazakhstan', '2 mars 1992', '1992-03-02'],
  ['kyrgyzstan', 'le Kirghizistan', '2 mars 1992', '1992-03-02'],
  ['moldova', 'la Moldavie', '2 mars 1992', '1992-03-02'],
  ['tajikistan', 'le Tadjikistan', '2 mars 1992', '1992-03-02'],
  ['turkmenistan', 'le Turkménistan', '2 mars 1992', '1992-03-02'],
  ['uzbekistan', 'l’Ouzbékistan', '2 mars 1992', '1992-03-02'],
  ['georgia', 'la Géorgie', '31 juillet 1992', '1992-07-31'],
  ['croatia', 'la Croatie', '22 mai 1992', '1992-05-22'],
  ['bosnia-and-herzegovina', 'la Bosnie-Herzégovine', '22 mai 1992', '1992-05-22'],
  ['slovenia', 'la Slovénie', '22 mai 1992', '1992-05-22'],
  ['north-macedonia', 'la Macédoine du Nord', '8 avril 1993', '1993-04-08'],
  ['czechia', 'la Tchéquie', '19 janvier 1993', '1993-01-19'],
  ['slovakia', 'la Slovaquie', '19 janvier 1993', '1993-01-19'],
  ['andorra', 'Andorre', '28 juillet 1993', '1993-07-28'],
  ['eritrea', 'l’Érythrée', '28 mai 1993', '1993-05-28'],
  ['monaco', 'Monaco', '28 mai 1993', '1993-05-28'],
] as const;

const provenanceFor = (slug: string, factId: string): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: ({
    'cote-divoire': 'https://www.un.org/en/node/123846',
    czechia: 'https://www.un.org/en/node/123300',
    slovakia: 'https://www.un.org/en/node/123300',
    tanzania: 'https://www.un.org/en/node/122916',
  } as Record<string, string>)[slug] ?? `https://www.un.org/en/about-us/member-states/${slug}`,
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_UN_MEMBERSHIP_QUESTIONS: readonly Question[] = MEMBERSHIPS.map(([slug, country, date, isoDate]) => {
  const factId = `institutions-un-admission-${slug}`;
  return {
    id: factId,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Institutions',
    subcategory: 'Organisation des Nations unies',
    question: `Quelle est la date d’admission de ${country} à l’Organisation des Nations unies ?`,
    answer: date,
    acceptedAnswers: [date, isoDate],
    explanation: `L’admission de ${country} à l’Organisation des Nations unies a eu lieu le ${date}.`,
    difficulty: 3,
    tags: ['institutions', 'onu', 'adhésion', 'histoire'],
    source: SOURCE,
    provenance: provenanceFor(slug, factId),
  };
});

export const VERIFIED_UN_MEMBERSHIP_BATCH: VerifiedContentBatch = {
  id: 'un-member-admission-dates-2026-09',
  questions: VERIFIED_UN_MEMBERSHIP_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://www.un.org/en/about-us/member-states',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_UN_MEMBERSHIP_BATCH;
