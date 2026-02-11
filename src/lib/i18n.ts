/**
 * Lightweight i18n — no external deps.
 * Locale is set via VITE_LOCALE env var (default: "en").
 * Add new languages by adding a record to `messages`.
 */

const en = {
  // Login screen
  'login.title': 'PinchChat',
  'login.subtitle': 'Connect to your OpenClaw gateway',
  'login.gatewayUrl': 'Gateway URL',
  'login.token': 'Token',
  'login.tokenPlaceholder': 'Enter your gateway token',
  'login.connect': 'Connect',
  'login.connecting': 'Connecting…',
  'login.showToken': 'Show token',
  'login.hideToken': 'Hide token',
  'login.storedLocally': 'Credentials are stored locally in your browser',

  // Header
  'header.title': 'PinchChat',
  'header.connected': 'Connected',
  'header.disconnected': 'Disconnected',
  'header.logout': 'Logout',
  'header.toggleSidebar': 'Toggle sidebar',

  // Chat
  'chat.welcome': 'PinchChat',
  'chat.welcomeSub': 'Send a message to get started',
  'chat.inputPlaceholder': 'Type a message…',
  'chat.inputLabel': 'Message',
  'chat.attachFile': 'Attach file',
  'chat.send': 'Send',
  'chat.stop': 'Stop',
  'chat.messages': 'Chat messages',

  // Sidebar
  'sidebar.title': 'Sessions',
  'sidebar.empty': 'No sessions',

  // Thinking
  'thinking.label': 'Thinking',

  // Tool call
  'tool.result': 'Result',

  // Timestamps
  'time.yesterday': 'Yesterday',
} as const;

const fr: Record<keyof typeof en, string> = {
  'login.title': 'PinchChat',
  'login.subtitle': 'Connectez-vous à votre gateway OpenClaw',
  'login.gatewayUrl': 'URL de la gateway',
  'login.token': 'Token',
  'login.tokenPlaceholder': 'Entrez votre token gateway',
  'login.connect': 'Connexion',
  'login.connecting': 'Connexion…',
  'login.showToken': 'Afficher le token',
  'login.hideToken': 'Masquer le token',
  'login.storedLocally': 'Les identifiants sont stockés localement dans votre navigateur',

  'header.title': 'PinchChat',
  'header.connected': 'Connecté',
  'header.disconnected': 'Déconnecté',
  'header.logout': 'Déconnexion',
  'header.toggleSidebar': 'Afficher/masquer la barre latérale',

  'chat.welcome': 'PinchChat',
  'chat.welcomeSub': 'Envoyez un message pour commencer',
  'chat.inputPlaceholder': 'Tapez un message…',
  'chat.inputLabel': 'Message',
  'chat.attachFile': 'Joindre un fichier',
  'chat.send': 'Envoyer',
  'chat.stop': 'Arrêter',
  'chat.messages': 'Messages du chat',

  'sidebar.title': 'Sessions',
  'sidebar.empty': 'Aucune session',

  'thinking.label': 'Réflexion',

  'tool.result': 'Résultat',

  'time.yesterday': 'Hier',
};

const messages: Record<string, Record<string, string>> = { en, fr };

const locale = (import.meta.env.VITE_LOCALE as string) || 'en';
const dict = messages[locale] || messages.en;

/** Return the translated string for the given key, falling back to English. */
export function t(key: keyof typeof en): string {
  return dict[key] ?? (messages.en as Record<string, string>)[key] ?? key;
}

export { locale };
