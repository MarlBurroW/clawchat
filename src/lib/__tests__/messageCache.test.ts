import { describe, it, expect } from 'vitest';
import { mergeWithCache } from '../messageCache';
import type { ChatMessage } from '../../types';

function makeMsg(id: string, role: 'user' | 'assistant' = 'user', ts = Date.now()): ChatMessage {
  return { id, role, content: `msg-${id}`, timestamp: ts, blocks: [] };
}

describe('mergeWithCache', () => {
  it('returns gateway messages unchanged when cache is empty', () => {
    const gateway = [makeMsg('a'), makeMsg('b')];
    const result = mergeWithCache(gateway, []);
    expect(result.messages).toEqual(gateway);
    expect(result.wasCompacted).toBe(false);
  });

  it('returns gateway messages when cache has same messages', () => {
    const msgs = [makeMsg('a'), makeMsg('b')];
    const result = mergeWithCache(msgs, msgs);
    expect(result.messages).toEqual(msgs);
    expect(result.wasCompacted).toBe(false);
  });

  it('detects compaction and merges old cached messages', () => {
    const old1 = makeMsg('old1', 'user', 1000);
    const old2 = makeMsg('old2', 'assistant', 2000);
    const current = makeMsg('new1', 'user', 5000);

    const cached = [old1, old2, current];
    const gateway = [current]; // old messages compacted away

    const result = mergeWithCache(gateway, cached);
    expect(result.wasCompacted).toBe(true);
    // Should have: old1 (archived), old2 (archived), separator, new1
    expect(result.messages).toHaveLength(4);
    expect(result.messages[0]).toMatchObject({ id: 'old1', isArchived: true });
    expect(result.messages[1]).toMatchObject({ id: 'old2', isArchived: true });
    expect(result.messages[2].isCompactionSeparator).toBe(true);
    expect(result.messages[3].id).toBe('new1');
  });

  it('separator timestamp is just before first gateway message', () => {
    const cached = [makeMsg('old', 'user', 1000)];
    const gateway = [makeMsg('new', 'user', 5000)];

    const result = mergeWithCache(gateway, cached);
    const separator = result.messages.find(m => m.isCompactionSeparator);
    expect(separator).toBeDefined();
    expect(separator!.timestamp).toBe(4999);
  });

  it('handles empty gateway messages with non-empty cache', () => {
    const cached = [makeMsg('old', 'user', 1000)];
    const result = mergeWithCache([], cached);
    expect(result.wasCompacted).toBe(true);
    expect(result.messages).toHaveLength(2); // archived + separator
    expect(result.messages[0]).toMatchObject({ id: 'old', isArchived: true });
    expect(result.messages[1].isCompactionSeparator).toBe(true);
  });
});
