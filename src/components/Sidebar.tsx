import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { X, Sparkles, Search, Trash2, Columns2, Bot, Plus } from 'lucide-react';
import type { Session, Agent } from '../types';
import { useT } from '../hooks/useLocale';
import { relativeTime } from '../lib/relativeTime';

const WIDTH_KEY = 'pinchchat-sidebar-width';
const MIN_WIDTH = 220;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 288; // w-72

function getSavedWidth(): number {
  try {
    const v = localStorage.getItem(WIDTH_KEY);
    if (v) {
      const n = Number(v);
      if (n >= MIN_WIDTH && n <= MAX_WIDTH) return n;
    }
  } catch { /* noop */ }
  return DEFAULT_WIDTH;
}

/** Shorten model ID to a readable label, e.g. "claude-3-opus" → "opus" */
function shortModel(model?: string): string | null {
  if (!model) return null;
  // Common patterns: "claude-3-opus-20240229", "gpt-4o", "gemini-1.5-pro"
  const parts = model.split('-');
  // Try to find a recognizable name segment (opus, sonnet, haiku, gpt, gemini…)
  const known = ['opus', 'sonnet', 'haiku', 'flash', 'pro', 'nano'];
  for (const p of parts) {
    const lower = p.toLowerCase();
    if (known.includes(lower)) return lower;
  }
  // Fallback: last meaningful part
  return model.length > 16 ? model.slice(0, 14) + '…' : model;
}

interface AgentChat {
  agent: Agent;
  session?: Session;
  key: string;
}

interface Props {
  sessions: Session[];
  agents: Agent[];
  activeSession: string;
  onSwitch: (key: string) => void;
  onDelete: (key: string) => void;
  onSplit?: (key: string) => void;
  splitSession?: string | null;
  open: boolean;
  onClose: () => void;
  onCreateAgent?: (opts: { id: string; name?: string; emoji?: string }) => Promise<void>;
  onDeleteAgent?: (agentId: string) => Promise<void>;
}

