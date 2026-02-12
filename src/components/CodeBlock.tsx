import { useState, useCallback, type HTMLAttributes, type ReactElement } from 'react';
import { Check, Copy } from 'lucide-react';

/** Extract the language from the nested <code> element's className (e.g. "language-ts"). */
function extractLanguage(children: React.ReactNode): string | null {
  const codeEl = children as ReactElement<{ className?: string }> | undefined;
  const className = codeEl?.props?.className;
  if (typeof className !== 'string') return null;
  const match = className.match(/language-(\S+)/);
  return match ? match[1] : null;
}

/** Pretty-print common language identifiers. */
const LANGUAGE_LABELS: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  tsx: 'TSX',
  py: 'Python',
  rb: 'Ruby',
  rs: 'Rust',
  go: 'Go',
  sh: 'Shell',
  bash: 'Bash',
  zsh: 'Zsh',
  yml: 'YAML',
  yaml: 'YAML',
  md: 'Markdown',
  json: 'JSON',
  html: 'HTML',
  css: 'CSS',
  sql: 'SQL',
  dockerfile: 'Dockerfile',
  toml: 'TOML',
};

function formatLanguage(lang: string): string {
  return LANGUAGE_LABELS[lang] || lang;
}

/**
 * Custom <pre> renderer for ReactMarkdown.
 * Wraps code blocks with a language label and a floating copy button.
 */
export function CodeBlock(props: HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const language = extractLanguage(props.children);

  const handleCopy = useCallback(() => {
    // Extract text from the nested <code> element
    const code = (props.children as ReactElement<{ children?: string }> | undefined)?.props?.children;
    if (typeof code === 'string') {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [props.children]);

  return (
    <div className="group/code relative">
      {language && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-800/80 border-b border-white/5 rounded-t-lg text-[11px] text-zinc-500 font-mono select-none">
          {formatLanguage(language)}
        </div>
      )}
      <pre {...props} className={`${props.className || ''} ${language ? '!rounded-t-none !mt-0' : ''}`} />
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-700/60 hover:bg-zinc-600/80 border border-white/10 text-zinc-400 hover:text-zinc-200 opacity-0 group-hover/code:opacity-100 transition-opacity duration-150"
        title="Copy code"
        aria-label="Copy code to clipboard"
        type="button"
      >
        {copied
          ? <Check className="h-3.5 w-3.5 text-green-400" />
          : <Copy className="h-3.5 w-3.5" />
        }
      </button>
    </div>
  );
}
