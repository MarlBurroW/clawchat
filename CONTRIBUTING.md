# Contributing to PinchChat

Thanks for your interest in contributing! 🦞

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/pinchchat.git
   cd pinchchat
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up your environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenClaw gateway details
   ```
5. **Start the dev server:**
   ```bash
   npm run dev
   ```

## Development

- **Build:** `npm run build` — must pass with 0 errors before submitting a PR
- **Dev server:** `npm run dev` — starts Vite with hot reload
- **Preview:** `npx vite preview` — serve the production build locally

### Project Structure

```
src/
├── components/     # React components
│   ├── chat/       # Chat area (messages, input, streaming)
│   └── sidebar/    # Session list sidebar
├── hooks/          # Custom React hooks (WebSocket, sessions)
├── lib/            # Utilities (markdown, formatting)
├── types/          # TypeScript type definitions
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

## Making Changes

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Ensure `npm run build` passes with no errors
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` — new feature
   - `fix:` — bug fix
   - `docs:` — documentation only
   - `refactor:` — code change that neither fixes a bug nor adds a feature
   - `style:` — formatting, missing semicolons, etc.
   - `perf:` — performance improvement
   - `ci:` — CI/CD changes
5. Push and open a Pull Request

## Reporting Issues

When filing an issue, please include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

## Code Style

- TypeScript strict mode
- Tailwind CSS v4 for styling (no inline styles)
- Functional React components with hooks
- Keep components focused and small

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
