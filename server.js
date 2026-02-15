#!/usr/bin/env node
/**
 * Lightweight backend proxy for PinchChat.
 *
 * Serves the built frontend (dist/) and exposes API endpoints
 * that require server-side filesystem access (e.g. agent provisioning).
 *
 * Usage:
 *   node server.js                          # port 3100
 *   PORT=8080 node server.js                # custom port
 */

import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3100;
const DIST = join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

/** Provision a new agent — mirrors agentslack/lib/openclaw/provision.ts */
async function provisionAgent({ id, name, model, soul_md, skills }) {
  const openclawDir = join(homedir(), '.openclaw');
  const workspaceDir = join(openclawDir, `workspace-${id}`);
  const agentDir = join(openclawDir, 'agents', id, 'agent');

  // 1. Create workspace directory
  mkdirSync(workspaceDir, { recursive: true });

  // 2. Write SOUL.md (optional — only if provided)
  if (soul_md) {
    writeFileSync(join(workspaceDir, 'SOUL.md'), soul_md);
  }

  // 3. Create agent directory
  mkdirSync(agentDir, { recursive: true });

  // 4. Update openclaw.json
  const configPath = join(openclawDir, 'openclaw.json');
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));

  if (!config.agents) config.agents = {};
  if (!config.agents.list) config.agents.list = [];

  // Check for duplicate
  if (config.agents.list.some(a => a.id === id)) {
    throw new Error(`Agent "${id}" already exists`);
  }

  const entry = {
    id,
    workspace: workspaceDir,
    agentDir,
  };
  if (name) entry.identity = { name };
  if (model) entry.model = model;
  if (skills && skills.length > 0) {
    entry.tools = { allow: skills };
  }

  config.agents.list.push(entry);
  writeFileSync(configPath, JSON.stringify(config, null, 2));

  // 5. Wait for OpenClaw hot-reload
  await new Promise(resolve => setTimeout(resolve, 2000));

  return entry;
}

const server = createServer(async (req, res) => {
  // CORS for dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // API routes
  if (req.url === '/api/agents' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { id, name, model, soul_md, skills } = body;
      if (!id) return json(res, 400, { error: 'id is required' });

      const agent = await provisionAgent({ id, name, model, soul_md, skills });
      return json(res, 200, { ok: true, agent });
    } catch (err) {
      return json(res, 500, { error: err.message });
    }
  }

  // DELETE /api/agents — remove an agent from openclaw.json
  if (req.url === '/api/agents' && req.method === 'DELETE') {
    try {
      const body = await readBody(req);
      const { id } = body;
      if (!id) return json(res, 400, { error: 'id is required' });

      const openclawDir = join(homedir(), '.openclaw');
      const configPath = join(openclawDir, 'openclaw.json');
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));

      if (!config.agents?.list) return json(res, 404, { error: 'No agents configured' });

      const idx = config.agents.list.findIndex(a => a.id === id);
      if (idx === -1) return json(res, 404, { error: `Agent "${id}" not found` });

      config.agents.list.splice(idx, 1);
      writeFileSync(configPath, JSON.stringify(config, null, 2));

      // Wait for OpenClaw hot-reload
      await new Promise(resolve => setTimeout(resolve, 2000));

      return json(res, 200, { ok: true });
    } catch (err) {
      return json(res, 500, { error: err.message });
    }
  }

  // Static file serving (dist/)
  let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url);
  if (!existsSync(filePath)) filePath = join(DIST, 'index.html'); // SPA fallback

  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`PinchChat server running at http://localhost:${PORT}`);
});
