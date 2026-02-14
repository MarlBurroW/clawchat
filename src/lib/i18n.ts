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
  'chat.suggestions': 'Try asking...',
  'chat.suggestion1': 'Summarize my recent emails',
  'chat.suggestion2': "What's on my calendar today?",
  'chat.suggestion3': 'Search the web for latest news',
  'chat.suggestion4': 'Help me write a script',
  'chat.loadingHistory': 'Loading messages…',
  'chat.inputPlaceholder': 'Type a message…',
  'chat.inputLabel': 'Message',
  'chat.attachFile': 'Attach file',
  'chat.send': 'Send',
  'chat.stop': 'Stop',
  'chat.showPreview': 'Preview markdown',
  'chat.hidePreview': 'Hide preview',
  'chat.scrollToBottom': 'New messages',
  'chat.scrollDown': 'Scroll to bottom',
  'chat.collapseTools': 'Collapse all tools',
  'chat.expandTools': 'Expand all tools',
  'chat.messages': 'Chat messages',
  'chat.thinking': 'Thinking…',

  // Sidebar
  'sidebar.title': 'Sessions',
  'sidebar.empty': 'No sessions',
  'sidebar.search': 'Search sessions…',
  'sidebar.noResults': 'No matching sessions',
  'sidebar.pin': 'Pin session',
  'sidebar.unpin': 'Unpin session',
  'sidebar.pinned': 'Pinned',
  'sidebar.delete': 'Delete session',
  'sidebar.deleteConfirm': 'Delete this session? This cannot be undone.',
  'sidebar.deleteCancel': 'Cancel',
  'sidebar.openSplit': 'Open in split view',
  'sidebar.close': 'Close sidebar',
  'sidebar.clearSearch': 'Clear search',
  'sidebar.filterAll': 'All',
  'sidebar.filterActive': 'Active',
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
  'header.compact': 'Compact',
  'header.compacting': 'Compacting…',
  'header.sessionInfo': 'Session Info',
  'sessionInfo.sessionKey': 'Session Key',
  'sessionInfo.channel': 'Channel',
  'sessionInfo.kind': 'Kind',
  'sessionInfo.model': 'Model',
  'sessionInfo.agent': 'Agent',
  'sessionInfo.messages': 'Messages',
  'sessionInfo.totalTokens': 'Total Tokens',
  'sessionInfo.inputTokens': 'Input',
  'sessionInfo.outputTokens': 'Output',
  'sessionInfo.contextWindow': 'Context',
  'sessionInfo.lastActive': 'Last Active',

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

  // Send shortcut setting
  'settings.sendShortcut': 'Send with',
  'settings.sendEnter': 'Enter',
  'settings.sendCtrlEnter': 'Ctrl+Enter',

  // Bookmarks
  'message.bookmark': 'Bookmark message',
  'message.removeBookmark': 'Remove bookmark',
  'chat.bookmarks': 'Bookmarks',
  'chat.export': 'Export conversation',
  'chat.contextCompacted': 'Context compacted — older messages cached locally',
  'slash.commands': 'Commands',
  'slash.status': 'Show session status & usage',
  'slash.reasoning': 'Toggle reasoning mode',
  'slash.verbose': 'Toggle verbose output',
  'slash.model': 'Switch model for this session',
  'slash.compact': 'Compact conversation context',
  'slash.reset': 'Reset the session',
  'slash.help': 'Show available commands',
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
  'chat.suggestions': 'Essayez par exemple...',
  'chat.suggestion1': 'Résume mes derniers emails',
  'chat.suggestion2': "Qu'est-ce que j'ai au calendrier aujourd'hui ?",
  'chat.suggestion3': 'Cherche sur le web les dernières actus',
  'chat.suggestion4': "Aide-moi à écrire un script",
  'chat.loadingHistory': 'Chargement des messages…',
  'chat.inputPlaceholder': 'Tapez un message…',
  'chat.inputLabel': 'Message',
  'chat.attachFile': 'Joindre un fichier',
  'chat.send': 'Envoyer',
  'chat.stop': 'Arrêter',
  'chat.showPreview': 'Aperçu markdown',
  'chat.hidePreview': 'Masquer l\'aperçu',
  'chat.scrollToBottom': 'Nouveaux messages',
  'chat.scrollDown': 'Défiler en bas',
  'chat.collapseTools': 'Replier tous les outils',
  'chat.expandTools': 'Déplier tous les outils',
  'chat.messages': 'Messages du chat',
  'chat.thinking': 'Réflexion…',

  'sidebar.title': 'Sessions',
  'sidebar.empty': 'Aucune session',
  'sidebar.search': 'Rechercher…',
  'sidebar.noResults': 'Aucun résultat',
  'sidebar.pin': 'Épingler la session',
  'sidebar.unpin': 'Désépingler la session',
  'sidebar.pinned': 'Épinglées',
  'sidebar.delete': 'Supprimer la session',
  'sidebar.deleteConfirm': 'Supprimer cette session ? Cette action est irréversible.',
  'sidebar.deleteCancel': 'Annuler',
  'sidebar.openSplit': 'Ouvrir en vue scindée',
  'sidebar.close': 'Fermer la barre latérale',
  'sidebar.clearSearch': 'Effacer la recherche',
  'sidebar.filterAll': 'Tout',
  'sidebar.filterActive': 'Actives',
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
  'header.compact': 'Compacter',
  'header.compacting': 'Compaction…',
  'header.sessionInfo': 'Infos session',
  'sessionInfo.sessionKey': 'Clé session',
  'sessionInfo.channel': 'Canal',
  'sessionInfo.kind': 'Type',
  'sessionInfo.model': 'Modèle',
  'sessionInfo.agent': 'Agent',
  'sessionInfo.messages': 'Messages',
  'sessionInfo.totalTokens': 'Tokens total',
  'sessionInfo.inputTokens': 'Entrée',
  'sessionInfo.outputTokens': 'Sortie',
  'sessionInfo.contextWindow': 'Contexte',
  'sessionInfo.lastActive': 'Dernière activité',

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

  'settings.sendShortcut': 'Envoyer avec',
  'settings.sendEnter': 'Entrée',
  'settings.sendCtrlEnter': 'Ctrl+Entrée',

  'message.bookmark': 'Marquer le message',
  'message.removeBookmark': 'Retirer le marque-page',
  'chat.bookmarks': 'Marque-pages',
  'chat.export': 'Exporter la conversation',
  'chat.contextCompacted': 'Contexte compacté — anciens messages en cache local',
  'slash.commands': 'Commandes',
  'slash.status': 'Afficher le statut et l\'utilisation',
  'slash.reasoning': 'Activer/désactiver le raisonnement',
  'slash.verbose': 'Activer/désactiver le mode verbeux',
  'slash.model': 'Changer de modèle pour cette session',
  'slash.compact': 'Compacter le contexte',
  'slash.reset': 'Réinitialiser la session',
  'slash.help': 'Afficher les commandes disponibles',
};

