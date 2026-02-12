# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest release | ✅ |
| Older releases | ❌ |

We recommend always running the latest version of PinchChat.

## Security Model

PinchChat is a **static frontend** that connects to your OpenClaw gateway via WebSocket. Key security properties:

- **No server-side code** — PinchChat is a pure client-side SPA served as static files
- **Runtime authentication** — gateway URL and token are entered at login and stored in `localStorage`, never baked into the build
- **No secrets in the image** — the Docker image contains only static assets; credentials are provided at runtime
- **No telemetry** — PinchChat does not phone home, collect analytics, or send data to third parties

### Token Handling

- The gateway token is stored in the browser's `localStorage`
- It is transmitted only over the WebSocket connection to your gateway
- Logging out clears the token from storage
- **If you serve PinchChat over the network, use HTTPS** to protect the token in transit

### Recommendations

- Always use `wss://` (WebSocket over TLS) in production
- Restrict gateway access to trusted networks or use a reverse proxy with authentication
- Rotate your OpenClaw gateway token periodically
- Do not share your browser's `localStorage` data

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public issue**
2. Email **contact@nicolasvarrot.fr** with:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
3. You will receive a response within 72 hours

We appreciate responsible disclosure and will credit reporters (unless they prefer anonymity).
