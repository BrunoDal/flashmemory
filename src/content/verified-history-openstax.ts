import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent history claims checked against the OpenStax World History
 * volumes.  Each row is a single claim; the catalogue does not manufacture
 * variants from these rows.  Chapter URLs are kept on each card so an editor
 * can re-check the exact context rather than relying on this file as an
 * opaque fact dump.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax World History, Volumes 1 and 2';
const LICENSE = 'CC BY-NC-SA 4.0';
const METHOD = 'manual editorial check against the cited OpenStax chapter; one independent historical claim per card; no generated variants';

type Volume = 1 | 2;
type Row = readonly [
  id: string,
  subcategory: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: 1 | 2 | 3,
  volume: Volume,
  chapter: number,
];

const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  row('akkadian-empire-founder', 'Proche-Orient ancien', 'Quel souverain est généralement considéré comme le fondateur de l’Empire akkadien ?', 'Sargon d’Akkad', 'Sargon unifie sous son autorité de vastes territoires de Mésopotamie au troisième millénaire avant notre ère.', 2, 1, 4),
  row('hammurabi-code', 'Proche-Orient ancien', 'Quel roi de Babylone est associé au célèbre recueil de lois gravé sur une stèle ?', 'Hammurabi', 'Le Code de Hammurabi est une compilation juridique royale du XVIIIe siècle avant notre ère.', 1, 1, 4),
  row('ziggurat-function', 'Proche-Orient ancien', 'À quoi servait principalement une ziggurat mésopotamienne ?', 'De plateforme monumentale pour un complexe religieux', 'Les ziggurats étaient des constructions à degrés liées aux temples des cités mésopotamiennes.', 1, 1, 4),
  row('phoenician-alphabet', 'Proche-Orient ancien', 'Quelle contribution des Phéniciens a fortement influencé les alphabets ultérieurs ?', 'Un alphabet consonantique largement diffusé par les échanges', 'L’écriture phénicienne a contribué à la transmission de principes alphabétiques vers le monde grec et au-delà.', 2, 1, 4),
  row('assyrian-capital-nineveh', 'Proche-Orient ancien', 'Quelle ville fut la capitale de l’Empire assyrien à son apogée ?', 'Ninive', 'Ninive, sur le Tigre, devint un centre politique et culturel majeur de l’Empire néo-assyrien.', 1, 1, 4),
  row('persian-royal-road', 'Empires anciens', 'Quel empire acheva et entretint la Route royale reliant notamment Sardes à Suse ?', 'L’Empire achéménide', 'La Route royale facilitait les déplacements, les communications et l’administration de l’empire perse.', 2, 1, 4),
  row('satrapy-persian-administration', 'Empires anciens', 'Comment appelait-on les grandes provinces administratives de l’Empire achéménide ?', 'Des satrapies', 'Les satrapies étaient gouvernées par des satrapes sous l’autorité du roi des rois.', 1, 1, 4),
  row('egypt-hatshepsut', 'Égypte ancienne', 'Quelle souveraine égyptienne régna comme pharaon au cours de la XVIIIe dynastie ?', 'Hatchepsout', 'Hatchepsout adopta les attributs royaux et fit construire de grands monuments, dont son temple funéraire à Deir el-Bahari.', 1, 1, 5),
  row('egypt-new-kingdom', 'Égypte ancienne', 'Quelle période de l’histoire égyptienne est connue pour l’expansion impériale de Thoutmosis III et de Ramsès II ?', 'Le Nouvel Empire', 'Le Nouvel Empire correspond à une période de puissance égyptienne approximativement située entre les XVIe et XIe siècles avant notre ère.', 1, 1, 5),
  row('rosetta-stone-decipherment', 'Égypte ancienne', 'Quelle pierre a permis de comparer des textes en hiéroglyphes, en démotique et en grec ?', 'La pierre de Rosette', 'La pierre de Rosette a fourni une clé essentielle au déchiffrement des hiéroglyphes au XIXe siècle.', 1, 1, 5),
  row('champollion-hieroglyphs', 'Égypte ancienne', 'Quel savant français publia une percée décisive dans le déchiffrement des hiéroglyphes en 1822 ?', 'Jean-François Champollion', 'Champollion s’appuya notamment sur la comparaison des écritures présentes sur la pierre de Rosette.', 2, 1, 5),
  row('egypt-book-dead', 'Égypte ancienne', 'Comment appelle-t-on la collection de formules funéraires souvent déposées avec les morts dans l’Égypte ancienne ?', 'Le Livre des morts', 'Cette appellation moderne désigne des recueils de textes destinés à accompagner le défunt dans l’au-delà.', 1, 1, 5),
  row('egypt-karnak-temple', 'Égypte ancienne', 'Dans quelle ville se trouve le vaste complexe religieux de Karnak ?', 'Thèbes', 'Karnak se trouve dans l’ancienne Thèbes, sur la rive est du Nil, dans l’actuelle Louxor.', 1, 1, 5),
  row('egypt-mummification-purpose', 'Égypte ancienne', 'Pourquoi la momification était-elle pratiquée dans l’Égypte ancienne ?', 'Pour préserver le corps dans le cadre des croyances funéraires', 'La conservation du corps était liée à la conception égyptienne de la survie et de la personne après la mort.', 1, 1, 5),
  row('babylonian-exile-judah', 'Israël ancien', 'Quel empire déporta une partie de la population de Juda à Babylone au VIe siècle avant notre ère ?', 'L’Empire néo-babylonien', 'La prise de Jérusalem par les Babyloniens entraîna une période d’exil connue sous le nom d’exil babylonien.', 2, 1, 6),
  row('dead-sea-scrolls-qmran', 'Israël ancien', 'Près de quel site les manuscrits de la mer Morte furent-ils découverts ?', 'Qumrân', 'Les grottes de Qumrân, près de la mer Morte, ont livré des manuscrits anciens en hébreu, araméen et grec.', 1, 1, 6),
  row('maurya-ashoka', 'Inde ancienne', 'Quel souverain maurya fit graver des édits après sa conversion au bouddhisme ?', 'Ashoka', 'Les édits d’Ashoka, gravés sur des piliers et des rochers, témoignent de sa politique morale et impériale.', 1, 1, 7),
  row('maurya-capital-pataliputra', 'Inde ancienne', 'Quelle ville était la capitale de l’Empire maurya ?', 'Pataliputra', 'Pataliputra, dans la vallée du Gange, était un centre politique majeur de l’Inde ancienne.', 2, 1, 7),
  row('arthashastra-statecraft', 'Inde ancienne', 'Quel traité sanskrit est associé à l’analyse de l’administration et de la stratégie politique dans l’Inde ancienne ?', 'L’Arthashastra', 'L’Arthashastra expose des réflexions sur le gouvernement, l’économie et la conduite de la guerre.', 2, 1, 7),
  row('gupta-period-classical', 'Inde ancienne', 'Quelle dynastie est souvent associée à une période classique de la culture et des sciences en Inde du Nord ?', 'La dynastie Gupta', 'Les Gupta patronnèrent les arts, les lettres et plusieurs domaines scientifiques entre le IVe et le VIe siècle.', 2, 1, 7),
  row('nalanda-monastic-university', 'Inde ancienne', 'Quel ancien centre d’enseignement bouddhique du Bihar accueillait des étudiants venus de plusieurs régions d’Asie ?', 'Nalanda', 'Nalanda fut un important établissement monastique et intellectuel de l’Inde médiévale.', 1, 1, 7),
  row('qin-unification-221', 'Chine ancienne', 'En quelle année Qin Shi Huangdi acheva-t-il l’unification politique de la Chine ?', '221 avant notre ère', 'En 221 avant notre ère, le roi de Qin vainquit les autres royaumes combattants et prit le titre de Premier Empereur.', 2, 1, 8),
  row('qins-first-emperor', 'Chine ancienne', 'Quel titre adopta le souverain qui unifia la Chine sous la dynastie Qin ?', 'Premier Empereur', 'Qin Shi Huangdi signifie « Premier Empereur » et exprime une rupture avec les titres royaux antérieurs.', 1, 1, 8),
  row('han-confucian-state', 'Chine ancienne', 'Quelle philosophie devint une référence majeure de l’administration impériale sous les Han ?', 'Le confucianisme', 'Les Han institutionnalisèrent progressivement une culture administrative s’appuyant sur les classiques confucéens.', 1, 1, 8),
  row('paper-cai-lun', 'Chine ancienne', 'À quel fonctionnaire des Han l’histoire traditionnelle attribue-t-elle une amélioration de la fabrication du papier ?', 'Cai Lun', 'Les sources traditionnelles associent Cai Lun à une amélioration de la fabrication du papier au début du IIe siècle.', 2, 1, 8),
  row('sui-grand-canal', 'Chine médiévale', 'Quel grand ouvrage hydraulique relia le nord et le sud de la Chine impériale ?', 'Le Grand Canal', 'Le Grand Canal facilita les transports, notamment l’acheminement des céréales vers les centres politiques du nord.', 1, 1, 8),
  row('kush-capital-meroe', 'Afrique ancienne', 'Quelle ville fut la capitale du royaume de Koush pendant sa période tardive ?', 'Méroé', 'Méroé, sur le Nil moyen, fut un centre politique, métallurgique et culturel du royaume de Koush.', 1, 1, 9),
  row('aksum-christianity-ezana', 'Afrique ancienne', 'Quel royaume d’Afrique orientale adopta le christianisme sous le roi Ezana ?', 'Aksoum', 'Le royaume d’Aksoum adopta le christianisme au IVe siècle sous le règne d’Ezana.', 2, 1, 9),
  row('great-zimbabwe-stone-city', 'Afrique médiévale', 'Quel site d’Afrique australe est célèbre pour ses enceintes monumentales en pierre sèche ?', 'Grand Zimbabwe', 'Grand Zimbabwe fut un important centre politique et commercial d’Afrique australe entre les XIe et XVe siècles.', 1, 1, 9),
  row('swahili-coast-kilwa', 'Afrique médiévale', 'Quelle cité swahilie contrôlait un commerce maritime important sur la côte de l’Afrique orientale ?', 'Kilwa', 'Kilwa prospéra grâce aux échanges de l’océan Indien, notamment avec la péninsule Arabique et l’Inde.', 2, 1, 9),
  row('cahokia-mississippian', 'Amériques précolombiennes', 'Quel grand centre urbain de la culture mississippienne se trouvait près de l’actuelle Saint-Louis ?', 'Cahokia', 'Cahokia était un vaste centre de population et de cérémonies, connu pour ses tertres monumentaux.', 1, 1, 10),
  row('inca-quipu-records', 'Amériques précolombiennes', 'Quel dispositif de cordelettes nouées les Incas utilisaient-ils pour enregistrer des informations ?', 'Le quipu', 'Les quipus combinaient des cordelettes et des nœuds selon des conventions utilisées par l’administration inca.', 1, 1, 10),
  row('inca-road-system', 'Amériques précolombiennes', 'Comment appelle-t-on le vaste réseau routier construit et entretenu par l’Empire inca ?', 'Le Qhapaq Ñan', 'Le Qhapaq Ñan reliait les régions de l’Empire inca à travers les Andes.', 2, 1, 10),
  row('maya-city-states', 'Amériques précolombiennes', 'Quelle forme d’organisation politique caractérisait de nombreuses cités mayas classiques ?', 'Des cités-États indépendantes', 'Le monde maya classique était composé de cités-États qui entretenaient des relations de rivalité, d’alliance et d’échanges.', 1, 1, 10),
  row('athens-democracy-citizens', 'Grèce antique', 'Dans quelle cité grecque la démocratie directe s’est-elle développée au Ve siècle avant notre ère ?', 'Athènes', 'À Athènes, les citoyens masculins participaient directement à certaines décisions de l’assemblée.', 1, 1, 11),
  row('greek-polis', 'Grèce antique', 'Comment appelait-on la cité-État grecque formée d’une ville et de son territoire ?', 'La polis', 'La polis était une communauté politique autonome, comme Athènes ou Sparte.', 1, 1, 11),
  row('peloponnesian-war', 'Grèce antique', 'Quelles deux puissances grecques s’affrontèrent lors de la guerre du Péloponnèse ?', 'Athènes et Sparte', 'La guerre du Péloponnèse opposa la ligue dirigée par Athènes à celle dominée par Sparte.', 1, 1, 11),
  row('alexander-hellenistic-world', 'Grèce antique', 'Comment appelle-t-on la période de diffusion de la culture grecque après les conquêtes d’Alexandre ?', 'La période hellénistique', 'La période hellénistique vit des échanges entre traditions grecques et cultures d’Égypte, d’Asie occidentale et d’Asie centrale.', 1, 1, 11),
  row('roman-twelve-tables', 'Rome antique', 'Quel texte du Ve siècle avant notre ère est considéré comme la première codification écrite du droit romain ?', 'La loi des Douze Tables', 'Les Douze Tables rendaient publiques des règles juridiques jusque-là largement contrôlées par les élites patriciennes.', 2, 1, 11),
  row('roman-punic-wars', 'Rome antique', 'Quelle puissance maritime Rome vainquit-elle au cours des guerres puniques ?', 'Carthage', 'Les guerres puniques opposèrent Rome et Carthage pour la domination de la Méditerranée occidentale.', 1, 1, 11),
  row('roman-caracalla-citizenship', 'Rome antique', 'Quel empereur romain étendit la citoyenneté à presque tous les hommes libres de l’Empire par la Constitutio Antoniniana ?', 'Caracalla', 'L’édit de Caracalla, en 212, élargit fortement la citoyenneté romaine dans l’Empire.', 3, 1, 11),
  row('justinian-corpus-juris', 'Empire byzantin', 'Comment appelle-t-on la grande compilation du droit romain réalisée sous Justinien ?', 'Le Corpus juris civilis', 'Cette compilation impériale influença durablement les traditions juridiques européennes.', 2, 1, 12),
  row('byzantine-iconoclasm', 'Empire byzantin', 'Comment appelle-t-on les controverses byzantines portant sur l’interdiction et la vénération des images religieuses ?', 'Les controverses iconoclastes', 'Les débats iconoclastes opposèrent partisans et adversaires des images dans l’Empire byzantin aux VIIIe et IXe siècles.', 2, 1, 12),
  row('kiev-rus-baptism', 'Moyen Âge', 'Quel prince de Kiev adopta le christianisme orthodoxe comme religion de son État à la fin du Xe siècle ?', 'Vladimir le Grand', 'Le baptême de Vladimir en 988 est traditionnellement associé à la christianisation de la Rus’ de Kiev.', 2, 1, 13),
  row('hanseatic-league', 'Moyen Âge', 'Comment appelait-on l’association de villes marchandes d’Europe du Nord qui se développa au Moyen Âge ?', 'La Hanse', 'La Ligue hanséatique coordonnait les intérêts commerciaux de nombreuses villes de la mer du Nord et de la Baltique.', 1, 1, 14),
  row('black-death-arrival-europe', 'Moyen Âge', 'Quel nom donne-t-on à la grande épidémie de peste qui atteignit l’Europe au milieu du XIVe siècle ?', 'La peste noire', 'La peste noire provoqua une forte mortalité et transforma les sociétés européennes au XIVe siècle.', 1, 1, 14),
  row('mali-mansa-musa', 'Afrique médiévale', 'Quel souverain de l’Empire du Mali est célèbre pour son pèlerinage à La Mecque au XIVe siècle ?', 'Mansa Musa', 'Le pèlerinage de Mansa Musa en 1324 contribua à faire connaître la richesse et le rayonnement du Mali.', 1, 1, 15),
  row('songhai-sunni-ali', 'Afrique médiévale', 'Quel souverain fonda l’expansion de l’Empire songhaï au XVe siècle ?', 'Sonni Ali', 'Sonni Ali conquit notamment Tombouctou et Gao, consolidant la puissance songhaï autour du Niger.', 2, 1, 15),
  row('delhi-sultanate', 'Monde islamique médiéval', 'Comment appelle-t-on la succession de dynasties musulmanes qui gouverna une grande partie du nord de l’Inde du XIIIe au XVIe siècle ?', 'Le sultanat de Delhi', 'Le sultanat de Delhi eut sa capitale à Delhi et administra une grande partie du nord du sous-continent.', 1, 1, 16),
  row('abbasid-baghdad-foundation', 'Monde islamique médiéval', 'Quelle ville fondée par les Abbassides en 762 devint un grand centre politique et intellectuel ?', 'Bagdad', 'Bagdad, fondée sous le calife al-Mansur, devint un centre majeur des échanges et des savoirs.', 1, 1, 16),
  row('ibn-sina-canon', 'Monde islamique médiéval', 'Quel médecin et philosophe a écrit le Canon de la médecine ?', 'Ibn Sina (Avicenne)', 'Le Canon de la médecine d’Ibn Sina fut une référence médicale dans plusieurs régions pendant des siècles.', 2, 1, 16),
  row('columbian-exchange', 'Premiers empires modernes', 'Comment appelle-t-on les transferts de plantes, d’animaux, de populations et de maladies entre les Amériques et l’Afro-Eurasie après 1492 ?', 'L’échange colombien', 'L’échange colombien transforma les agricultures, les régimes alimentaires et les populations des deux côtés de l’Atlantique.', 1, 2, 1),
  row('tordesillas-treaty', 'Premiers empires modernes', 'Quel traité de 1494 partagea théoriquement les zones d’exploration atlantiques entre l’Espagne et le Portugal ?', 'Le traité de Tordesillas', 'Le traité fixa une ligne de démarcation entre les sphères revendiquées par les deux monarchies ibériques.', 2, 2, 1),
  row('manila-galleons', 'Premiers empires modernes', 'Quel réseau maritime reliait Manille et Acapulco à travers le Pacifique à l’époque moderne ?', 'Les galions de Manille', 'Les galions de Manille transportaient notamment des marchandises et de l’argent entre l’Asie et les Amériques espagnoles.', 2, 2, 2),
  row('mughal-akbar', 'Asie du Sud moderne', 'Quel empereur moghol est connu pour avoir développé une politique de tolérance et une administration impériale structurée ?', 'Akbar', 'Akbar agrandit l’Empire moghol et chercha à intégrer des populations et élites de traditions diverses.', 1, 2, 3),
  row('tokugawa-shogunate', 'Asie de l’Est moderne', 'Quelle famille de shoguns gouverna le Japon à partir de 1603 jusqu’à la restauration impériale de 1868 ?', 'Les Tokugawa', 'Le shogunat Tokugawa établit un régime militaire durable dont le centre politique était Edo.', 1, 2, 4),
  row('qing-manchu-dynasty', 'Asie de l’Est moderne', 'Quelle dynastie d’origine mandchoue gouverna la Chine de 1644 à 1911 ?', 'La dynastie Qing', 'Les Qing furent la dernière dynastie impériale de Chine.', 1, 2, 4),
  row('copernicus-heliocentrism', 'Révolutions intellectuelles', 'Quel astronome proposa dans un ouvrage publié en 1543 un modèle héliocentrique du cosmos ?', 'Nicolas Copernic', 'Copernic plaça le Soleil au centre du modèle planétaire présenté dans De revolutionibus.', 1, 2, 6),
  row('galileo-telescope-observations', 'Révolutions intellectuelles', 'Quel savant publia en 1610 des observations télescopiques dans Le Messager des étoiles ?', 'Galilée', 'Ses observations de la Lune, des satellites de Jupiter et des étoiles alimentèrent les débats astronomiques.', 2, 2, 6),
  row('newton-principia', 'Révolutions intellectuelles', 'Quel ouvrage d’Isaac Newton, publié en 1687, présente ses lois du mouvement et la gravitation universelle ?', 'Les Principia', 'Les Principia mathematica formalisent une mécanique qui influença profondément les sciences modernes.', 1, 2, 6),
  row('westphalia-treaties', 'Révolutions politiques', 'Quels traités de 1648 mettent fin à la guerre de Trente Ans ?', 'Les traités de Westphalie', 'Les accords de Münster et d’Osnabrück réorganisèrent les relations politiques en Europe centrale.', 2, 2, 7),
  row('haitian-revolution-independence', 'Révolutions atlantiques', 'Quel État indépendant fut fondé en 1804 après une révolution d’esclaves dans la colonie française de Saint-Domingue ?', 'Haïti', 'La révolution haïtienne aboutit à l’indépendance d’Haïti en 1804.', 1, 2, 7),
  row('congress-vienna', 'Europe au XIXe siècle', 'Quelle réunion diplomatique de 1814-1815 réorganisa l’Europe après les guerres napoléoniennes ?', 'Le congrès de Vienne', 'Les puissances européennes négocièrent un nouvel équilibre politique après la défaite de Napoléon.', 1, 2, 8),
  row('latin-american-bolivar', 'Amériques au XIXe siècle', 'Quel dirigeant est associé aux indépendances de plusieurs territoires du nord de l’Amérique du Sud ?', 'Simón Bolívar', 'Bolívar participa aux campagnes qui conduisirent à l’indépendance de plusieurs États sud-américains.', 1, 2, 9),
  row('meiji-restoration', 'Asie au XIXe siècle', 'Comment appelle-t-on le processus politique qui rétablit l’autorité impériale au Japon en 1868 ?', 'La restauration de Meiji', 'La restauration de Meiji transforma les institutions japonaises et accéléra la modernisation de l’État.', 1, 2, 9),
  row('treaty-nanking', 'Asie au XIXe siècle', 'Quel traité de 1842 mit fin à la première guerre de l’opium entre la Chine et le Royaume-Uni ?', 'Le traité de Nankin', 'Le traité de Nankin céda Hong Kong au Royaume-Uni et ouvrit plusieurs ports chinois au commerce britannique.', 2, 2, 10),
  row('suez-canal-opening', 'Impérialismes', 'En quelle année le canal de Suez fut-il inauguré ?', '1869', 'L’ouverture du canal de Suez créa une liaison maritime directe entre la Méditerranée et la mer Rouge.', 1, 2, 10),
  row('berlin-conference-1884', 'Impérialismes', 'Quelle conférence de 1884-1885 fixa des règles européennes pour les revendications coloniales en Afrique ?', 'La conférence de Berlin', 'La conférence de Berlin organisa les discussions entre puissances européennes, sans représentation africaine équivalente.', 2, 2, 10),
  row('indian-rebellion-1857', 'Impérialismes', 'Quel soulèvement de 1857-1858 mit gravement en cause le pouvoir de la Compagnie britannique des Indes orientales ?', 'La révolte des Cipayes', 'Le soulèvement entraîna la fin du gouvernement de la Compagnie et le passage de l’Inde sous la Couronne britannique.', 2, 2, 10),
  row('british-slavery-abolition', 'Abolitions', 'Quelle loi britannique de 1833 abolit l’esclavage dans la plupart des colonies de l’Empire britannique ?', 'The Slavery Abolition Act', 'La loi de 1833 entra progressivement en vigueur dans la plupart des colonies britanniques, avec des exceptions et des dispositions transitoires.', 2, 2, 10),
  row('league-of-nations-founded', 'Monde contemporain', 'Quelle organisation internationale fut créée en 1920 dans le cadre du traité de Versailles ?', 'La Société des Nations', 'La Société des Nations visait à favoriser la coopération et la sécurité collective après la Première Guerre mondiale.', 1, 2, 12),
  row('balfour-declaration', 'Monde contemporain', 'Quel document britannique de 1917 soutint l’établissement d’un foyer national juif en Palestine ?', 'La déclaration Balfour', 'La déclaration Balfour fut une lettre du gouvernement britannique à Lord Rothschild, dont l’interprétation et les conséquences restent historiquement débattues.', 3, 2, 12),
  row('indian-independence-1947', 'Décolonisations', 'En quelle année l’Inde devint-elle indépendante du Royaume-Uni ?', '1947', 'L’indépendance de l’Inde en 1947 s’accompagna de la partition qui créa notamment le Pakistan.', 1, 2, 14),
  row('bandung-conference', 'Décolonisations', 'Quelle conférence de 1955 réunit des États d’Asie et d’Afrique autour de la coopération et de l’anticolonialisme ?', 'La conférence de Bandung', 'La conférence de Bandung en Indonésie rassembla des dirigeants afro-asiatiques et préfigura le mouvement des non-alignés.', 2, 2, 14),
  row('apartheid-definition', 'Décolonisations', 'Comment appelait-on le système légal de ségrégation raciale instauré en Afrique du Sud à partir de 1948 ?', 'L’apartheid', 'L’apartheid organisait juridiquement la séparation raciale et la domination politique de la minorité blanche.', 1, 2, 14),
  row('european-coal-steel-community', 'Europe contemporaine', 'Quelle communauté créée en 1951 mit en commun les industries du charbon et de l’acier de plusieurs États européens ?', 'La Communauté européenne du charbon et de l’acier', 'La CECA fut une étape institutionnelle de la construction européenne.', 2, 2, 15),
  row('cuban-missile-crisis', 'Guerre froide', 'Quel affrontement de 1962 opposa directement les États-Unis et l’Union soviétique au sujet de missiles installés à Cuba ?', 'La crise des missiles de Cuba', 'La crise des missiles de Cuba fut un moment de très forte tension nucléaire de la guerre froide.', 1, 2, 14),
  row('soviet-afghanistan-invasion', 'Guerre froide', 'En quelle année l’Union soviétique intervient-elle militairement en Afghanistan ?', '1979', 'L’intervention soviétique commence en décembre 1979 et ouvre une guerre qui dure jusqu’au retrait soviétique de 1989.', 2, 2, 14),
  row('polio-smallpox-eradication', 'Monde contemporain', 'Quelle maladie est la première maladie humaine déclarée éradiquée par l’Organisation mondiale de la santé en 1980 ?', 'La variole', 'L’éradication mondiale de la variole fut certifiée par l’OMS en 1980 après une campagne internationale de vaccination.', 1, 2, 15),
  row('apartheid-end-election', 'Monde contemporain', 'En quelle année a lieu la première élection nationale sud-africaine au suffrage universel non racial ?', '1994', 'L’élection de 1994 porta Nelson Mandela à la présidence et marqua la fin politique de l’apartheid.', 1, 2, 15),
  row('carthage-phoenician-colony', 'Méditerranée ancienne', 'Quelle grande cité d’Afrique du Nord fut fondée par des colons phéniciens selon la tradition antique ?', 'Carthage', 'Carthage fut une cité phénicienne devenue une grande puissance commerciale et maritime de la Méditerranée occidentale.', 1, 1, 4),
  row('achaemenid-immortals', 'Empires anciens', 'Comment les auteurs grecs appelaient-ils le corps d’élite de dix mille soldats de l’armée achéménide ?', 'Les Immortels', 'Les Immortels formaient une unité d’élite décrite par les sources grecques dans l’armée perse.', 2, 1, 4),
  row('akhenaten-amarna', 'Égypte ancienne', 'Quel pharaon fonda une nouvelle capitale appelée Akhetaton et favorisa le culte d’Aton ?', 'Akhenaton', 'Akhenaton déplaça la cour à Akhetaton et plaça le culte d’Aton au centre de sa réforme religieuse.', 2, 1, 5),
  row('indus-harappa-mohenjo-daro', 'Inde ancienne', 'Quels deux sites sont parmi les plus connus de la civilisation urbaine de la vallée de l’Indus ?', 'Harappa et Mohenjo-Daro', 'Ces deux sites témoignent d’une urbanisation planifiée de la vallée de l’Indus au troisième millénaire avant notre ère.', 1, 1, 7),
  row('tang-changan-capital', 'Chine médiévale', 'Quelle ville fut la capitale cosmopolite de la dynastie Tang ?', 'Chang’an', 'Chang’an accueillait une population et des échanges internationaux importants sous les Tang.', 1, 1, 8),
  row('chinese-woodblock-printing', 'Chine médiévale', 'Quelle technique permit de reproduire des textes en Chine avant l’imprimerie à caractères mobiles européenne ?', 'L’impression xylographique', 'La gravure sur bois permettait d’imprimer une page entière à partir d’un bloc gravé.', 2, 1, 8),
  row('zheng-he-voyages', 'Asie maritime', 'Quel amiral de la dynastie Ming dirigea de grandes expéditions dans l’océan Indien au XVe siècle ?', 'Zheng He', 'Les expéditions de Zheng He atteignirent notamment l’Asie du Sud, l’Arabie et la côte orientale de l’Afrique.', 1, 1, 8),
  row('axum-adulis-port', 'Afrique ancienne', 'Quel port de la mer Rouge était associé aux échanges du royaume d’Aksoum ?', 'Adoulis', 'Adoulis servait de débouché maritime au royaume d’Aksoum et participait aux échanges de la mer Rouge.', 2, 1, 9),
  row('olympic-games-ancient', 'Grèce antique', 'Dans quelle cité se déroulaient les jeux panhelléniques dédiés à Zeus ?', 'Olympie', 'Olympie accueillait les jeux célébrés périodiquement en l’honneur de Zeus.', 1, 1, 11),
  row('hippocratic-oath', 'Grèce antique', 'À quel médecin antique associe-t-on traditionnellement le serment médical portant son nom ?', 'Hippocrate', 'Le serment d’Hippocrate appartient à une tradition médicale antique associée à Hippocrate de Cos.', 1, 1, 11),
  row('aristotle-lyceum', 'Grèce antique', 'Quelle école fondée par Aristote à Athènes est connue sous le nom de Lycée ?', 'Le Lycée', 'Aristote enseigna au Lycée, qui devint un important centre de recherche et de discussion philosophique.', 1, 1, 11),
  row('roman-aqueducts', 'Rome antique', 'Quel type d’ouvrage transportait l’eau sur de longues distances vers les villes romaines ?', 'Les aqueducs', 'Les aqueducs acheminaient l’eau par des conduites et parfois par des ponts à arcades.', 1, 1, 11),
  row('mongol-empire-founder', 'Moyen Âge', 'Quel chef mongol unifia plusieurs tribus et prit le titre de Gengis Khan en 1206 ?', 'Temüjin', 'Temüjin fut proclamé Gengis Khan et fonda la structure politique de l’Empire mongol.', 2, 1, 14),
  row('constantinople-1453', 'Moyen Âge', 'Quelle ville fut prise par les Ottomans en 1453, mettant fin à l’Empire byzantin ?', 'Constantinople', 'La prise de Constantinople par Mehmed II transforma l’équilibre politique de la Méditerranée orientale.', 1, 1, 14),
  row('safavid-shiism', 'Monde islamique moderne', 'Quelle dynastie fit du chiisme duodécimain la religion officielle de l’Iran au début du XVIe siècle ?', 'Les Safavides', 'La dynastie safavide contribua à institutionnaliser durablement le chiisme duodécimain en Iran.', 2, 2, 4),
  row('taj-mahal-shah-jahan', 'Asie du Sud moderne', 'Quel souverain moghol commanda la construction du Taj Mahal à Agra ?', 'Shah Jahan', 'Shah Jahan fit construire le Taj Mahal comme mausolée pour Mumtaz Mahal.', 1, 2, 3),
  row('luther-95-theses', 'Réformes religieuses', 'Quel texte Martin Luther aurait-il affiché à Wittenberg en 1517 selon la tradition ?', 'Les 95 thèses', 'Les 95 thèses critiquaient notamment la pratique des indulgences et contribuèrent aux controverses de la Réforme.', 1, 2, 5),
  row('peace-augsburg', 'Réformes religieuses', 'Quel accord de 1555 reconnut dans l’Empire certains choix confessionnels des princes allemands ?', 'La paix d’Augsbourg', 'La paix d’Augsbourg établit un compromis entre catholicisme et luthéranisme dans l’Empire.', 2, 2, 5),
  row('locke-two-treatises', 'Révolutions intellectuelles', 'Quel philosophe anglais défendit les droits naturels et le consentement des gouvernés dans les Deux traités du gouvernement ?', 'John Locke', 'Les arguments de Locke sur les droits et le consentement influencèrent la pensée politique moderne.', 2, 2, 6),
];

const chapterUrl = (volume: Volume, chapter: number) =>
  `https://openstax.org/books/world-history-volume-${volume}/pages/${chapter}-introduction`;

const provenance = (factId: string, volume: Volume, chapter: number): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: chapterUrl(volume, chapter),
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_HISTORY_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, volume, chapter]) => {
  const factId = `fact-history-openstax-${id}`;
  return {
    id: `history-openstax-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Histoire',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['histoire', subcategory.toLowerCase()],
    provenance: provenance(factId, volume, chapter),
  } satisfies Question;
});

export const VERIFIED_HISTORY_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-world-history-facts',
  questions: VERIFIED_HISTORY_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/world-history-volume-1',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_HISTORY_OPENSTAX_BATCH;
