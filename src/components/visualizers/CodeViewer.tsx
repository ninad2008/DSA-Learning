import React, { useState } from 'react';
import { SupportedLanguage } from '../../types/dsa';
import { CODE_SNIPPETS } from '../../data/codeSnippets';
import { Code2, Copy, Check } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

interface CodeViewerProps {
  snippetKey: string;
  activeLine?: number; // 1-based line number to highlight
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ snippetKey, activeLine }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [copied, setCopied] = useState(false);

  const snippet = CODE_SNIPPETS[snippetKey] || CODE_SNIPPETS['hashmap_insert'];
  const lines = snippet[language] || [];

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl bg-slate-900/90 flex flex-col h-full">
      {/* Header with language tabs and copy button */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-300">Live Code Sync</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            {(['python', 'java', 'cpp'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  sounds.playClick();
                  setLanguage(lang);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all uppercase ${
                  language === lang
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'cpp' ? 'C++' : lang}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code line by line */}
      <div className="p-3 font-mono text-xs overflow-auto flex-1 max-h-[380px] bg-slate-950/50">
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = activeLine === lineNum;

          return (
            <div
              key={idx}
              className={`flex items-start py-0.5 px-2 rounded transition-all duration-200 ${
                isHighlighted
                  ? 'bg-purple-950/70 border-l-2 border-purple-400 text-purple-200 font-semibold'
                  : 'text-slate-300 hover:bg-slate-900/40'
              }`}
            >
              <span className="w-6 text-right pr-3 select-none text-slate-600 text-[11px]">
                {lineNum}
              </span>
              <pre className="flex-1 whitespace-pre-wrap break-all">
                {line}
              </pre>
              {isHighlighted && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-500/30 ml-2 animate-pulse">
                  Executing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
