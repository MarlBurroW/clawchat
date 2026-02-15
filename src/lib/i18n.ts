/**
 * Lightweight reactive i18n — no external deps.
 *
 * Locale priority: localStorage > VITE_LOCALE > navigator.language > 'en'
 * Changing locale at runtime triggers subscribed React components to re-render.
 */

const STORAGE_KEY = 'pinchchat-locale';

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
  'login.wsHint': 'URL must start with ws:// or wss://',

  // Header
  'header.title': 'PinchChat',
  'header.connected': 'Connected',
  'header.disconnected': 'Disconnected',
  'header.logout': 'Logout',
  'header.toggleSidebar': 'Toggle sidebar',
  'header.changeLanguage': 'Change language',
  'header.soundOn': 'Enable notification sound',
  'header.soundOff': 'Disable notification sound',

  // Chat
  'chat.welcome': 'PinchChat',
  'chat.welcomeSub': 'Send a message to get started',
  'chat.loadingHistory': 'Loading messages…',
  'chat.inputPlaceholder': 'Type a message…',
  'chat.inputLabel': 'Message',
  'chat.attachFile': 'Attach file',
  'chat.send': 'Send',
  'chat.stop': 'Stop',
  'chat.showPreview': 'Preview markdown',
  'chat.hidePreview': 'Hide preview',
  'chat.scrollToBottom': 'New messages',
  'chat.collapseTools': 'Collapse all tools',
  'chat.expandTools': 'Expand all tools',
  'chat.messages': 'Chat messages',
  'chat.thinking': 'Thinking…',

  // Sidebar
  'sidebar.title': 'Chats',
  'sidebar.empty': 'No chats yet',
  'sidebar.startChat': 'Click an agent to start chatting',
  'sidebar.search': 'Search agents…',
  'sidebar.noResults': 'No matching agents',
  'sidebar.pin': 'Pin session',
  'sidebar.unpin': 'Unpin session',
  'sidebar.pinned': 'Pinned',
  'sidebar.delete': 'Delete session',
  'sidebar.deleteConfirm': 'Delete this session? This cannot be undone.',
  'sidebar.deleteCancel': 'Cancel',
  'sidebar.openSplit': 'Open in split view',
  'sidebar.close': 'Close sidebar',
  'sidebar.clearSearch': 'Clear search',
  'split.close': 'Close split view',
  'app.mainChat': 'Main chat',
  'app.splitPane': 'Split pane',
  'app.skipToChat': 'Skip to chat input',

  // Thinking
  'thinking.label': 'Thinking',
  'thinking.reasoning': 'Reasoning…',

  // Tool call
  'tool.parameters': 'Parameters',
  'tool.result': 'Result',

  // Connection banner
  'connection.reconnecting': 'Connection lost — reconnecting…',
  'connection.reconnected': 'Reconnected!',

  // Message actions
  'message.copy': 'Copy message',
  'message.copied': 'Copied!',
  'message.retry': 'Resend message',
  'message.metadata': 'Message details',
  'message.rawJson': 'Raw JSON',
  'message.hideRawJson': 'Hide raw JSON',

  // Timestamps
  'time.yesterday': 'Yesterday',
  'time.today': 'Today',

  // Keyboard shortcuts
  'shortcuts.title': 'Keyboard Shortcuts',
  'shortcuts.send': 'Send message',
  'shortcuts.newline': 'New line',
  'shortcuts.search': 'Search sessions',
  'shortcuts.switchSession': 'Previous / next session',
  'shortcuts.closeSidebar': 'Close sidebar / search',
  'shortcuts.stop': 'Stop generation',
  'shortcuts.help': 'Show shortcuts',
  'shortcuts.close': 'Close',
  'shortcuts.chatSection': 'Chat',

  // Error boundary
  'error.title': 'Something went wrong',
  'error.description': 'An unexpected error occurred while rendering the interface. You can try again or reload the page.',
  'error.retry': 'Try again',
  'error.reload': 'Reload page',
  'shortcuts.navigationSection': 'Navigation',
  'shortcuts.generalSection': 'General',

  // Export
  'header.export': 'Export conversation as Markdown',

  // Theme
  'theme.title': 'Theme',
  'theme.mode': 'Mode',
  'theme.accent': 'Accent',
  'theme.system': 'System',
  'theme.dark': 'Dark',
  'theme.light': 'Light',
  'theme.oled': 'OLED',

  // Message search
  'search.placeholder': 'Search messages…',
  'search.noResults': '0 results',
  'search.prev': 'Previous match',
  'search.next': 'Next match',
  'shortcuts.searchMessages': 'Search messages',

  // Agent picker
  'sidebar.agents': 'Agents',
  'sidebar.allAgents': 'All',
  'sidebar.newSession': 'New session',
  'sidebar.newSessionFor': 'New session for {agent}',
  'sidebar.newAgent': 'New agent',
  'sidebar.newAgentTitle': 'Create New Agent',
  'sidebar.agentId': 'Agent ID',
  'sidebar.agentIdPlaceholder': 'e.g. researcher',
  'sidebar.agentName': 'Display Name',
  'sidebar.agentNamePlaceholder': 'e.g. Research Assistant',
  'sidebar.agentEmoji': 'Emoji',
  'sidebar.agentEmojiPlaceholder': 'e.g. 🔍',
  'sidebar.create': 'Create',
  'sidebar.cancel': 'Cancel',
  'sidebar.creating': 'Creating…',
  'sidebar.deleteAgent': 'Delete agent',
  'sidebar.deleteAgentConfirm': 'Delete this agent? This will remove it from your configuration.',
  'sidebar.deleting': 'Deleting…',
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
  'login.wsHint': 'L\'URL doit commencer par ws:// ou wss://',

  'header.title': 'PinchChat',
  'header.connected': 'Connecté',
  'header.disconnected': 'Déconnecté',
  'header.logout': 'Déconnexion',
  'header.toggleSidebar': 'Afficher/masquer la barre latérale',
  'header.changeLanguage': 'Changer de langue',
  'header.soundOn': 'Activer le son de notification',
  'header.soundOff': 'Désactiver le son de notification',

  'chat.welcome': 'PinchChat',
  'chat.welcomeSub': 'Envoyez un message pour commencer',
  'chat.loadingHistory': 'Chargement des messages…',
  'chat.inputPlaceholder': 'Tapez un message…',
  'chat.inputLabel': 'Message',
  'chat.attachFile': 'Joindre un fichier',
  'chat.send': 'Envoyer',
  'chat.stop': 'Arrêter',
  'chat.showPreview': 'Aperçu markdown',
  'chat.hidePreview': 'Masquer l\'aperçu',
  'chat.scrollToBottom': 'Nouveaux messages',
  'chat.collapseTools': 'Replier tous les outils',
  'chat.expandTools': 'Déplier tous les outils',
  'chat.messages': 'Messages du chat',
  'chat.thinking': 'Réflexion…',

  'sidebar.title': 'Conversations',
  'sidebar.empty': 'Aucune conversation',
  'sidebar.startChat': 'Cliquez sur un agent pour commencer',
  'sidebar.search': 'Rechercher des agents…',
  'sidebar.noResults': 'Aucun agent trouvé',
  'sidebar.pin': 'Épingler la session',
  'sidebar.unpin': 'Désépingler la session',
  'sidebar.pinned': 'Épinglées',
  'sidebar.delete': 'Supprimer la session',
  'sidebar.deleteConfirm': 'Supprimer cette session ? Cette action est irréversible.',
  'sidebar.deleteCancel': 'Annuler',
  'sidebar.openSplit': 'Ouvrir en vue scindée',
  'sidebar.close': 'Fermer la barre latérale',
  'sidebar.clearSearch': 'Effacer la recherche',
  'split.close': 'Fermer la vue scindée',
  'app.mainChat': 'Chat principal',
  'app.splitPane': 'Volet scindé',
  'app.skipToChat': 'Aller au champ de saisie',

  'thinking.label': 'Réflexion',
  'thinking.reasoning': 'Réflexion…',

  'tool.parameters': 'Paramètres',
  'tool.result': 'Résultat',

  'connection.reconnecting': 'Connexion perdue — reconnexion…',
  'connection.reconnected': 'Reconnecté !',

  'message.copy': 'Copier le message',
  'message.copied': 'Copié !',
  'message.retry': 'Renvoyer le message',
  'message.metadata': 'Détails du message',
  'message.rawJson': 'JSON brut',
  'message.hideRawJson': 'Masquer le JSON brut',

  'time.yesterday': 'Hier',
  'time.today': "Aujourd'hui",

  'shortcuts.title': 'Raccourcis clavier',
  'shortcuts.send': 'Envoyer le message',
  'shortcuts.newline': 'Nouvelle ligne',
  'shortcuts.search': 'Rechercher des sessions',
  'shortcuts.switchSession': 'Session précédente / suivante',
  'shortcuts.closeSidebar': 'Fermer la barre / recherche',
  'shortcuts.stop': 'Arrêter la génération',
  'shortcuts.help': 'Afficher les raccourcis',
  'shortcuts.close': 'Fermer',
  'shortcuts.chatSection': 'Chat',

  'error.title': 'Quelque chose s\'est mal passé',
  'error.description': 'Une erreur inattendue est survenue lors de l\'affichage. Vous pouvez réessayer ou recharger la page.',
  'error.retry': 'Réessayer',
  'error.reload': 'Recharger',
  'shortcuts.navigationSection': 'Navigation',
  'shortcuts.generalSection': 'Général',

  'header.export': 'Exporter la conversation en Markdown',

  'theme.title': 'Thème',
  'theme.mode': 'Mode',
  'theme.accent': 'Accent',
  'theme.system': 'Système',
  'theme.dark': 'Sombre',
  'theme.light': 'Clair',
  'theme.oled': 'OLED',

  'search.placeholder': 'Rechercher dans les messages…',
  'search.noResults': '0 résultat',
  'search.prev': 'Résultat précédent',
  'search.next': 'Résultat suivant',
  'shortcuts.searchMessages': 'Rechercher dans les messages',

  'sidebar.agents': 'Agents',
  'sidebar.allAgents': 'Tous',
  'sidebar.newSession': 'Nouvelle session',
  'sidebar.newSessionFor': 'Nouvelle session pour {agent}',
  'sidebar.newAgent': 'Nouvel agent',
  'sidebar.newAgentTitle': 'Créer un nouvel agent',
  'sidebar.agentId': 'ID de l\'agent',
  'sidebar.agentIdPlaceholder': 'ex. chercheur',
  'sidebar.agentName': 'Nom d\'affichage',
  'sidebar.agentNamePlaceholder': 'ex. Assistant de recherche',
  'sidebar.agentEmoji': 'Emoji',
  'sidebar.agentEmojiPlaceholder': 'ex. 🔍',
  'sidebar.create': 'Créer',
  'sidebar.cancel': 'Annuler',
  'sidebar.creating': 'Création…',
  'sidebar.deleteAgent': 'Supprimer l\'agent',
  'sidebar.deleteAgentConfirm': 'Supprimer cet agent ? Il sera retiré de votre configuration.',
  'sidebar.deleting': 'Suppression…',
};

