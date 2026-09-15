import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Stable, source-backed facts about web and network standards.
 *
 * Each row is one normative claim, not a wording variant.  RFC links point to
 * the section that defines the claim so that an editor can re-check it later.
 */
const CHECKED_AT = '2026-09-15';
const IETF_SOURCE = 'IETF — RFC Editor standards';
const IETF_LICENSE = 'IETF Trust Legal Provisions (BSL 1.1 / document terms)';
const UNICODE_SOURCE = 'Unicode Consortium — Unicode Standard Annexes';
const UNICODE_LICENSE = 'Unicode Terms of Use';

type SourceKey = 'http' | 'uri' | 'dns' | 'ipv6' | 'tls' | 'unicode';
type Row = readonly [id: string, category: 'Technologie' | 'Informatique', subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, source: SourceKey, anchor: string];

const SOURCES: Record<SourceKey, { name: string; license: string; base: string }> = {
  http: { name: IETF_SOURCE + ' — RFC 9110 HTTP Semantics', license: IETF_LICENSE, base: 'https://www.rfc-editor.org/rfc/rfc9110.html' },
  uri: { name: IETF_SOURCE + ' — RFC 3986 URI Generic Syntax', license: IETF_LICENSE, base: 'https://www.rfc-editor.org/rfc/rfc3986.html' },
  dns: { name: IETF_SOURCE + ' — RFC 1034/1035 Domain Name System', license: IETF_LICENSE, base: 'https://www.rfc-editor.org/rfc/rfc1034.html' },
  ipv6: { name: IETF_SOURCE + ' — RFC 8200 IPv6', license: IETF_LICENSE, base: 'https://www.rfc-editor.org/rfc/rfc8200.html' },
  tls: { name: IETF_SOURCE + ' — RFC 8446 TLS 1.3', license: IETF_LICENSE, base: 'https://www.rfc-editor.org/rfc/rfc8446.html' },
  unicode: { name: UNICODE_SOURCE + ' — UAX #44 Unicode Character Database', license: UNICODE_LICENSE, base: 'https://www.unicode.org/reports/tr44/' },
};

