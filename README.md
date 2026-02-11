# 🦞 ClawChat

[![CI](https://github.com/MarlBurroW/clawchat/actions/workflows/ci.yml/badge.svg)](https://github.com/MarlBurroW/clawchat/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

**A sleek, dark-themed webchat UI for [OpenClaw](https://github.com/openclaw/openclaw) — monitor sessions, stream responses, and inspect tool calls in real-time.**

> 🖼️ *Screenshot coming soon — [contributions welcome](https://github.com/MarlBurroW/clawchat/issues)!*

## ✨ Features

- 🌑 **Dark neon theme** — easy on the eyes, built with Tailwind CSS v4
- 📊 **Token progress bars** — track token usage per session in real-time
- 🔧 **Tool call badges** — expandable panels with syntax-highlighted JSON
- 📋 **Session sidebar** — browse active sessions with live activity indicators
- 📝 **Markdown rendering** — full GFM support with code highlighting
- 📎 **File upload** — attach files to your messages
- ⚡ **Streaming responses** — watch the AI think in real-time

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **OpenClaw gateway** running and accessible

### Installation

```bash
git clone https://github.com/MarlBurroW/clawchat.git
cd clawchat
npm install
cp .env.example .env
```

Edit `.env` with your gateway details:

```env
VITE_GATEWAY_WS_URL=ws://localhost:18789
VITE_GATEWAY_TOKEN=your-gateway-token-here
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

| Variable | Description | Default |
|---|---|---|
| `VITE_GATEWAY_WS_URL` | WebSocket URL of the OpenClaw gateway | `ws://<hostname>:18789` |
| `VITE_GATEWAY_TOKEN` | Authentication token for the gateway | *(required)* |

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

## 🔗 Links

- [OpenClaw](https://github.com/openclaw/openclaw) — the AI agent platform ClawChat connects to