export type TranslationKey = keyof typeof en;

const messages: Record<string, Record<string, string>> = { en, fr };

export const supportedLocales = Object.keys(messages) as string[];

/** Labels shown in the language selector */
export const localeLabels: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
};

function resolveInitialLocale(): string {
  // 1. localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && messages[stored]) return stored;
  } catch { /* SSR or blocked storage */ }

  // 2. VITE_LOCALE env var
  const envLocale = (import.meta.env.VITE_LOCALE as string) || '';
  if (envLocale && messages[envLocale]) return envLocale;

  // 3. navigator.language
  if (typeof navigator !== 'undefined') {
    const navLang = navigator.language?.split('-')[0];
    if (navLang && messages[navLang]) return navLang;
  }

  // 4. fallback
  return 'en';
}

let currentLocale = resolveInitialLocale();
let dict = messages[currentLocale] || messages.en;

type Listener = () => void;
const listeners = new Set<Listener>();

/** Subscribe to locale changes. Returns unsubscribe function. */
export function onLocaleChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Get the current locale code */
export function getLocale(): string {
  return currentLocale;
}

/** Switch locale at runtime. Persists to localStorage and notifies subscribers. */
export function setLocale(loc: string): void {
  if (!messages[loc] || loc === currentLocale) return;
  currentLocale = loc;
  dict = messages[loc];
  try { localStorage.setItem(STORAGE_KEY, loc); } catch { /* noop */ }
  listeners.forEach((fn) => fn());
}

/** Return the translated string for the given key, falling back to English. */
export function t(key: TranslationKey): string {
  return dict[key] ?? (messages.en as Record<string, string>)[key] ?? key;
}

// Keep backward-compat named export
export { currentLocale as locale };
