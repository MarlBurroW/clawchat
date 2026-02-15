import { useEffect, useLayoutEffect, useRef, useCallback, useState, useMemo } from 'react';
import { ChatMessageComponent } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage, ConnectionStatus } from '../types';
import { Bot, ArrowDown, Loader2, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { MessageSearch } from './MessageSearch';
import { useT } from '../hooks/useLocale';
import { getLocale, type TranslationKey } from '../lib/i18n';
import { useToolCollapse } from '../hooks/useToolCollapse';

interface Props {
  messages: ChatMessage[];
  isGenerating: boolean;
  isLoadingHistory: boolean;
  status: ConnectionStatus;
  sessionKey?: string;
  onSend: (text: string, attachments?: Array<{ mimeType: string; fileName: string; content: string }>) => void;
  onAbort: () => void;
  agentAvatarUrl?: string;
}

function isNoReply(msg: ChatMessage): boolean {
  const text = (msg.content || '').trim();
  if (text === 'NO_REPLY') return true;
  const textBlocks = msg.blocks.filter(b => b.type === 'text');
  if (textBlocks.length === 1 && (textBlocks[0] as { text: string }).text.trim() === 'NO_REPLY') return true;
  return false;
}

function hasVisibleContent(msg: ChatMessage): boolean {
  if (msg.role === 'user') return true;
  if (msg.role === 'assistant' && isNoReply(msg)) return false;
  if (msg.blocks.length === 0) return !!msg.content;
  return msg.blocks.some(b =>
    (b.type === 'text' && b.text.trim()) ||
    b.type === 'thinking' ||
    b.type === 'tool_use' ||
    b.type === 'tool_result'
  );
}

function hasStreamedText(messages: ChatMessage[]): boolean {
  if (messages.length === 0) return false;
  const last = messages[messages.length - 1];
  if (last.role !== 'assistant') return false;
  return last.blocks.some(b => b.type === 'text' && b.text.trim().length > 0) || (last.content?.trim().length > 0);
}

function formatDateSeparator(ts: number, t: (k: TranslationKey) => string): string {
  const date = new Date(ts);
  const now = new Date();
  const locale = getLocale();
  const bcp47 = locale === 'fr' ? 'fr-FR' : 'en-US';

  if (date.toDateString() === now.toDateString()) return t('time.today');
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return t('time.yesterday');
  return date.toLocaleDateString(bcp47, { weekday: 'long', day: 'numeric', month: 'long', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function getDateKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Threshold in pixels — if the user is within this distance of the bottom, auto-scroll */
const SCROLL_THRESHOLD = 150;

export function Chat({ messages, isGenerating, isLoadingHistory, status, sessionKey, onSend, onAbort, agentAvatarUrl }: Props) {
  const t = useT();
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const userSentRef = useRef(false);
  const initialScrollDoneRef = useRef(false);
  const prevMsgCountRef = useRef(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const checkIfNearBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom <= SCROLL_THRESHOLD;
    setShowScrollBtn(distanceFromBottom > SCROLL_THRESHOLD * 2);
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  // Track scroll position to decide whether to auto-scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handler = () => checkIfNearBottom();
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, [checkIfNearBottom]);

  // Reset scroll state when switching sessions (messages get cleared)
  useLayoutEffect(() => {
    if (messages.length === 0) {
      initialScrollDoneRef.current = false;
      prevMsgCountRef.current = 0;
    }
  }, [messages.length]);

  // Instantly jump to bottom when messages first appear after a session load.
  // useLayoutEffect ensures this runs after DOM update but before paint — no visible scroll.
  useLayoutEffect(() => {
    if (!initialScrollDoneRef.current && messages.length > 0) {
      initialScrollDoneRef.current = true;
      const el = scrollContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
      isNearBottomRef.current = true;
      prevMsgCountRef.current = messages.length;
    }
  }, [messages.length]);

  // Auto-scroll when messages change, but only if user is near bottom or just sent a message.
  // Skip until initial scroll is done to prevent smooth-scroll animation on load.
  useEffect(() => {
    if (!initialScrollDoneRef.current) return;
    if (messages.length === prevMsgCountRef.current) return;
    prevMsgCountRef.current = messages.length;
    if (userSentRef.current) {
      userSentRef.current = false;
      scrollToBottom('smooth');
      isNearBottomRef.current = true;
      return;
    }
    if (isNearBottomRef.current) {
      scrollToBottom('smooth');
    }
  }, [messages, isGenerating, scrollToBottom]);

  // Wrap onSend to flag that user initiated a message
  const handleSend = useCallback((text: string, attachments?: Array<{ mimeType: string; fileName: string; content: string }>) => {
    userSentRef.current = true;
    onSend(text, attachments);
  }, [onSend]);

  const visibleMessages = useMemo(() => {
    const filtered = messages.filter(hasVisibleContent);
    return filtered.reduce<Array<{ msg: ChatMessage; showSep: boolean }>>((acc, msg) => {
      const dk = getDateKey(msg.timestamp);
      const prevDk = acc.length > 0 ? getDateKey(acc[acc.length - 1].msg.timestamp) : '';
      acc.push({ msg, showSep: dk !== prevDk });
      return acc;
    }, []);
  }, [messages]);

  const showTyping = isGenerating && !hasStreamedText(messages);

  const { globalState, collapseAll, expandAll } = useToolCollapse();
  const hasToolCalls = useMemo(() => messages.some(m => m.blocks.some(b => b.type === 'tool_use' || b.type === 'tool_result')), [messages]);

  // Message search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActiveIndex, setSearchActiveIndex] = useState(0);
  // Compute matches: list of message IDs containing the query
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [] as string[];
    const q = searchQuery.toLowerCase();
    return visibleMessages
      .filter(({ msg }) => {
        const content = msg.content?.toLowerCase() || '';
        if (content.includes(q)) return true;
        return msg.blocks.some(b => {
          if (b.type === 'text' || b.type === 'thinking') return b.text.toLowerCase().includes(q);
          if (b.type === 'tool_result') return b.content.toLowerCase().includes(q);
          return false;
        });
      })
      .map(({ msg }) => msg.id);
  }, [visibleMessages, searchQuery]);

  const handleSearch = useCallback((query: string, activeIndex: number) => {
    setSearchQuery(query);
    setSearchActiveIndex(activeIndex);
  }, []);

  // Scroll to active match
  useEffect(() => {
    if (searchMatches.length === 0) return;
    const id = searchMatches[searchActiveIndex];
    if (!id) return;
    const el = scrollContainerRef.current?.querySelector(`[data-msg-id="${id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [searchActiveIndex, searchMatches]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  // Ctrl+F handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <MessageSearch open={searchOpen} onClose={closeSearch} onSearch={handleSearch} matchCount={searchMatches.length} />
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden relative" role="log" aria-label={t('chat.messages')} aria-live="polite">
        <div className="max-w-4xl mx-auto py-4 w-full">
          {messages.length === 0 && isLoadingHistory && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-pc-text-muted">
              <Loader2 className="h-8 w-8 text-pc-accent-light/60 animate-spin mb-4" />
              <div className="text-sm text-pc-text-muted">{t('chat.loadingHistory')}</div>
            </div>
          )}
          {messages.length === 0 && !isLoadingHistory && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-pc-text-muted">
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-400/10 via-indigo-500/10 to-violet-500/10 blur-2xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-pc-border bg-pc-elevated/40">
                  <Bot className="h-8 w-8 text-pc-accent-light" />
                </div>
              </div>
              <div className="text-lg text-pc-text font-semibold">{t('chat.welcome')}</div>
              <div className="text-sm mt-1 text-pc-text-muted">{t('chat.welcomeSub')}</div>
            </div>
          )}
          {visibleMessages.map(({ msg, showSep }) => {
            const isActiveMatch = searchMatches.length > 0 && searchMatches[searchActiveIndex] === msg.id;
            return (
                <div key={msg.id} data-msg-id={msg.id}>
                  {showSep && (
                    <div className="flex items-center gap-3 py-3 px-4 select-none" aria-label={formatDateSeparator(msg.timestamp, t)}>
                      <div className="flex-1 h-px bg-[var(--pc-hover-strong)]" />
                      <span className="text-[11px] font-medium text-pc-text-muted uppercase tracking-wider">{formatDateSeparator(msg.timestamp, t)}</span>
                      <div className="flex-1 h-px bg-[var(--pc-hover-strong)]" />
                    </div>
                  )}
                  <div className={isActiveMatch ? 'ring-1 ring-pc-accent-light/40 rounded-lg' : ''}>
                    <ChatMessageComponent message={msg} onRetry={!isGenerating ? handleSend : undefined} agentAvatarUrl={agentAvatarUrl} />
                  </div>
                </div>
            );
          })}
          {showTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>
      {/* Floating action buttons */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {hasToolCalls && (
          <button
            onClick={globalState === 'expand-all' ? collapseAll : expandAll}
            aria-label={globalState === 'expand-all' ? t('chat.collapseTools') : t('chat.expandTools')}
            title={globalState === 'expand-all' ? t('chat.collapseTools') : t('chat.expandTools')}
            className="flex items-center gap-1.5 rounded-full border border-pc-border-strong bg-pc-elevated/90 backdrop-blur-lg px-3 py-2 text-xs text-pc-text shadow-lg hover:bg-pc-elevated/90 transition-all hover:shadow-violet-500/10"
          >
            {globalState === 'expand-all' ? <ChevronsDownUp size={14} className="text-violet-300" /> : <ChevronsUpDown size={14} className="text-violet-300" />}
          </button>
        )}
        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom('smooth')}
            aria-label={t('chat.scrollToBottom')}
            className="flex items-center gap-1.5 rounded-full border border-pc-border-strong bg-pc-elevated/90 backdrop-blur-lg px-3.5 py-2 text-xs text-pc-text shadow-lg hover:bg-pc-elevated/90 transition-all hover:shadow-cyan-500/10"
          >
            <ArrowDown size={14} className="text-pc-accent-light" />
            <span className="hidden sm:inline">{t('chat.scrollToBottom')}</span>
          </button>
        )}
      </div>
      <ChatInput onSend={handleSend} onAbort={onAbort} isGenerating={isGenerating} disabled={status !== 'connected'} sessionKey={sessionKey} />
    </div>
  );
}
