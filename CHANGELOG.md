# Changelog

All notable changes to PinchChat are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/), with [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Added
- **Copy button on assistant messages** — one-click copy of the full message text (`dd5b56e`)
- **Animated UI demo on landing page** — interactive fake chat showing tool call visualization, typing effects, and thinking indicators (`d26c498`)
- **Connection lost/reconnected banner** — visual feedback when WebSocket connection drops or recovers (`32a2166`)
- **Scroll-to-bottom button** — appears when scrolled up in chat, click to jump to latest messages (`b56c80a`)
- **Inline image display** — images render directly in chat with a click-to-expand lightbox (`762a5f2`)
- **Logo integration** — PinchChat logo in header, login screen, favicon, and OG meta tags (`97c16be`)
- **GitHub Pages landing page** — feature showcase at [marlburrow.github.io/pinchchat](https://marlburrow.github.io/pinchchat/) (`4f47732`)
- **Docker support** — Dockerfile, docker-compose.yml, CI auto-publish to `ghcr.io/marlburrow/pinchchat` (`5fd7300`)
- **Language selector** — toggle EN/FR in the header at runtime (`9b3aed4`)
- **Copy button on code blocks** — one-click copy for code snippets (`b6a989b`)
- **i18n support** — English and French UI via `VITE_LOCALE` env var (`99b7db9`)
- **Runtime login screen** — enter gateway credentials at runtime, no secrets baked into the build (`36f9480`)
- **NO_REPLY filtering** — silently hides agent NO_REPLY messages from the chat (`8834b2a`)
- **GitHub Actions CI** — lint and build checks on every push and PR (`a6b26b0`)
- **Issue templates** — bug report and feature request forms (`2d3ee47`)
- **Contributing guide** — CONTRIBUTING.md with dev setup and PR guidelines (`e34643d`)

### Changed
- **Features rewrite** — pragmatic feature descriptions in README and landing page, highlighting real differentiators (`f556c8d`)
- **Architecture diagram** — replaced ASCII art with a Mermaid diagram in the README (`02d2ab3`)
- **Smart auto-scroll** — only auto-scrolls when the user is near the bottom (`3e7a596`)
- **Timestamp locale** — uses the selected i18n locale instead of hardcoded `fr-FR` (`88c393e`)
- **Vendor code-splitting** — split React and markdown dependencies into separate chunks, eliminating the 500KB bundle warning (`d7bdf3b`)

### Fixed
- i18n key for 'Parameters' label in tool call expansion (`195ad62`)
- Sidebar overlay closes on Escape key + aria-hidden for screen readers (`91c22a1`)
- Corrected `index.html` lang attribute, page title, favicon path, and added SEO meta tags (`24c7d00`)
- Localized all hardcoded French strings to English with ARIA accessibility attributes (`3370916`)
- Fixed OpenClaw repo link in README (`604f902`)

### Renamed
- **ClawChat → PinchChat** — full project rename across all files, configs, and docs (`d58c34f`)

## [1.0.0] — 2026-02-11

Initial release as ClawChat.

- Dark neon theme with Tailwind CSS v4
- WebSocket connection to OpenClaw gateway
- Session sidebar with token usage progress bars
- Markdown rendering with GFM and syntax highlighting
- Tool call badges with expandable JSON panels
- Thinking block display (collapsible)
- File upload with image compression and drag & drop
- Streaming response display