const ROWS: readonly Row[] = [
  ['http-get-safe', 'Informatique', 'HTTP', 'La méthode HTTP GET est-elle considérée comme sûre par HTTP ?', 'Oui', 'GET est une méthode sûre : sa sémantique est principalement en lecture.', 1, 'http', '#name-safe-methods'],
  ['http-get-idempotent', 'Informatique', 'HTTP', 'La méthode HTTP GET est-elle idempotente ?', 'Oui', 'Répéter une requête GET produit le même effet attendu sur la ressource.', 1, 'http', '#name-idempotent-methods'],
  ['http-head-no-content', 'Informatique', 'HTTP', 'Une réponse à HTTP HEAD contient-elle le contenu de la représentation ?', 'Non', 'HEAD renvoie les mêmes métadonnées qu’un GET mais sans contenu de réponse.', 1, 'http', '#name-head'],
  ['http-head-safe', 'Informatique', 'HTTP', 'HTTP HEAD est-elle une méthode sûre ?', 'Oui', 'HEAD fait partie des méthodes sûres.', 1, 'http', '#name-head'],
  ['http-post-safe', 'Informatique', 'HTTP', 'HTTP POST est-elle une méthode sûre ?', 'Non', 'POST peut demander une action ou créer une ressource ; elle n’est pas sûre.', 1, 'http', '#name-post'],
  ['http-post-idempotent', 'Informatique', 'HTTP', 'HTTP POST est-elle idempotente par défaut ?', 'Non', 'Le protocole ne définit pas POST comme idempotente.', 1, 'http', '#name-post'],
  ['http-put-idempotent', 'Informatique', 'HTTP', 'HTTP PUT est-elle idempotente ?', 'Oui', 'La sémantique de PUT est idempotente.', 1, 'http', '#name-put'],
  ['http-delete-idempotent', 'Informatique', 'HTTP', 'HTTP DELETE est-elle idempotente ?', 'Oui', 'DELETE est définie comme idempotente, même si l’état de la réponse peut changer.', 2, 'http', '#name-delete'],
  ['http-options-safe', 'Informatique', 'HTTP', 'HTTP OPTIONS est-elle une méthode sûre ?', 'Oui', 'OPTIONS demande des informations sur les options de communication.', 1, 'http', '#name-options'],
  ['http-trace-safe', 'Informatique', 'HTTP', 'HTTP TRACE est-elle une méthode sûre ?', 'Oui', 'TRACE est classée parmi les méthodes sûres.', 2, 'http', '#name-trace'],
  ['http-200', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 200 ?', 'OK', 'La requête a réussi.', 1, 'http', '#status.200'],
  ['http-201', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 201 ?', 'Created', 'La requête a réussi et a entraîné la création d’une ou plusieurs ressources.', 1, 'http', '#status.201'],
  ['http-202', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 202 ?', 'Accepted', 'La requête a été acceptée pour traitement, mais le traitement n’est pas terminé.', 1, 'http', '#status.202'],
  ['http-204', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 204 ?', 'No Content', 'La requête a réussi et il n’y a pas de contenu supplémentaire à envoyer dans la réponse.', 1, 'http', '#status.204'],
  ['http-301', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 301 ?', 'Moved Permanently', 'La ressource cible a reçu une nouvelle URI permanente.', 1, 'http', '#status.301'],
  ['http-304', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 304 ?', 'Not Modified', 'La condition GET ou HEAD indique que la représentation n’a pas changé.', 1, 'http', '#status.304'],
  ['http-307', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 307 ?', 'Temporary Redirect', 'La redirection est temporaire et la méthode doit être conservée lors du suivi.', 2, 'http', '#status.307'],
  ['http-308', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 308 ?', 'Permanent Redirect', 'La redirection est permanente et la méthode doit être conservée lors du suivi.', 2, 'http', '#status.308'],
  ['http-400', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 400 ?', 'Bad Request', 'Le serveur ne peut pas traiter la requête en raison d’une erreur perçue côté client.', 1, 'http', '#status.400'],
  ['http-401', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 401 ?', 'Unauthorized', 'La requête n’a pas fourni des informations d’authentification valides pour la cible.', 1, 'http', '#status.401'],
  ['http-403', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 403 ?', 'Forbidden', 'Le serveur a compris la requête mais refuse de l’autoriser.', 1, 'http', '#status.403'],
  ['http-404', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 404 ?', 'Not Found', 'Le serveur n’a pas trouvé de représentation actuelle pour la ressource cible.', 1, 'http', '#status.404'],
  ['http-405', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 405 ?', 'Method Not Allowed', 'La méthode est connue mais n’est pas autorisée pour la ressource cible.', 2, 'http', '#status.405'],
  ['http-406', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 406 ?', 'Not Acceptable', 'Aucune représentation acceptable selon les en-têtes de négociation n’est disponible.', 2, 'http', '#status.406'],
  ['http-408', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 408 ?', 'Request Timeout', 'Le serveur n’a pas reçu une requête complète dans le délai qu’il voulait attendre.', 1, 'http', '#status.408'],
  ['http-409', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 409 ?', 'Conflict', 'La requête ne peut pas être traitée à cause d’un conflit avec l’état actuel de la ressource.', 1, 'http', '#status.409'],
  ['http-410', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 410 ?', 'Gone', 'La ressource cible n’est plus disponible et le restera probablement.', 2, 'http', '#status.410'],
  ['http-411', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 411 ?', 'Length Required', 'Le serveur refuse la requête sans champ Content-Length valide.', 2, 'http', '#status.411'],
  ['http-412', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 412 ?', 'Precondition Failed', 'Une ou plusieurs préconditions de la requête évaluent à faux.', 2, 'http', '#status.412'],
  ['http-413', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 413 ?', 'Content Too Large', 'Le contenu de la requête est plus grand que la limite que le serveur accepte.', 1, 'http', '#status.413'],
  ['http-414', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 414 ?', 'URI Too Long', 'L’URI demandée est plus longue que ce que le serveur accepte d’interpréter.', 1, 'http', '#status.414'],
  ['http-415', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 415 ?', 'Unsupported Media Type', 'Le format du contenu n’est pas pris en charge par la méthode ou la ressource cible.', 1, 'http', '#status.415'],
  ['http-416', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 416 ?', 'Range Not Satisfiable', 'Aucune plage de la valeur Range ne peut être satisfaite.', 2, 'http', '#status.416'],
  ['http-417', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 417 ?', 'Expectation Failed', 'L’attente indiquée par Expect ne peut pas être satisfaite.', 2, 'http', '#status.417'],
  ['http-421', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 421 ?', 'Misdirected Request', 'La requête a été dirigée vers un serveur qui ne peut pas produire de réponse pour la cible.', 2, 'http', '#status.421'],
  ['http-422', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 422 ?', 'Unprocessable Content', 'Le contenu est syntaxiquement correct mais ses instructions ne peuvent pas être traitées.', 2, 'http', '#status.422'],
  ['http-425', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 425 ?', 'Too Early', 'Le serveur refuse de prendre le risque de traiter une requête qui pourrait être rejouée.', 3, 'http', '#status.425'],
  ['http-426', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 426 ?', 'Upgrade Required', 'Le serveur refuse la requête et demande au client de changer de protocole.', 2, 'http', '#status.426'],
  ['http-428', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 428 ?', 'Precondition Required', 'Le serveur exige que la requête soit conditionnelle.', 2, 'http', '#status.428'],
  ['http-429', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 429 ?', 'Too Many Requests', 'Le client a envoyé trop de requêtes dans un délai donné.', 1, 'http', '#status.429'],
  ['http-431', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 431 ?', 'Request Header Fields Too Large', 'Les champs d’en-tête de la requête sont trop volumineux pour être traités.', 2, 'http', '#status.431'],
  ['http-451', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 451 ?', 'Unavailable For Legal Reasons', 'La ressource est indisponible pour des raisons juridiques.', 1, 'http', '#status.451'],
  ['http-500', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 500 ?', 'Internal Server Error', 'Le serveur rencontre une condition inattendue qui l’empêche de répondre.', 1, 'http', '#status.500'],
  ['http-501', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 501 ?', 'Not Implemented', 'Le serveur ne prend pas en charge la fonctionnalité requise pour satisfaire la requête.', 1, 'http', '#status.501'],
  ['http-502', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 502 ?', 'Bad Gateway', 'Le serveur agissant comme passerelle reçoit une réponse invalide du serveur amont.', 1, 'http', '#status.502'],
  ['http-503', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 503 ?', 'Service Unavailable', 'Le serveur n’est momentanément pas prêt à traiter la requête.', 1, 'http', '#status.503'],
  ['http-504', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 504 ?', 'Gateway Timeout', 'La passerelle n’a pas reçu une réponse à temps du serveur amont.', 1, 'http', '#status.504'],
  ['http-505', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 505 ?', 'HTTP Version Not Supported', 'Le serveur ne prend pas en charge la version majeure de HTTP utilisée dans la requête.', 1, 'http', '#status.505'],
  ['http-511', 'Informatique', 'HTTP', 'Que signifie le statut HTTP 511 ?', 'Network Authentication Required', 'Le client doit s’authentifier pour obtenir l’accès au réseau.', 2, 'http', '#status.511'],
  ['http-content-type', 'Informatique', 'HTTP', 'Quel en-tête indique le type de média d’une représentation HTTP ?', 'Content-Type', 'Content-Type décrit le type de média de la représentation associée.', 1, 'http', '#field.content-type'],
  ['http-content-length', 'Informatique', 'HTTP', 'Quel en-tête indique la taille en octets du contenu HTTP ?', 'Content-Length', 'Content-Length donne la taille décimale en octets du contenu.', 1, 'http', '#field.content-length'],
  ['http-etag', 'Informatique', 'HTTP', 'Quel en-tête fournit un identifiant de version d’une représentation HTTP ?', 'ETag', 'ETag fournit une valeur opaque représentant une version de la représentation.', 1, 'http', '#field.etag'],
  ['http-location', 'Informatique', 'HTTP', 'Quel en-tête indique une URI vers une ressource liée ou redirigée ?', 'Location', 'Location indique une URI de référence liée au résultat de la requête.', 1, 'http', '#field.location'],
  ['http-vary', 'Informatique', 'HTTP', 'Quel en-tête indique les champs utilisés pour choisir une représentation ?', 'Vary', 'Vary liste les champs de requête qui ont influencé la sélection de la représentation.', 2, 'http', '#field.vary'],
  ['http-allow', 'Informatique', 'HTTP', 'Quel en-tête indique les méthodes prises en charge par une ressource ?', 'Allow', 'Allow liste les méthodes prises en charge par la ressource cible.', 1, 'http', '#field.allow'],
  ['http-cache-control', 'Informatique', 'HTTP', 'Quel en-tête porte les directives de mise en cache HTTP ?', 'Cache-Control', 'Cache-Control transporte les directives destinées aux caches.', 1, 'http', '#field.cache-control'],
  ['uri-scheme', 'Technologie', 'URI', 'Quelle partie d’une URI identifie le protocole ou le mécanisme d’accès ?', 'Le schéma', 'Le schéma est la composante qui précède le deux-points dans la syntaxe générique.', 1, 'uri', '#section-3.1'],
  ['uri-authority', 'Technologie', 'URI', 'Quelle composante URI peut contenir l’hôte et le port ?', 'L’autorité', 'La composante authority peut contenir userinfo, host et port.', 1, 'uri', '#section-3.2'],
  ['uri-path', 'Technologie', 'URI', 'Quelle composante URI identifie généralement une ressource dans l’espace du schéma ?', 'Le chemin', 'Le path fournit les données d’identification de la ressource dans la portée du schéma et de l’autorité.', 1, 'uri', '#section-3.3'],
  ['uri-query', 'Technologie', 'URI', 'Quelle composante URI suit le point d’interrogation ?', 'La requête (query)', 'La query contient des données non hiérarchiques identifiant la ressource.', 1, 'uri', '#section-3.4'],
  ['uri-fragment', 'Technologie', 'URI', 'Quelle composante URI suit le caractère dièse ?', 'Le fragment', 'Le fragment identifie une ressource secondaire ou une vue au sein de la ressource primaire.', 1, 'uri', '#section-3.5'],
  ['uri-absolute', 'Technologie', 'URI', 'Une URI absolue contient-elle un schéma ?', 'Oui', 'Une URI absolue contient un schéma et ne commence pas par une référence relative.', 1, 'uri', '#section-4.3'],
  ['uri-relative', 'Technologie', 'URI', 'Une référence URI relative contient-elle forcément un schéma ?', 'Non', 'Une référence relative est résolue par rapport à une base et ne contient pas nécessairement de schéma.', 1, 'uri', '#section-4.2'],
  ['uri-percent-encoding', 'Technologie', 'URI', 'Quel mécanisme encode un octet dans une URI avec un signe pourcentage et deux chiffres hexadécimaux ?', 'Le percent-encoding', 'Une séquence percent-encoded est formée du caractère % suivi de deux chiffres hexadécimaux.', 1, 'uri', '#section-2.1'],
  ['uri-reserved', 'Technologie', 'URI', 'Comment RFC 3986 nomme-t-elle les caractères ayant un rôle syntaxique spécial dans une URI ?', 'Les caractères réservés', 'Les caractères réservés sont définis pour délimiter ou distinguer les composants.', 1, 'uri', '#section-2.2'],
  ['uri-unreserved', 'Technologie', 'URI', 'Comment RFC 3986 nomme-t-elle les caractères URI ne servant pas de délimiteurs ?', 'Les caractères non réservés', 'Les caractères alphanumériques et - . _ ~ font partie des caractères non réservés.', 1, 'uri', '#section-2.3'],
  ['dns-fqdn-case', 'Technologie', 'DNS', 'Les noms de domaine DNS sont-ils sensibles à la casse ?', 'Non', 'La comparaison des noms DNS n’est pas sensible à la casse.', 1, 'dns', 'https://www.rfc-editor.org/rfc/rfc1034.html#section-3.1'],
  ['dns-hierarchy', 'Technologie', 'DNS', 'Comment le DNS organise-t-il les noms ?', 'En hiérarchie', 'L’espace des noms de domaine est une structure arborescente hiérarchique.', 1, 'dns', 'https://www.rfc-editor.org/rfc/rfc1034.html#section-3.1'],
  ['dns-root-label', 'Technologie', 'DNS', 'Quel label se trouve au sommet de l’espace des noms DNS ?', 'Le label racine', 'La racine est un nœud sans nom affiché, représenté par une étiquette vide.', 2, 'dns', 'https://www.rfc-editor.org/rfc/rfc1034.html#section-3.1'],
  ['dns-label-length', 'Technologie', 'DNS', 'Quelle est la longueur maximale d’un label DNS selon RFC 1035 ?', '63 octets', 'Un label DNS individuel est limité à 63 octets.', 1, 'dns', 'https://www.rfc-editor.org/rfc/rfc1035.html#section-2.3.4'],
  ['dns-name-length', 'Technologie', 'DNS', 'Quelle est la longueur maximale d’un nom de domaine DNS encodé selon RFC 1035 ?', '255 octets', 'Un nom de domaine encodé ne dépasse pas 255 octets.', 2, 'dns', 'https://www.rfc-editor.org/rfc/rfc1035.html#section-2.3.4'],
  ['dns-a-record', 'Technologie', 'DNS', 'Quel type DNS associe un nom à une adresse IPv4 ?', 'A', 'Le type A contient une adresse Internet sur 32 bits.', 1, 'dns', 'https://www.rfc-editor.org/rfc/rfc1035.html#section-3.4.1'],
  ['dns-ns-record', 'Technologie', 'DNS', 'Quel type DNS identifie un serveur de noms faisant autorité ?', 'NS', 'Un enregistrement NS indique un serveur de noms pour la zone.', 1, 'dns', 'https://www.rfc-editor.org/rfc/rfc1035.html#section-3.3.11'],
  ['dns-cname-record', 'Technologie', 'DNS', 'Quel type DNS crée un alias d’un nom canonique ?', 'CNAME', 'CNAME donne le nom canonique d’un alias.', 1, 'dns', 'https://www.rfc-editor.org/rfc/rfc1035.html#section-3.3.1'],
  ['dns-mx-record', 'Technologie', 'DNS', 'Quel type DNS indique un agent de transfert de courrier pour un domaine ?', 'MX', 'MX spécifie un échangeur de courrier pour le domaine.', 1, 'dns', 'https://www.rfc-editor.org/rfc/rfc1035.html#section-3.3.9'],
  ['dns-txt-record', 'Technologie', 'DNS', 'Quel type DNS transporte des données textuelles ?', 'TXT', 'TXT contient des chaînes de texte associées au nom.', 1, 'dns', 'https://www.rfc-editor.org/rfc/rfc1035.html#section-3.3.14'],
  ['ipv6-address-bits', 'Technologie', 'IPv6', 'Combien de bits comporte une adresse IPv6 ?', '128 bits', 'IPv6 définit des adresses de 128 bits.', 1, 'ipv6', '#section-2'],
  ['ipv6-header-fixed', 'Technologie', 'IPv6', 'Quelle est la taille de l’en-tête IPv6 de base ?', '40 octets', 'L’en-tête IPv6 de base a une longueur fixe de 40 octets.', 1, 'ipv6', '#section-3'],
  ['ipv6-extension-headers', 'Technologie', 'IPv6', 'Où IPv6 place-t-il les informations optionnelles après l’en-tête de base ?', 'Dans des en-têtes d’extension', 'Les en-têtes d’extension sont chaînés après l’en-tête IPv6 de base.', 1, 'ipv6', '#section-4'],
  ['ipv6-no-broadcast', 'Technologie', 'IPv6', 'IPv6 définit-il une adresse de diffusion générale ?', 'Non', 'IPv6 n’implémente pas de broadcast ; le multicast est utilisé pour ce type de distribution.', 2, 'ipv6', '#section-2'],
  ['ipv6-link-local-prefix', 'Technologie', 'IPv6', 'Quel préfixe est réservé aux adresses IPv6 lien-local ?', 'fe80::/10', 'Le préfixe fe80::/10 identifie les adresses lien-local.', 2, 'ipv6', '#section-2.4'],
  ['ipv6-loopback', 'Technologie', 'IPv6', 'Quelle est l’adresse IPv6 de loopback ?', '::1', 'La valeur 0:0:0:0:0:0:0:1 est la loopback IPv6, abrégée ::1.', 1, 'ipv6', '#section-2.5.3'],
  ['ipv6-unspecified', 'Technologie', 'IPv6', 'Quelle est l’adresse IPv6 non spécifiée ?', '::', 'L’adresse 0:0:0:0:0:0:0:0 est l’adresse non spécifiée.', 1, 'ipv6', '#section-2.5.2'],
  ['tls13-version', 'Informatique', 'TLS', 'Quelle valeur représente TLS 1.3 dans le champ legacy_version du ClientHello ?', '0x0303', 'Pour la compatibilité, legacy_version reste 0x0303 ; la version est indiquée par supported_versions.', 3, 'tls', '#section-4.2.1'],
  ['tls13-supported-versions', 'Informatique', 'TLS', 'Quelle extension TLS indique les versions réellement prises en charge ?', 'supported_versions', 'Le client et le serveur utilisent l’extension supported_versions pour négocier la version.', 2, 'tls', '#section-4.2.1'],
  ['tls13-early-data', 'Informatique', 'TLS', 'Quelle extension TLS 1.3 permet d’envoyer des données 0-RTT ?', 'early_data', 'L’extension early_data porte la possibilité d’envoyer des données avant le handshake complet.', 3, 'tls', '#section-4.2.10'],
  ['tls13-application-protocol', 'Informatique', 'TLS', 'Quelle extension TLS négocie un protocole applicatif comme HTTP/2 ?', 'application_layer_protocol_negotiation (ALPN)', 'ALPN permet de négocier le protocole applicatif dans le handshake TLS.', 2, 'tls', '#section-4.2.11'],
  ['tls13-server-name', 'Informatique', 'TLS', 'Quelle extension TLS permet au client d’indiquer le nom du serveur visé ?', 'server_name', 'server_name transporte notamment le nom d’hôte demandé.', 1, 'tls', '#section-4.2.2'],
  ['tls13-handshake-types', 'Informatique', 'TLS', 'Quels sont les deux messages qui encadrent le handshake TLS 1.3 côté client et serveur ?', 'ClientHello et ServerHello', 'Le handshake commence par ClientHello et la réponse serveur correspondante est ServerHello.', 1, 'tls', '#section-4.1'],
  ['tls13-key-schedule', 'Informatique', 'TLS', 'Quel mécanisme dérive les secrets de trafic dans TLS 1.3 ?', 'HKDF', 'TLS 1.3 utilise HKDF pour la dérivation des secrets.', 2, 'tls', '#section-7.1'],
  ['tls13-record-content-type', 'Informatique', 'TLS', 'Quel champ indique le type du contenu TLS dans un enregistrement ?', 'opaque type', 'Le champ type du record indique le type de contenu TLS transporté.', 2, 'tls', '#section-5.1'],
  ['unicode-general-category', 'Technologie', 'Unicode', 'Quelle propriété Unicode classe les caractères comme lettres, chiffres ou ponctuation ?', 'General_Category', 'General_Category attribue à chaque caractère une catégorie générale.', 1, 'unicode', '#General_Category'],
  ['unicode-code-point', 'Technologie', 'Unicode', 'Comment Unicode appelle-t-il la valeur entière associée à un caractère ?', 'Point de code', 'Un code point est une valeur entière dans l’espace de codes Unicode.', 1, 'unicode', '#Code_Point'],
  ['unicode-hex-code-point', 'Technologie', 'Unicode', 'Dans quelle base les points de code Unicode sont-ils généralement écrits dans la documentation ?', 'Hexadécimale', 'La notation U+ suivie de chiffres hexadécimaux est utilisée pour les points de code.', 1, 'unicode', '#Code_Point'],
  ['unicode-script', 'Technologie', 'Unicode', 'Quelle propriété Unicode indique le système d’écriture associé à un caractère ?', 'Script', 'La propriété Script identifie l’écriture ou le script auquel le caractère appartient.', 1, 'unicode', '#Script'],
  ['unicode-block', 'Technologie', 'Unicode', 'Qu’est-ce qu’un bloc Unicode ?', 'Une plage contiguë de points de code', 'Les blocs Unicode sont des plages contiguës utilisées pour organiser l’espace de codes.', 1, 'unicode', '#Blocks'],
  ['unicode-combining-class', 'Technologie', 'Unicode', 'Quelle propriété Unicode est utilisée par la normalisation pour ordonner les caractères combinants ?', 'Canonical_Combining_Class', 'La classe de combinaison canonique sert notamment à l’ordre canonique.', 2, 'unicode', '#Canonical_Combining_Class'],
  ['unicode-bidi-class', 'Technologie', 'Unicode', 'Quelle propriété Unicode décrit le comportement directionnel bidirectionnel d’un caractère ?', 'Bidi_Class', 'Bidi_Class donne la classe utilisée par l’algorithme bidirectionnel.', 2, 'unicode', '#Bidi_Class'],
  ['unicode-decomposition', 'Technologie', 'Unicode', 'Quelle propriété Unicode décrit une décomposition d’un caractère ?', 'Decomposition_Mapping', 'Decomposition_Mapping associe un caractère à une séquence de décomposition.', 2, 'unicode', '#Decomposition_Mapping'],
  ['unicode-age', 'Technologie', 'Unicode', 'Quelle propriété indique la version Unicode dans laquelle un caractère a été ajouté ?', 'Age', 'Age donne la première version de l’Unicode Standard où le caractère apparaît.', 2, 'unicode', '#Age'],
  ['unicode-numeric-value', 'Technologie', 'Unicode', 'Quelle propriété Unicode fournit la valeur numérique d’un caractère numérique ?', 'Numeric_Value', 'Numeric_Value associe une valeur numérique aux caractères qui en possèdent une.', 1, 'unicode', '#Numeric_Value'],
] as const;

function provenanceFor(row: Row): QuestionProvenance {
  const source = SOURCES[row[7]];
  const url = row[8].startsWith('http') ? row[8] : `${source.base}${row[8]}`;
  return {
    factId: row[0],
    source: source.name,
    url,
    license: source.license,
    checkedAt: CHECKED_AT,
    method: 'lecture-et-verification-manuelle-de-la-section-normative-citee',
    status: 'approved',
  };
}

export const VERIFIED_TECHNOLOGY_QUESTIONS: readonly Question[] = ROWS.map(([id, category, subcategory, question, answer, explanation, difficulty, sourceKey, anchor]) => ({
  id: `verified-${id}`,
  factId: id,
  version: 1,
  type: 'flashcard',
  category,
  subcategory,
  question,
  answer,
  acceptedAnswers: [answer],
  explanation,
  difficulty,
  tags: ['standards', subcategory.toLowerCase()],
  source: SOURCES[sourceKey].name,
  provenance: provenanceFor([id, category, subcategory, question, answer, explanation, difficulty, sourceKey, anchor]),
}));

export const VERIFIED_TECHNOLOGY_BATCH: VerifiedContentBatch = {
  id: 'technology-network-standards-2026-09',
  questions: VERIFIED_TECHNOLOGY_QUESTIONS,
  source: 'IETF RFC Editor and Unicode Consortium standards',
  sourceUrl: 'https://www.rfc-editor.org/',
  license: `${IETF_LICENSE}; ${UNICODE_LICENSE}`,
  checkedAt: CHECKED_AT,
  method: 'chaque fait correspond à une section normative explicitement citée; aucune variante générée',
  status: 'approved',
};

export default VERIFIED_TECHNOLOGY_BATCH;
