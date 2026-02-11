# FEEDBACK.md — PinchChat Feedback Queue

## Item #1
- **Date:** 2026-02-11
- **Priority:** high
- **Status:** done
- **Completed:** 2026-02-11 — commit `d58c34f`
- **Description:** Migrer le projet de "ClawChat" vers "PinchChat"

## Item #2
- **Date:** 2026-02-11
- **Priority:** high
- **Status:** done
- **Completed:** 2026-02-11 — commit `8834b2a`
- **Description:** Filtrer les messages "NO_REPLY" — ne pas afficher les messages dont le contenu est exactement "NO_REPLY" (ce sont des réponses internes de l'agent qui ne doivent pas être visibles dans le chat)

## Item #3
- **Date:** 2026-02-11
- **Priority:** medium
- **Status:** pending
- **Description:** Ajouter le support i18n (internationalisation) — le projet open-source est en anglais, mais le deploy perso de Nicolas doit rester en français. Soit via une config `.env` (ex: `VITE_LOCALE=fr`), soit via un système de traduction léger. Les strings UI (placeholder input, bouton envoyer, statut connexion, etc.) doivent être configurables.
