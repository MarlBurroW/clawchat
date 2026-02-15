export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  blocks: MessageBlock[];
  isStreaming?: boolean;
  runId?: string;
  isSystemEvent?: boolean;
  metadata?: Record<string, unknown>;
  /** Optimistic send status for user messages */
  sendStatus?: 'sending' | 'sent' | 'error';
}

export type MessageBlock =
  | { type: 'text'; text: string }
  | { type: 'thinking'; text: string }
  | { type: 'tool_use'; name: string; input: Record<string, unknown>; id?: string }
  | { type: 'tool_result'; content: string; toolUseId?: string; name?: string }
  | { type: 'image'; mediaType: string; data?: string; url?: string };

export interface Session {
  key: string;
  label?: string;
  messageCount?: number;
  isActive?: boolean;
  hasUnread?: boolean;
  totalTokens?: number;
  contextTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
  channel?: string;
  kind?: string;
  model?: string;
  agentId?: string;
  updatedAt?: number;
  lastMessagePreview?: string;
}

export interface AgentIdentity {
  name?: string;
  emoji?: string;
  avatar?: string;
  agentId?: string;
}

export interface Agent {
  id: string;
  identity?: {
    name?: string;
    emoji?: string;
    avatar?: string;
  };
  model?: string;
  isDefault?: boolean;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface GatewayState {
  status: ConnectionStatus;
  sessions: Session[];
  activeSession: string;
  messages: ChatMessage[];
  isGenerating: boolean;
}