const es: Record<keyof typeof en, string> = {
  'login.title': 'PinchChat',
  'login.subtitle': 'Conéctate a tu gateway OpenClaw',
  'login.gatewayUrl': 'URL del gateway',
  'login.token': 'Token',
  'login.tokenPlaceholder': 'Introduce tu token de gateway',
  'login.connect': 'Conectar',
  'login.connecting': 'Conectando…',
  'login.showToken': 'Mostrar token',
  'login.hideToken': 'Ocultar token',
  'login.storedLocally': 'Las credenciales se guardan localmente en tu navegador',
  'login.wsHint': 'La URL debe empezar con ws:// o wss://',

  'header.title': 'PinchChat',
  'header.connected': 'Conectado',
  'header.disconnected': 'Desconectado',
  'header.logout': 'Cerrar sesión',
  'header.toggleSidebar': 'Mostrar/ocultar barra lateral',
  'header.changeLanguage': 'Cambiar idioma',
  'header.soundOn': 'Activar sonido de notificación',
  'header.soundOff': 'Desactivar sonido de notificación',

  'chat.welcome': 'PinchChat',
  'chat.welcomeSub': 'Envía un mensaje para comenzar',
  'chat.suggestions': 'Prueba a preguntar...',
  'chat.suggestion1': 'Resume mis últimos correos',
  'chat.suggestion2': '¿Qué tengo en el calendario hoy?',
  'chat.suggestion3': 'Busca en la web las últimas noticias',
  'chat.suggestion4': 'Ayúdame a escribir un script',
  'chat.loadingHistory': 'Cargando mensajes…',
  'chat.inputPlaceholder': 'Escribe un mensaje…',
  'chat.inputLabel': 'Mensaje',
  'chat.attachFile': 'Adjuntar archivo',
  'chat.send': 'Enviar',
  'chat.stop': 'Detener',
  'chat.showPreview': 'Vista previa markdown',
  'chat.hidePreview': 'Ocultar vista previa',
  'chat.scrollToBottom': 'Nuevos mensajes',
  'chat.scrollDown': 'Ir al final',
  'chat.collapseTools': 'Contraer todas las herramientas',
  'chat.expandTools': 'Expandir todas las herramientas',
  'chat.messages': 'Mensajes del chat',
  'chat.thinking': 'Pensando…',

  'sidebar.title': 'Sesiones',
  'sidebar.empty': 'Sin sesiones',
  'sidebar.search': 'Buscar sesiones…',
  'sidebar.noResults': 'Sin resultados',
  'sidebar.pin': 'Fijar sesión',
  'sidebar.unpin': 'Desfijar sesión',
  'sidebar.pinned': 'Fijadas',
  'sidebar.delete': 'Eliminar sesión',
  'sidebar.deleteConfirm': '¿Eliminar esta sesión? Esta acción no se puede deshacer.',
  'sidebar.deleteCancel': 'Cancelar',
  'sidebar.openSplit': 'Abrir en vista dividida',
  'sidebar.close': 'Cerrar barra lateral',
  'sidebar.clearSearch': 'Limpiar búsqueda',
  'sidebar.filterAll': 'Todas',
  'sidebar.filterActive': 'Activas',
  'split.close': 'Cerrar vista dividida',
  'app.mainChat': 'Chat principal',
  'app.splitPane': 'Panel dividido',
  'app.skipToChat': 'Ir al campo de entrada',

  'thinking.label': 'Pensamiento',
  'thinking.reasoning': 'Razonando…',

  'tool.parameters': 'Parámetros',
  'tool.result': 'Resultado',

  'connection.reconnecting': 'Conexión perdida — reconectando…',
  'connection.reconnected': '¡Reconectado!',

  'message.copy': 'Copiar mensaje',
  'message.copied': '¡Copiado!',
  'message.retry': 'Reenviar mensaje',
  'message.metadata': 'Detalles del mensaje',
  'message.rawJson': 'JSON sin formato',
  'message.hideRawJson': 'Ocultar JSON sin formato',

  'time.yesterday': 'Ayer',
  'time.today': 'Hoy',

  'shortcuts.title': 'Atajos de teclado',
  'shortcuts.send': 'Enviar mensaje',
  'shortcuts.newline': 'Nueva línea',
  'shortcuts.search': 'Buscar sesiones',
  'shortcuts.switchSession': 'Sesión anterior / siguiente',
  'shortcuts.closeSidebar': 'Cerrar barra / búsqueda',
  'shortcuts.stop': 'Detener generación',
  'shortcuts.help': 'Mostrar atajos',
  'shortcuts.close': 'Cerrar',
  'shortcuts.chatSection': 'Chat',

  'error.title': 'Algo salió mal',
  'error.description': 'Ocurrió un error inesperado al mostrar la interfaz. Puedes intentar de nuevo o recargar la página.',
  'error.retry': 'Reintentar',
  'error.reload': 'Recargar página',
  'shortcuts.navigationSection': 'Navegación',
  'shortcuts.generalSection': 'General',

  'header.export': 'Exportar conversación como Markdown',
  'header.compact': 'Compactar',
  'header.compacting': 'Compactando…',
  'header.sessionInfo': 'Info de sesión',
  'sessionInfo.sessionKey': 'Clave de sesión',
  'sessionInfo.channel': 'Canal',
  'sessionInfo.kind': 'Tipo',
  'sessionInfo.model': 'Modelo',
  'sessionInfo.agent': 'Agente',
  'sessionInfo.messages': 'Mensajes',
  'sessionInfo.totalTokens': 'Tokens totales',
  'sessionInfo.inputTokens': 'Entrada',
  'sessionInfo.outputTokens': 'Salida',
  'sessionInfo.contextWindow': 'Contexto',
  'sessionInfo.lastActive': 'Última actividad',

  'theme.title': 'Tema',
  'theme.mode': 'Modo',
  'theme.accent': 'Acento',
  'theme.system': 'Sistema',
  'theme.dark': 'Oscuro',
  'theme.light': 'Claro',
  'theme.oled': 'OLED',

  'search.placeholder': 'Buscar en mensajes…',
  'search.noResults': '0 resultados',
  'search.prev': 'Resultado anterior',
  'search.next': 'Resultado siguiente',
  'shortcuts.searchMessages': 'Buscar en mensajes',

  'settings.sendShortcut': 'Enviar con',
  'settings.sendEnter': 'Enter',
  'settings.sendCtrlEnter': 'Ctrl+Enter',

  'message.bookmark': 'Marcar mensaje',
  'message.removeBookmark': 'Quitar marcador',
  'chat.bookmarks': 'Marcadores',
  'chat.export': 'Exportar conversación',
  'chat.contextCompacted': 'Contexto compactado — mensajes anteriores en caché local',
  'slash.commands': 'Comandos',
  'slash.status': 'Mostrar estado y uso de la sesión',
  'slash.reasoning': 'Activar/desactivar razonamiento',
  'slash.verbose': 'Activar/desactivar modo detallado',
  'slash.model': 'Cambiar modelo para esta sesión',
  'slash.compact': 'Compactar contexto de conversación',
  'slash.reset': 'Reiniciar la sesión',
  'slash.help': 'Mostrar comandos disponibles',
};

