# 🦞 PinchChat

[![CI](https://github.com/MarlBurroW/pinchchat/actions/workflows/ci.yml/badge.svg)](https://github.com/MarlBurroW/pinchchat/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

**A sleek, dark-themed webchat UI for [OpenClaw](https://github.com/openclaw/openclaw) — monitor sessions, stream responses, and inspect tool calls in real-time.**

> 🖼️ *Screenshot coming soon — [contributions welcome](https://github.com/MarlBurroW/pinchchat/issues)!*

## ✨ Features

- 🌑 **Dark neon theme** — easy on the eyes, built with Tailwind CSS v4
- 📊 **Token progress bars** — track token usage per session in real-time
- 🔧 **Tool call badges** — expandable panels with syntax-highlighted JSON
- 📋 **Session sidebar** — browse active sessions with live activity indicators
- 📝 **Markdown rendering** — full GFM support with code highlighting
- 📎 **File upload** — attach files to your messages
- ⚡ **Streaming responses** — watch the AI think in real-time
- 🔐 **Runtime login** — enter gateway credentials at runtime, no secrets in the build
- 🌐 **i18n support** — English and French, configurable via `VITE_LOCALE`

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **OpenClaw gateway** running and accessible

### Installation

```bash
git clone https://github.com/MarlBurroW/pinchchat.git
cd pinchchat
npm install
cp .env.example .env
```

Optionally edit `.env` to pre-fill the gateway URL:

```env
VITE_GATEWAY_WS_URL=ws://localhost:18789
VITE_LOCALE=en          # or "fr" for French UI
```

Start the dev server:

```bash
npm run dev
```

### Production

```bash
npm run build
npx vite preview
```

Or serve the `dist/` folder with nginx, Caddy, or any static file server.

## ⚙️ Configuration

All configuration is optional — credentials are entered at runtime via the login screen.

| Variable | Description | Default |
|---|---|---|
| `VITE_GATEWAY_WS_URL` | Pre-fill the gateway URL on the login screen | `ws://<hostname>:18789` |
| `VITE_LOCALE` | UI language (`en` or `fr`) | `en` |

> **Note:** The gateway token is entered at runtime and stored in `localStorage` — it is never baked into the build.

## 🛠 Tech Stack

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) 7
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Radix UI](https://www.radix-ui.com/) primitives
- [highlight.js](https://highlightjs.org/) via rehype-highlight
- [Lucide React](https://lucide.dev/) icons
- [react-markdown](https://github.com/remarkjs/react-markdown) with GFM

## 📄 License

[MIT](LICENSE) © Nicolas Varrot

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🔗 Links

- [OpenClaw](https://github.com/openclaw/openclaw) — the AI agent platform PinchChat connects to
