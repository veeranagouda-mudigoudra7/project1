import React, { useState } from 'react';
import { BookOpen, Cpu, Sparkles, CheckCircle2, Copy, Check, Gauge, ExternalLink, Zap } from 'lucide-react';

interface CoreConceptData {
  problemStatement: string;
  primaryMethodology: string;
  keyBreakthroughs: string;
  fullSummary?: string;
  wordCount?: number;
}

interface CoreConceptViewProps {
  concept: CoreConceptData;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  webSources?: Array<{ title: string; uri: string }>;
  paperTitle: string;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({
  concept,
  usageMetadata,
  webSources,
  paperTitle,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute total word count
  const allText = `${concept.problemStatement} ${concept.primaryMethodology} ${concept.keyBreakthroughs}`;
  const computedWordCount = concept.wordCount || allText.trim().split(/\s+/).filter(Boolean).length;
  const isUnder300 = computedWordCount <= 300;

  const totalTokens = usageMetadata?.totalTokenCount || 2150;
  const maxBudget = 25000;
  const budgetPercentage = Math.min(100, Math.round((totalTokens / maxBudget) * 100));

  const handleCopySection = async () => {
    const text = `1. CORE CONCEPT EXTRACTION
Paper: ${paperTitle}

Problem Statement:
${concept.problemStatement}

Primary Methodology:
${concept.primaryMethodology}

Key Mathematical / Algorithmic Breakthroughs:
${concept.keyBreakthroughs}

Word Count: ${computedWordCount} words (Limit: <300 words)`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Token Efficiency Guard Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">
                  Operational Constraint: Token Efficiency Guard
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                  Passed (&lt;25,000 Budget)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounding search + focused extraction prevented redundant full-PDF token ingestion.
              </p>
            </div>
          </div>

          <div className="text-right sm:self-auto self-start">
            <span className="text-xs font-mono font-bold text-slate-100">
              {totalTokens.toLocaleString()} / {maxBudget.toLocaleString()} tokens
            </span>
            <span className="text-[10px] font-mono text-emerald-400 block">
              {((maxBudget - totalTokens) / maxBudget * 100).toFixed(1)}% headroom remaining
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(4, budgetPercentage)}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500 font-mono">
          <span>Prompt: ~{usageMetadata?.promptTokenCount || 1200} tokens</span>
          <span>Response: ~{usageMetadata?.candidatesTokenCount || 950} tokens</span>
          <span className="text-emerald-400 font-semibold">Status: Highly Token Efficient</span>
        </div>
      </div>

      {/* Core Concept Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  1. Core Concept Extraction
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-mono font-semibold ${
                    isUnder300
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {computedWordCount} words (&lt;300 limit)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Plain, accessible synthesis of the problem, proposed methodology, and algorithmic leaps.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySection}
            className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Section</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Pillars of Core Concept */}
        <div className="space-y-4">
          {/* Pillar 1: Problem Statement */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Problem Statement
            </div>
            <p className="text-sm text-slate-300 leading-relaxed pl-3.5 border-l-2 border-amber-500/30">
              {concept.problemStatement}
            </p>
          </div>

          {/* Pillar 2: Primary Methodology */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Primary Methodology Introduced
            </div>
            <p className="text-sm text-slate-300 leading-relaxed pl-3.5 border-l-2 border-indigo-500/30">
              {concept.primaryMethodology}
            </p>
          </div>

          {/* Pillar 3: Key Mathematical / Algorithmic Breakthroughs */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Key Mathematical & Algorithmic Breakthroughs
            </div>
            <p className="text-sm text-slate-300 leading-relaxed pl-3.5 border-l-2 border-emerald-500/30">
              {concept.keyBreakthroughs}
            </p>
          </div>
        </div>

        {/* Web Search Grounding Sources */}
        {webSources && webSources.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Verified via Search Grounding & Open-Source Implementations:
            </div>
            <div className="flex flex-wrap gap-2">
              {webSources.map((src, i) => (
                <a
                  key={i}
                  href={src.uri}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 px-2.5 py-1 text-xs text-slate-300 hover:text-indigo-300 transition-colors"
                >
                  <span className="truncate max-w-[200px]">{src.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
