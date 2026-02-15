import { describe, it, expect } from 'vitest';
import { exportAsMarkdown } from '../exportConversation';
import type { ChatMessage } from '../../types';

function makeMsg(
  role: 'user' | 'assistant',
  content: string,
  blocks: ChatMessage['blocks'] = [],
): ChatMessage {
  return { id: `msg-${Math.random()}`, role, content, timestamp: 1700000000000, blocks };
}

describe('exportAsMarkdown', () => {
  it('exports a basic user + assistant exchange', () => {
    const msgs = [
      makeMsg('user', 'Hello'),
      makeMsg('assistant', 'Hi there!'),
    ];
    const md = exportAsMarkdown(msgs);
    expect(md).toContain('# Conversation');
    expect(md).toContain('### 👤 User');
    expect(md).toContain('Hello');
    expect(md).toContain('### 🤖 Assistant');
    expect(md).toContain('Hi there!');
  });

  it('uses custom session label as title', () => {
    const md = exportAsMarkdown([], 'My Session');
    expect(md).toContain('# My Session');
  });

  it('renders text blocks', () => {
    const msgs = [
      makeMsg('assistant', '', [{ type: 'text', text: 'Block content' }]),
    ];
    const md = exportAsMarkdown(msgs);
    expect(md).toContain('Block content');
  });

  it('renders thinking blocks in details tags', () => {
    const msgs = [
      makeMsg('assistant', '', [{ type: 'thinking', text: 'Deep thought' }]),
    ];
    const md = exportAsMarkdown(msgs);
    expect(md).toContain('<details>');
    expect(md).toContain('💭 Thinking');
    expect(md).toContain('Deep thought');
    expect(md).toContain('</details>');
  });

  it('renders tool_use blocks with JSON', () => {
    const msgs = [
      makeMsg('assistant', '', [{ type: 'tool_use', name: 'exec', input: { command: 'ls' }, id: 't1' }]),
    ];
    const md = exportAsMarkdown(msgs);
    expect(md).toContain('**🔧 Tool: `exec`**');
    expect(md).toContain('"command": "ls"');
  });

  it('renders tool_result blocks truncated', () => {
    const longContent = 'x'.repeat(3000);
    const msgs = [
      makeMsg('assistant', '', [{ type: 'tool_result', content: longContent, toolUseId: 't1' }]),
    ];
    const md = exportAsMarkdown(msgs);
    expect(md).toContain('**📋 Result:**');
    expect(md).toContain('...(truncated)');
    // Should have at most 2000 chars of content + truncation
    const resultLine = md.split('\n').find(l => l.startsWith('xxx'));
    expect(resultLine!.length).toBeLessThanOrEqual(2000);
  });

  it('renders compaction separator', () => {
    const msgs: ChatMessage[] = [
      { id: 'sep', role: 'assistant', content: '', timestamp: 0, blocks: [], isCompactionSeparator: true },
    ];
    const md = exportAsMarkdown(msgs);
    expect(md).toContain('---');
    expect(md).toContain('*Context compacted*');
  });

  it('falls back to content when no blocks', () => {
    const msgs = [makeMsg('user', 'Plain text')];
    const md = exportAsMarkdown(msgs);
    expect(md).toContain('Plain text');
  });
});
