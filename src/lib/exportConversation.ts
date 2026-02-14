import type { ChatMessage } from '../types';

/**
 * Export conversation messages as a Markdown string.
 */
export function exportAsMarkdown(messages: ChatMessage[], sessionLabel?: string): string {
  const lines: string[] = [];
  const title = sessionLabel || 'Conversation';
  lines.push(`# ${title}`);
  lines.push(`> Exported from PinchChat on ${new Date().toLocaleString()}`);
  lines.push('');

  for (const msg of messages) {
    if (msg.isCompactionSeparator) {
      lines.push('---');
      lines.push('*Context compacted*');
      lines.push('---');
      lines.push('');
      continue;
    }

    const ts = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : '';
    const roleLabel = msg.role === 'user' ? '👤 User' : msg.role === 'assistant' ? '🤖 Assistant' : '⚙️ System';
    const header = ts ? `### ${roleLabel} — ${ts}` : `### ${roleLabel}`;
    lines.push(header);
    lines.push('');

    // Render blocks
    for (const block of msg.blocks) {
      if (block.type === 'text') {
        lines.push(block.text);
        lines.push('');
      } else if (block.type === 'thinking') {
        lines.push('<details>');
        lines.push('<summary>💭 Thinking</summary>');
        lines.push('');
        lines.push(block.text);
        lines.push('</details>');
        lines.push('');
      } else if (block.type === 'tool_use') {
        const input = typeof block.input === 'string' ? block.input : JSON.stringify(block.input, null, 2);
        lines.push(`**🔧 Tool: \`${block.name}\`**`);
        lines.push('```json');
        lines.push(input);
        lines.push('```');
        lines.push('');
      } else if (block.type === 'tool_result') {
        lines.push('**📋 Result:**');
        lines.push('```');
        lines.push(block.content.slice(0, 2000) + (block.content.length > 2000 ? '\n...(truncated)' : ''));
        lines.push('```');
        lines.push('');
      }
    }

    // Fallback to content if no blocks
    if (msg.blocks.length === 0 && msg.content) {
      lines.push(msg.content);
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Download text as a file.
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/markdown') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