export type TranslationKey = keyof typeof en;

const de: Record<keyof typeof en, string> = {
  'login.title': 'PinchChat',
  'login.subtitle': 'Mit deinem OpenClaw-Gateway verbinden',
  'login.gatewayUrl': 'Gateway-URL',
  'login.token': 'Token',
  'login.tokenPlaceholder': 'Gateway-Token eingeben',
  'login.connect': 'Verbinden',
  'login.connecting': 'Verbinde…',
  'login.showToken': 'Token anzeigen',
  'login.hideToken': 'Token verbergen',
  'login.storedLocally': 'Zugangsdaten werden lokal in deinem Browser gespeichert',
  'login.wsHint': 'URL muss mit ws:// oder wss:// beginnen',

  'header.title': 'PinchChat',
  'header.connected': 'Verbunden',
  'header.disconnected': 'Getrennt',
  'header.logout': 'Abmelden',
  'header.toggleSidebar': 'Seitenleiste ein-/ausblenden',
  'header.changeLanguage': 'Sprache ändern',
  'header.soundOn': 'Benachrichtigungston aktivieren',
  'header.soundOff': 'Benachrichtigungston deaktivieren',

  'chat.welcome': 'PinchChat',
  'chat.welcomeSub': 'Sende eine Nachricht, um zu beginnen',
  'chat.suggestions': 'Probiere z.\u00a0B. …',
  'chat.suggestion1': 'Fasse meine letzten E-Mails zusammen',
  'chat.suggestion2': 'Was steht heute in meinem Kalender?',
  'chat.suggestion3': 'Suche im Web nach aktuellen Nachrichten',
  'chat.suggestion4': 'Hilf mir, ein Skript zu schreiben',
  'chat.loadingHistory': 'Nachrichten werden geladen…',
  'chat.inputPlaceholder': 'Nachricht eingeben…',
  'chat.inputLabel': 'Nachricht',
  'chat.attachFile': 'Datei anhängen',
  'chat.send': 'Senden',
  'chat.stop': 'Stoppen',
  'chat.showPreview': 'Markdown-Vorschau',
  'chat.hidePreview': 'Vorschau ausblenden',
  'chat.scrollToBottom': 'Neue Nachrichten',
  'chat.scrollDown': 'Nach unten scrollen',
  'chat.collapseTools': 'Alle Tools einklappen',
  'chat.expandTools': 'Alle Tools ausklappen',
  'chat.messages': 'Chat-Nachrichten',
  'chat.thinking': 'Denkt nach…',

  'sidebar.title': 'Sitzungen',
  'sidebar.empty': 'Keine Sitzungen',
  'sidebar.search': 'Sitzungen suchen…',
  'sidebar.noResults': 'Keine Treffer',
  'sidebar.pin': 'Sitzung anheften',
  'sidebar.unpin': 'Sitzung lösen',
  'sidebar.pinned': 'Angeheftet',
  'sidebar.delete': 'Sitzung löschen',
  'sidebar.deleteConfirm': 'Diese Sitzung löschen? Dies kann nicht rückgängig gemacht werden.',
  'sidebar.deleteCancel': 'Abbrechen',
  'sidebar.openSplit': 'In geteilter Ansicht öffnen',
  'sidebar.close': 'Seitenleiste schließen',
  'sidebar.clearSearch': 'Suche leeren',
  'sidebar.filterAll': 'Alle',
  'sidebar.filterActive': 'Aktive',
  'split.close': 'Geteilte Ansicht schließen',
  'app.mainChat': 'Haupt-Chat',
  'app.splitPane': 'Geteiltes Fenster',
  'app.skipToChat': 'Zum Eingabefeld springen',

  'thinking.label': 'Nachdenken',
  'thinking.reasoning': 'Denkt nach…',

  'tool.parameters': 'Parameter',
  'tool.result': 'Ergebnis',

  'connection.reconnecting': 'Verbindung verloren — wird wiederhergestellt…',
  'connection.reconnected': 'Wieder verbunden!',

  'message.copy': 'Nachricht kopieren',
  'message.copied': 'Kopiert!',
  'message.retry': 'Nachricht erneut senden',
  'message.metadata': 'Nachrichtendetails',
  'message.rawJson': 'Roh-JSON',
  'message.hideRawJson': 'Roh-JSON ausblenden',

  'time.yesterday': 'Gestern',
  'time.today': 'Heute',

  'shortcuts.title': 'Tastenkürzel',
  'shortcuts.send': 'Nachricht senden',
  'shortcuts.newline': 'Neue Zeile',
  'shortcuts.search': 'Sitzungen suchen',
  'shortcuts.switchSession': 'Vorherige / nächste Sitzung',
  'shortcuts.closeSidebar': 'Seitenleiste / Suche schließen',
  'shortcuts.stop': 'Generierung stoppen',
  'shortcuts.help': 'Tastenkürzel anzeigen',
  'shortcuts.close': 'Schließen',
  'shortcuts.chatSection': 'Chat',

  'error.title': 'Etwas ist schiefgelaufen',
  'error.description': 'Beim Rendern der Oberfläche ist ein unerwarteter Fehler aufgetreten. Du kannst es erneut versuchen oder die Seite neu laden.',
  'error.retry': 'Erneut versuchen',
  'error.reload': 'Seite neu laden',
  'shortcuts.navigationSection': 'Navigation',
  'shortcuts.generalSection': 'Allgemein',

  'header.export': 'Unterhaltung als Markdown exportieren',
  'header.compact': 'Kompaktieren',
  'header.compacting': 'Kompaktiere…',
  'header.sessionInfo': 'Sitzungsinfo',
  'sessionInfo.sessionKey': 'Sitzungsschlüssel',
  'sessionInfo.channel': 'Kanal',
  'sessionInfo.kind': 'Typ',
  'sessionInfo.model': 'Modell',
  'sessionInfo.agent': 'Agent',
  'sessionInfo.messages': 'Nachrichten',
  'sessionInfo.totalTokens': 'Tokens gesamt',
  'sessionInfo.inputTokens': 'Eingabe',
  'sessionInfo.outputTokens': 'Ausgabe',
  'sessionInfo.contextWindow': 'Kontext',
  'sessionInfo.lastActive': 'Letzte Aktivität',

  'theme.title': 'Design',
  'theme.mode': 'Modus',
  'theme.accent': 'Akzent',
  'theme.system': 'System',
  'theme.dark': 'Dunkel',
  'theme.light': 'Hell',
  'theme.oled': 'OLED',

  'search.placeholder': 'In Nachrichten suchen…',
  'search.noResults': '0 Ergebnisse',
  'search.prev': 'Vorheriger Treffer',
  'search.next': 'Nächster Treffer',
  'shortcuts.searchMessages': 'In Nachrichten suchen',

  'settings.sendShortcut': 'Senden mit',
  'settings.sendEnter': 'Enter',
  'settings.sendCtrlEnter': 'Strg+Enter',

  'message.bookmark': 'Nachricht markieren',
  'message.removeBookmark': 'Lesezeichen entfernen',
  'chat.bookmarks': 'Lesezeichen',
  'chat.export': 'Unterhaltung exportieren',
  'chat.contextCompacted': 'Kontext kompaktiert — ältere Nachrichten lokal zwischengespeichert',
  'slash.commands': 'Befehle',
  'slash.status': 'Sitzungsstatus und Nutzung anzeigen',
  'slash.reasoning': 'Reasoning-Modus umschalten',
  'slash.verbose': 'Ausführliche Ausgabe umschalten',
  'slash.model': 'Modell für diese Sitzung wechseln',
  'slash.compact': 'Gesprächskontext kompaktieren',
  'slash.reset': 'Sitzung zurücksetzen',
  'slash.help': 'Verfügbare Befehle anzeigen',
};