export function Sidebar({ sessions, agents, activeSession, onSwitch, onDelete, onSplit, splitSession, open, onClose, onCreateAgent, onDeleteAgent }: Props) {
  const t = useT();
  const [filter, setFilter] = useState('');
  const [focusIdx, setFocusIdx] = useState(-1);
  const [width, setWidth] = useState(getSavedWidth);
  const [dragging, setDragging] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [newAgentId, setNewAgentId] = useState('');
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmoji, setNewAgentEmoji] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [confirmDeleteAgent, setConfirmDeleteAgent] = useState<string | null>(null);
  const [isDeletingAgent, setIsDeletingAgent] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startW: 0 });

  // Drag-to-resize logic
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragRef.current.startW + (clientX - dragRef.current.startX)));
      setWidth(newW);
    };
    const onUp = () => {
      setDragging(false);
      // persist on release
      localStorage.setItem(WIDTH_KEY, String(width));
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
  }, [dragging, width]);

  // Save width when it changes (debounced via drag end above, but also on unmount)
  useEffect(() => {
    return () => { try { localStorage.setItem(WIDTH_KEY, String(width)); } catch { /* noop */ } };
  }, [width]);

  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragRef.current = { startX: clientX, startW: width };
    setDragging(true);
  }, [width]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search when sidebar is open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Derive active agent id from activeSession key (format: agent:<id>:main)
  const activeAgentId = useMemo(() => {
    const m = activeSession.match(/^agent:([^:]+):/);
    return m ? m[1] : undefined;
  }, [activeSession]);

  const updateFilter = useCallback((value: string) => {
    setFilter(value);
    setFocusIdx(-1);
  }, []);

  const handleCreateAgent = useCallback(async () => {
    const id = newAgentId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!id || !onCreateAgent) return;
    setIsCreating(true);
    setCreateError(null);
    try {
      await onCreateAgent({ id, name: newAgentName.trim() || undefined, emoji: newAgentEmoji.trim() || undefined });
      setShowCreateAgent(false);
      setNewAgentId('');
      setNewAgentName('');
      setNewAgentEmoji('');
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message
        : typeof err === 'string' ? err
        : 'Failed to create agent';
      setCreateError(msg);
    } finally {
      setIsCreating(false);
    }
  }, [newAgentId, newAgentName, newAgentEmoji, onCreateAgent, onClose]);

  // Build the agent chat list: one entry per agent, matched to its best session
  const agentChats = useMemo((): AgentChat[] => {
    const sessionsByAgent = new Map<string, Session[]>();
    for (const s of sessions) {
      if (!s.agentId) continue;
      const list = sessionsByAgent.get(s.agentId) || [];
      list.push(s);
      sessionsByAgent.set(s.agentId, list);
    }

    return agents.map(agent => {
      const agentSessions = sessionsByAgent.get(agent.id) || [];
      // Session key format: agent:<agentId>:main (maps to ~/.openclaw/agents/<agentId>/sessions/)
      const canonicalKey = `agent:${agent.id}:main`;
      let best = agentSessions.find(s => s.key === canonicalKey);
      // Fallback: most recently updated session for this agent
      if (!best && agentSessions.length > 0) {
        best = agentSessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
      }
      return { agent, session: best, key: canonicalKey };
    }).sort((a, b) => {
      // Sort by most recently updated (agents with sessions first), then by agent id
      const aTime = a.session?.updatedAt || 0;
      const bTime = b.session?.updatedAt || 0;
      if (aTime !== bTime) return bTime - aTime;
      return a.agent.id.localeCompare(b.agent.id);
    });
  }, [agents, sessions]);

  // Filter agents by name
  const filtered = useMemo(() => {
    if (!filter.trim()) return agentChats;
    const q = filter.toLowerCase();
    return agentChats.filter(ac => {
      const name = ac.agent.identity?.name || ac.agent.id;
      return name.toLowerCase().includes(q);
    });
  }, [agentChats, filter]);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside role="navigation" aria-label={t('sidebar.title')} className={`fixed lg:relative top-0 left-0 h-full bg-[var(--pc-bg-base)]/95 border-r border-pc-border z-50 transform ${dragging ? '' : 'transition-transform'} lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} flex flex-col backdrop-blur-xl`} style={{ width: `${width}px` }}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-pc-border">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-r from-cyan-400/15 to-violet-500/15 blur-lg" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-pc-border bg-pc-elevated/50">
                <Sparkles className="h-4 w-4 text-pc-accent-light" />
              </div>
            </div>
            <span className="font-semibold text-sm text-pc-text tracking-wide">{t('sidebar.title')}</span>
          </div>
          <div className="flex items-center gap-1">
            {onCreateAgent && (
              <button
                onClick={() => setShowCreateAgent(true)}
                className="p-1.5 rounded-xl hover:bg-[var(--pc-hover)] text-pc-text-secondary transition-colors"
                aria-label={t('sidebar.newAgent')}
                title={t('sidebar.newAgent')}
              >
                <Plus size={16} />
              </button>
            )}
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-xl hover:bg-[var(--pc-hover)] text-pc-text-secondary transition-colors" aria-label={t('sidebar.close')}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Agent search */}
        {agents.length > 3 && (
          <div className="px-2 pt-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pc-text-muted" />
              <input
                ref={searchRef}
                type="text"
                value={filter}
                onChange={e => updateFilter(e.target.value)}
                placeholder={t('sidebar.search')}
                aria-label={t('sidebar.search')}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-pc-border bg-pc-elevated/30 text-xs text-pc-text placeholder:text-pc-text-muted outline-none focus:ring-1 focus:ring-[var(--pc-accent-dim)] transition-all"
              />
              {filter && (
                <button
                  onClick={() => updateFilter('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-pc-text-muted hover:text-pc-text"
                  aria-label={t('sidebar.clearSearch')}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto py-2 px-2"
          role="listbox"
          aria-label={t('sidebar.title')}
          tabIndex={0}
          onKeyDown={(e) => {
            const len = filtered.length;
            if (!len) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              const next = focusIdx < len - 1 ? focusIdx + 1 : 0;
              setFocusIdx(next);
              listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[next]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              const prev = focusIdx > 0 ? focusIdx - 1 : len - 1;
              setFocusIdx(prev);
              listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[prev]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter' && focusIdx >= 0 && focusIdx < len) {
              e.preventDefault();
              onSwitch(filtered[focusIdx].key);
              onClose();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              onClose();
            }
          }}
        >
          {agents.length === 0 && (
            <div className="px-3 py-8 text-center text-pc-text-muted text-sm">{t('sidebar.empty')}</div>
          )}
          {agents.length > 0 && filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-pc-text-muted text-xs">{t('sidebar.noResults')}</div>
          )}
          {filtered.map((ac, idx) => {
            const isActive = ac.agent.id === activeAgentId;
            const isFocused = idx === focusIdx;
            const session = ac.session;
            const isStreaming = session?.isActive;
            const hasUnread = session?.hasUnread;
            const displayName = ac.agent.identity?.name || ac.agent.id;
            const model = shortModel(ac.agent.model || session?.model);

            return (
              <button
                key={ac.agent.id}
                role="option"
                aria-selected={isActive}
                onClick={() => { onSwitch(ac.key); onClose(); }}
                onMouseEnter={() => setFocusIdx(idx)}
                className={`group/item w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left text-sm transition-all mb-1 ${
                  isActive
                    ? 'bg-[var(--pc-hover)] text-pc-accent-light border border-pc-border shadow-[0_0_12px_rgba(34,211,238,0.08)]'
                    : isStreaming
                      ? 'bg-violet-500/5 text-violet-200 border border-violet-500/15 shadow-[0_0_10px_rgba(168,85,247,0.06)]'
                      : 'text-pc-text-secondary hover:bg-[var(--pc-hover)] border border-transparent'
                } ${isFocused && !isActive ? 'ring-1 ring-[var(--pc-accent-dim)]' : ''}`}
              >
                {/* Agent icon */}
                <div className="relative shrink-0">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    isActive ? 'bg-[var(--pc-accent-glow)] border border-[var(--pc-accent-dim)]' : 'bg-pc-elevated/50 border border-pc-border'
                  }`}>
                    {ac.agent.identity?.emoji ? (
                      <span className="text-base leading-none">{ac.agent.identity.emoji}</span>
                    ) : (
                      <Bot size={16} className={isActive ? 'text-pc-accent-light' : 'text-pc-text-muted'} />
                    )}
                  </div>
                  {isStreaming && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(168,85,247,0.7)] animate-pulse" />
                  )}
                  {hasUnread && !isActive && (
                    <span className="absolute -top-0.5 -left-0.5 h-2 w-2 rounded-full bg-[var(--pc-accent)] shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                  )}
                </div>

                {/* Agent info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="flex-1 truncate font-medium">{displayName}</span>
                    {(() => {
                      const rel = relativeTime(session?.updatedAt);
                      return rel ? <span className="text-[10px] text-pc-text-muted tabular-nums shrink-0">{rel}</span> : null;
                    })()}
                    {onSplit && session && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onSplit(ac.key); }}
                        className={`shrink-0 p-0.5 rounded-lg transition-all ${
                          splitSession === ac.key
                            ? 'text-pc-accent opacity-80 hover:opacity-100'
                            : 'text-pc-text-faint opacity-0 group-hover/item:opacity-60 hover:!opacity-100 hover:text-pc-text-secondary'
                        }`}
                        title={t('sidebar.openSplit')}
                        aria-label={t('sidebar.openSplit')}
                      >
                        <Columns2 size={12} />
                      </button>
                    )}
                    {session && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(ac.key); }}
                        className="shrink-0 p-0.5 rounded-lg transition-all text-pc-text-faint opacity-0 group-hover/item:opacity-60 hover:!opacity-100 hover:text-red-400"
                        title={t('sidebar.delete')}
                        aria-label={t('sidebar.delete')}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                    {onDeleteAgent && !ac.agent.isDefault && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteAgent(ac.agent.id); }}
                        className="shrink-0 p-0.5 rounded-lg transition-all text-pc-text-faint opacity-0 group-hover/item:opacity-60 hover:!opacity-100 hover:text-red-400"
                        title={t('sidebar.deleteAgent')}
                        aria-label={t('sidebar.deleteAgent')}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  {model && (
                    <span className="text-[10px] text-pc-text-muted">{model}</span>
                  )}
                  {session?.lastMessagePreview && (
                    <p className="text-[11px] text-pc-text-muted truncate mt-0.5 leading-tight">{session.lastMessagePreview.replace(/\s+/g, ' ').slice(0, 80)}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {/* Footer with version */}
        <div className="px-4 py-3 border-t border-pc-border flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-300/60 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--pc-accent-dim)] shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-300/50 shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
          <span className="ml-1 text-[9px] text-pc-text-faint select-all" title={`PinchChat v${__APP_VERSION__}`}>v{__APP_VERSION__}</span>
        </div>
        {/* Resize drag handle */}
        <div
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          className={`hidden lg:block absolute top-0 right-0 w-1.5 h-full cursor-col-resize group/resize z-10 ${dragging ? 'bg-[var(--pc-accent-glow)]' : 'hover:bg-[var(--pc-accent-glow)]'} transition-colors`}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          aria-valuenow={width}
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
        >
          <div className={`absolute top-1/2 -translate-y-1/2 right-0 w-0.5 h-8 rounded-full ${dragging ? 'bg-[var(--pc-accent-dim)]' : 'bg-transparent group-hover/resize:bg-[var(--pc-accent-dim)]'} transition-colors`} />
        </div>
      </aside>
      {/* Prevent text selection while dragging */}
      {dragging && <div className="fixed inset-0 z-[60] cursor-col-resize" />}
      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" onClick={() => setConfirmDelete(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-72 bg-[var(--pc-bg-base)] border border-pc-border-strong rounded-2xl p-5 shadow-2xl">
            <p className="text-sm text-pc-text mb-4">{t('sidebar.deleteConfirm')}</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1.5 text-xs rounded-xl border border-pc-border-strong text-pc-text-secondary hover:bg-[var(--pc-hover)] transition-colors"
              >
                {t('sidebar.deleteCancel')}
              </button>
              <button
                onClick={() => { onDelete(confirmDelete); setConfirmDelete(null); }}
                className="px-3 py-1.5 text-xs rounded-xl bg-red-500/20 text-red-300 border border-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                {t('sidebar.delete')}
              </button>
            </div>
          </div>
        </>
      )}
      {/* Delete agent confirmation dialog */}
      {confirmDeleteAgent && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" onClick={() => setConfirmDeleteAgent(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-72 bg-[var(--pc-bg-base)] border border-pc-border-strong rounded-2xl p-5 shadow-2xl">
            <p className="text-sm text-pc-text mb-4">{t('sidebar.deleteAgentConfirm')}</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDeleteAgent(null)}
                disabled={isDeletingAgent}
                className="px-3 py-1.5 text-xs rounded-xl border border-pc-border-strong text-pc-text-secondary hover:bg-[var(--pc-hover)] transition-colors disabled:opacity-50"
              >
                {t('sidebar.cancel')}
              </button>
              <button
                onClick={async () => {
                  if (!onDeleteAgent) return;
                  setIsDeletingAgent(true);
                  try {
                    await onDeleteAgent(confirmDeleteAgent);
                    setConfirmDeleteAgent(null);
                  } catch {
                    // keep dialog open on error
                  } finally {
                    setIsDeletingAgent(false);
                  }
                }}
                disabled={isDeletingAgent}
                className="px-3 py-1.5 text-xs rounded-xl bg-red-500/20 text-red-300 border border-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {isDeletingAgent ? t('sidebar.deleting') : t('sidebar.deleteAgent')}
              </button>
            </div>
          </div>
        </>
      )}
      {/* Create agent modal */}
      {showCreateAgent && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" onClick={() => { setShowCreateAgent(false); setCreateError(null); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-80 bg-[var(--pc-bg-base)] border border-pc-border-strong rounded-2xl p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-pc-text mb-4">{t('sidebar.newAgentTitle')}</h3>
            <form
              onSubmit={(e) => { e.preventDefault(); handleCreateAgent(); }}
              className="flex flex-col gap-3"
            >
              <div>
                <label className="block text-xs text-pc-text-secondary mb-1">{t('sidebar.agentId')} *</label>
                <input
                  type="text"
                  value={newAgentId}
                  onChange={e => setNewAgentId(e.target.value)}
                  placeholder={t('sidebar.agentIdPlaceholder')}
                  className="w-full px-3 py-1.5 rounded-xl border border-pc-border bg-pc-elevated/30 text-xs text-pc-text placeholder:text-pc-text-muted outline-none focus:ring-1 focus:ring-[var(--pc-accent-dim)] transition-all"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-pc-text-secondary mb-1">{t('sidebar.agentName')}</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={e => setNewAgentName(e.target.value)}
                  placeholder={t('sidebar.agentNamePlaceholder')}
                  className="w-full px-3 py-1.5 rounded-xl border border-pc-border bg-pc-elevated/30 text-xs text-pc-text placeholder:text-pc-text-muted outline-none focus:ring-1 focus:ring-[var(--pc-accent-dim)] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-pc-text-secondary mb-1">{t('sidebar.agentEmoji')}</label>
                <input
                  type="text"
                  value={newAgentEmoji}
                  onChange={e => setNewAgentEmoji(e.target.value)}
                  placeholder={t('sidebar.agentEmojiPlaceholder')}
                  className="w-full px-3 py-1.5 rounded-xl border border-pc-border bg-pc-elevated/30 text-xs text-pc-text placeholder:text-pc-text-muted outline-none focus:ring-1 focus:ring-[var(--pc-accent-dim)] transition-all"
                  maxLength={2}
                />
              </div>
              {createError && (
                <p className="text-xs text-red-400">{createError}</p>
              )}
              <div className="flex gap-2 justify-end mt-1">
                <button
                  type="button"
                  onClick={() => { setShowCreateAgent(false); setCreateError(null); }}
                  className="px-3 py-1.5 text-xs rounded-xl border border-pc-border-strong text-pc-text-secondary hover:bg-[var(--pc-hover)] transition-colors"
                >
                  {t('sidebar.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!newAgentId.trim() || isCreating}
                  className="px-3 py-1.5 text-xs rounded-xl bg-[var(--pc-accent-glow)] text-pc-accent-light border border-[var(--pc-accent-dim)] hover:bg-[var(--pc-accent-dim)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? t('sidebar.creating') : t('sidebar.create')}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
