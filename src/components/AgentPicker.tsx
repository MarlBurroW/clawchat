import { useRef, useCallback } from 'react';
import { Bot } from 'lucide-react';
import type { Agent, Session } from '../types';
import { useT } from '../hooks/useLocale';

interface Props {
  agents: Agent[];
  sessions: Session[];
  selectedAgent: string | null;
  activeAgentId: string | undefined;
  onSelect: (id: string | null) => void;
}

export function AgentPicker({ agents, sessions, selectedAgent, activeAgentId, onSelect }: Props) {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);

  const sessionCountByAgent = useCallback((agentId: string) => {
    return sessions.filter(s => s.agentId === agentId).length;
  }, [sessions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const tabs = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = tabs.findIndex(t => t.getAttribute('tabindex') === '0');
    let next: number;
    if (e.key === 'ArrowRight') {
      next = current < tabs.length - 1 ? current + 1 : 0;
    } else {
      next = current > 0 ? current - 1 : tabs.length - 1;
    }
    tabs[current]?.setAttribute('tabindex', '-1');
    tabs[next]?.setAttribute('tabindex', '0');
    tabs[next]?.focus();
  }, []);

  const allSelected = selectedAgent === null;

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={t('sidebar.agents')}
      className="flex gap-1.5 overflow-x-auto scrollbar-none px-2 pt-2 pb-1"
      onKeyDown={handleKeyDown}
    >
      {/* "All" chip */}
      <button
        role="tab"
        aria-selected={allSelected}
        tabIndex={allSelected ? 0 : -1}
        onClick={() => onSelect(null)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
          allSelected
            ? 'bg-[var(--pc-accent-glow)] text-pc-accent-light border border-[var(--pc-accent-dim)]'
            : 'text-pc-text-secondary hover:bg-[var(--pc-hover)] border border-transparent'
        }`}
      >
        {t('sidebar.allAgents')}
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${allSelected ? 'bg-[var(--pc-accent-dim)] text-pc-accent-light' : 'bg-[var(--pc-hover)] text-pc-text-muted'}`}>
          {sessions.length}
        </span>
      </button>

      {agents.map(agent => {
        const isSelected = selectedAgent === agent.id;
        const isActiveAgent = activeAgentId === agent.id;
        const count = sessionCountByAgent(agent.id);
        const displayName = agent.identity?.name || agent.id;

        return (
          <button
            key={agent.id}
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(agent.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
              isSelected
                ? 'bg-[var(--pc-accent-glow)] text-pc-accent-light border border-[var(--pc-accent-dim)]'
                : 'text-pc-text-secondary hover:bg-[var(--pc-hover)] border border-transparent'
            }`}
          >
            <span className="relative flex items-center">
              {agent.identity?.emoji ? (
                <span className="text-sm leading-none">{agent.identity.emoji}</span>
              ) : (
                <Bot size={14} className="opacity-60" />
              )}
              {isActiveAgent && !isSelected && (
                <span className="absolute -top-0.5 -right-1 h-1.5 w-1.5 rounded-full bg-[var(--pc-accent)] shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
              )}
            </span>
            {displayName}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-[var(--pc-accent-dim)] text-pc-accent-light' : 'bg-[var(--pc-hover)] text-pc-text-muted'}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