const ja: Record<keyof typeof en, string> = {
  'login.title': 'PinchChat',
  'login.subtitle': 'OpenClawゲートウェイに接続',
  'login.gatewayUrl': 'ゲートウェイURL',
  'login.token': 'トークン',
  'login.tokenPlaceholder': 'ゲートウェイトークンを入力',
  'login.connect': '接続',
  'login.connecting': '接続中…',
  'login.showToken': 'トークンを表示',
  'login.hideToken': 'トークンを非表示',
  'login.storedLocally': '認証情報はブラウザにローカル保存されます',
  'login.wsHint': 'URLはws://またはwss://で始まる必要があります',

  'header.title': 'PinchChat',
  'header.connected': '接続済み',
  'header.disconnected': '切断',
  'header.logout': 'ログアウト',
  'header.toggleSidebar': 'サイドバーの表示切替',
  'header.changeLanguage': '言語を変更',
  'header.soundOn': '通知音を有効にする',
  'header.soundOff': '通知音を無効にする',

  'chat.welcome': 'PinchChat',
  'chat.welcomeSub': 'メッセージを送信して始めましょう',
  'chat.suggestions': '例えば…',
  'chat.suggestion1': '最近のメールをまとめて',
  'chat.suggestion2': '今日のカレンダーは？',
  'chat.suggestion3': '最新ニュースをウェブで検索して',
  'chat.suggestion4': 'スクリプトを書くのを手伝って',
  'chat.loadingHistory': 'メッセージを読み込み中…',
  'chat.inputPlaceholder': 'メッセージを入力…',
  'chat.inputLabel': 'メッセージ',
  'chat.attachFile': 'ファイルを添付',
  'chat.send': '送信',
  'chat.stop': '停止',
  'chat.showPreview': 'Markdownプレビュー',
  'chat.hidePreview': 'プレビューを非表示',
  'chat.scrollToBottom': '新しいメッセージ',
  'chat.scrollDown': '一番下へスクロール',
  'chat.collapseTools': 'すべてのツールを折りたたむ',
  'chat.expandTools': 'すべてのツールを展開',
  'chat.messages': 'チャットメッセージ',
  'chat.thinking': '思考中…',

  'sidebar.title': 'セッション',
  'sidebar.empty': 'セッションなし',
  'sidebar.search': 'セッションを検索…',
  'sidebar.noResults': '結果なし',
  'sidebar.pin': 'セッションをピン留め',
  'sidebar.unpin': 'ピン留めを解除',
  'sidebar.pinned': 'ピン留め',
  'sidebar.delete': 'セッションを削除',
  'sidebar.deleteConfirm': 'このセッションを削除しますか？元に戻せません。',
  'sidebar.deleteCancel': 'キャンセル',
  'sidebar.openSplit': '分割ビューで開く',
  'sidebar.close': 'サイドバーを閉じる',
  'sidebar.clearSearch': '検索をクリア',
  'sidebar.filterAll': 'すべて',
  'sidebar.filterActive': 'アクティブ',
  'split.close': '分割ビューを閉じる',
  'app.mainChat': 'メインチャット',
  'app.splitPane': '分割ペイン',
  'app.skipToChat': '入力欄へ移動',

  'thinking.label': '思考',
  'thinking.reasoning': '推論中…',

  'tool.parameters': 'パラメータ',
  'tool.result': '結果',

  'connection.reconnecting': '接続が切断されました — 再接続中…',
  'connection.reconnected': '再接続しました！',

  'message.copy': 'メッセージをコピー',
  'message.copied': 'コピーしました！',
  'message.retry': 'メッセージを再送信',
  'message.metadata': 'メッセージの詳細',
  'message.rawJson': '生JSON',
  'message.hideRawJson': '生JSONを非表示',

  'time.yesterday': '昨日',
  'time.today': '今日',

  'shortcuts.title': 'キーボードショートカット',
  'shortcuts.send': 'メッセージを送信',
  'shortcuts.newline': '改行',
  'shortcuts.search': 'セッションを検索',
  'shortcuts.switchSession': '前 / 次のセッション',
  'shortcuts.closeSidebar': 'サイドバー / 検索を閉じる',
  'shortcuts.stop': '生成を停止',
  'shortcuts.help': 'ショートカットを表示',
  'shortcuts.close': '閉じる',
  'shortcuts.chatSection': 'チャット',

  'error.title': 'エラーが発生しました',
  'error.description': 'インターフェースの表示中に予期しないエラーが発生しました。再試行するかページをリロードしてください。',
  'error.retry': '再試行',
  'error.reload': 'ページをリロード',
  'shortcuts.navigationSection': 'ナビゲーション',
  'shortcuts.generalSection': '全般',

  'header.export': '会話をMarkdownでエクスポート',
  'header.compact': 'コンパクト化',
  'header.compacting': 'コンパクト化中…',
  'header.sessionInfo': 'セッション情報',
  'sessionInfo.sessionKey': 'セッションキー',
  'sessionInfo.channel': 'チャンネル',
  'sessionInfo.kind': '種類',
  'sessionInfo.model': 'モデル',
  'sessionInfo.agent': 'エージェント',
  'sessionInfo.messages': 'メッセージ',
  'sessionInfo.totalTokens': '合計トークン',
  'sessionInfo.inputTokens': '入力',
  'sessionInfo.outputTokens': '出力',
  'sessionInfo.contextWindow': 'コンテキスト',
  'sessionInfo.lastActive': '最終アクティブ',

  'theme.title': 'テーマ',
  'theme.mode': 'モード',
  'theme.accent': 'アクセント',
  'theme.system': 'システム',
  'theme.dark': 'ダーク',
  'theme.light': 'ライト',
  'theme.oled': 'OLED',

  'search.placeholder': 'メッセージを検索…',
  'search.noResults': '0件',
  'search.prev': '前の結果',
  'search.next': '次の結果',
  'shortcuts.searchMessages': 'メッセージを検索',

  'settings.sendShortcut': '送信キー',
  'settings.sendEnter': 'Enter',
  'settings.sendCtrlEnter': 'Ctrl+Enter',

  'message.bookmark': 'メッセージをブックマーク',
  'message.removeBookmark': 'ブックマークを削除',
  'chat.bookmarks': 'ブックマーク',
  'chat.export': '会話をエクスポート',
  'chat.contextCompacted': 'コンテキストがコンパクト化されました — 古いメッセージはローカルキャッシュに保存',
  'slash.commands': 'コマンド',
  'slash.status': 'セッションのステータスと使用量を表示',
  'slash.reasoning': '推論モードの切替',
  'slash.verbose': '詳細出力の切替',
  'slash.model': 'このセッションのモデルを変更',
  'slash.compact': '会話コンテキストをコンパクト化',
  'slash.reset': 'セッションをリセット',
  'slash.help': '利用可能なコマンドを表示',
};

const messages: Record<string, Record<string, string>> = { en, fr, es, de, ja };

export const supportedLocales = Object.keys(messages) as string[];

/** Labels shown in the language selector */
export const localeLabels: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  es: 'ES',
  de: 'DE',
  ja: 'JA',
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

// Sync <html lang> on initial load
try { document.documentElement.lang = currentLocale; } catch { /* SSR */ }

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
  try { document.documentElement.lang = loc; } catch { /* SSR */ }
  listeners.forEach((fn) => fn());
}

/** Return the translated string for the given key, falling back to English. */
export function t(key: TranslationKey): string {
  return dict[key] ?? (messages.en as Record<string, string>)[key] ?? key;
}

// Keep backward-compat named export
export { currentLocale as locale };
