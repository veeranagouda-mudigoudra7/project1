import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  GitBranch,
  GraduationCap,
  FileText,
  AlertCircle,
  CheckCircle,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  ChevronDown,
  Layers,
  Gauge,
  Terminal,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { MermaidViewer } from './components/MermaidViewer.tsx';
import { StudentProjects, Opportunity } from './components/StudentProjects.tsx';
import { CoreConceptView } from './components/CoreConceptView.tsx';
import { ResearchMentorChat } from './components/ResearchMentorChat.tsx';

interface PaperAnalysisData {
  title?: string;
  coreConcept: {
    problemStatement: string;
    primaryMethodology: string;
    keyBreakthroughs: string;
    fullSummary?: string;
    wordCount?: number;
  };
  mermaidFlowchart: string;
  opportunities: Opportunity[];
}

const SAMPLE_PAPERS = [
  {
    title: 'Attention Is All You Need',
    url: 'https://arxiv.org/abs/1706.03762',
    desc: 'Original Transformer architecture with Multi-Head Self-Attention',
    tag: 'Foundation',
  },
  {
    title: 'Mamba: Selective State Spaces',
    url: 'https://arxiv.org/abs/2312.00752',
    desc: 'Linear-time sequence modeling with hardware-aware SSMs',
    tag: 'Architecture',
  },
  {
    title: 'LoRA: Low-Rank Adaptation',
    url: 'https://arxiv.org/abs/2106.09685',
    desc: 'Parameter-efficient fine-tuning freezing pretrained weights',
    tag: 'Efficiency',
  },
  {
    title: 'FlashAttention: IO-Awareness',
    url: 'https://arxiv.org/abs/2205.14135',
    desc: 'Exact attention tiling with SRAM/HBM memory hierarchy',
    tag: 'Systems',
  },
];

export default function App() {
  const [paperInput, setPaperInput] = useState('https://arxiv.org/abs/1706.03762');
  const [paperText, setPaperText] = useState('');
  const [showAdvancedInput, setShowAdvancedInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [analysisData, setAnalysisData] = useState<PaperAnalysisData | null>(null);
  const [cleanFlowchart, setCleanFlowchart] = useState<string>('');
  const [rawFormattedOutput, setRawFormattedOutput] = useState<string>('');
  const [webSources, setWebSources] = useState<Array<{ title: string; uri: string }>>([]);
  const [usageMetadata, setUsageMetadata] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'flowchart' | 'projects' | 'raw' | 'chat'>('dashboard');
  const [copiedRaw, setCopiedRaw] = useState(false);

  // Initial load: parse default benchmark paper
  useEffect(() => {
    handleAnalyzePaper('https://arxiv.org/abs/1706.03762');
  }, []);

  const handleAnalyzePaper = async (customInput?: string) => {
    const inputVal = customInput !== undefined ? customInput : paperInput;
    if (!inputVal.trim() && !paperText.trim()) {
      setError('Please provide a research paper URL, title, or abstract text.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep('Enforcing token efficiency: querying abstract & verified implementations...');

    try {
      setTimeout(() => {
        setLoadingStep('Extracting core mathematical & algorithmic breakthroughs (<300 words)...');
      }, 1500);

      setTimeout(() => {
        setLoadingStep('Synthesizing Mermaid.js architectural flowchart (graph TD)...');
      }, 3000);

      setTimeout(() => {
        setLoadingStep('Formulating 3rd-year CS student resume projects & tech stacks...');
      }, 4500);

      const res = await fetch('/api/parse-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperInput: inputVal,
          paperText: paperText,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to analyze paper.');
      }

      setAnalysisData(json.data);
      setCleanFlowchart(json.cleanFlowchart || json.data.mermaidFlowchart);
      setRawFormattedOutput(json.rawFormattedOutput);
      setWebSources(json.webSources || []);
      setUsageMetadata(json.usageMetadata);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while analyzing the paper.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const copyRawOutput = async () => {
    if (!rawFormattedOutput) return;
    await navigator.clipboard.writeText(rawFormattedOutput);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const downloadMarkdownReport = () => {
    if (!rawFormattedOutput) return;
    const blob = new Blob([rawFormattedOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(analysisData?.title || 'cs_research_paper').toLowerCase().replace(/\s+/g, '_')}_analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white">
                  CS Research Agent
                </h1>
                <span className="hidden sm:inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-indigo-400 border border-indigo-500/20">
                  v3.8 Architect
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Academic Paper Parser • Architecture Flowcharts • Student Resume Opportunities
              </p>
            </div>
          </div>

          {/* Operational Constraint Indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Token Efficiency Guard:</span>
              <span className="text-emerald-400 font-semibold">&lt;25k Budget Active</span>
            </div>

            {rawFormattedOutput && (
              <button
                onClick={copyRawOutput}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Copy Exact Labeled Output Format"
              >
                {copiedRaw ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy Formatted Output</span>
                    <span className="sm:hidden">Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Research Paper Input Section */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-400" />
                Input Research Paper URL or Title
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste an arXiv link, DOI, OpenReview page, PDF URL, or paper title to extract architecture & student opportunities.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdvancedInput(!showAdvancedInput)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium self-start sm:self-auto"
            >
              {showAdvancedInput ? 'Hide excerpt input' : '+ Paste custom text / excerpt'}
            </button>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyzePaper();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={paperInput}
                onChange={(e) => setPaperInput(e.target.value)}
                placeholder="e.g. https://arxiv.org/abs/1706.03762 or 'FlashAttention' or arXiv ID"
                disabled={isLoading}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || (!paperInput.trim() && !paperText.trim())}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Analyzing Paper...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  Run Research Agent
                </>
              )}
            </button>
          </form>

          {/* Optional Paste Excerpt Area */}
          {showAdvancedInput && (
            <div className="pt-2 animate-in fade-in duration-200">
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Paste Paper Abstract, Introduction or System Excerpt (Optional supplement):
              </label>
              <textarea
                rows={4}
                value={paperText}
                onChange={(e) => setPaperText(e.target.value)}
                placeholder="Paste abstract or architecture section here..."
                disabled={isLoading}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          )}

          {/* Benchmark Presets */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block mb-2">
              Instant Benchmark Papers:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PAPERS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPaperInput(sample.url);
                    handleAnalyzePaper(sample.url);
                  }}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/30 text-xs text-slate-300 transition-all text-left"
                >
                  <span className="font-medium text-slate-200">{sample.title}</span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/40">
                    {sample.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-8 text-center space-y-4 animate-pulse">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">CS Research Agent Executing Pipeline</h3>
              <p className="text-xs text-indigo-300 font-mono">{loadingStep}</p>
            </div>
            <div className="max-w-md mx-auto bg-slate-900/80 rounded-lg p-2.5 text-[11px] font-mono text-slate-400 border border-slate-800 flex items-center justify-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>Token Guard: Target &lt;25,000 tokens • Using Search Grounding</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-300 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-200">Execution Error</p>
              <p className="mt-0.5 text-red-300/90">{error}</p>
            </div>
          </div>
        )}

        {/* Paper Results View */}
        {!isLoading && analysisData && (
          <div className="space-y-6">
            {/* Paper Title Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">
                  Research Analysis Report
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {analysisData.title || 'Academic Paper System Analysis'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesized with Gemini 3.8 Flash • Google Search Grounding • Mermaid.js
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadMarkdownReport}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export .MD
                </button>
                <button
                  onClick={copyRawOutput}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  {copiedRaw ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      Copied Output
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Plaintext
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* View Navigation Tabs */}
            <div className="flex border-b border-slate-800 overflow-x-auto gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'dashboard'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                Comprehensive Dashboard
              </button>
              <button
                onClick={() => setActiveTab('flowchart')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'flowchart'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                2. Architectural Flowchart (Mermaid)
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'projects'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                3. Student Internship Projects
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'raw'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Raw Formatted Output
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'chat'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Mentor Q&A
              </button>
            </div>

            {/* TAB 1: Comprehensive Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* 1. Core Concept Extraction */}
                <CoreConceptView
                  concept={analysisData.coreConcept}
                  usageMetadata={usageMetadata}
                  webSources={webSources}
                  paperTitle={analysisData.title || 'Paper'}
                />

                {/* 2. Architectural Flowchart */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-indigo-400" />
                        2. Architectural Flowchart (Mermaid.js)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Clean graph TD diagram charting data inputs, model layers, transformations & outputs.
                      </p>
                    </div>
                  </div>
                  <MermaidViewer chartDefinition={cleanFlowchart} />
                </div>

                {/* 3. Future Work & Internship Opportunities */}
                <StudentProjects
                  opportunities={analysisData.opportunities || []}
                  paperTitle={analysisData.title || 'Research Paper'}
                />
              </div>
            )}

            {/* TAB 2: Flowchart Only */}
            {activeTab === 'flowchart' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-white mb-1">
                    System Architecture Diagram
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mermaid.js flowchart generated with clean node labels, mapping component interactions. Zoom, pan, or copy the labeled [FLOWCHART] block below.
                  </p>
                </div>
                <MermaidViewer chartDefinition={cleanFlowchart} />
              </div>
            )}

            {/* TAB 3: Student Projects */}
            {activeTab === 'projects' && (
              <StudentProjects
                opportunities={analysisData.opportunities || []}
                paperTitle={analysisData.title || 'Research Paper'}
              />
            )}

            {/* TAB 4: Raw Formatted Output */}
            {activeTab === 'raw' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Raw Formatted Output (Specification Compliant)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Exact labeled structure with [FLOWCHART] segment and 3 student internship opportunities.
                    </p>
                  </div>
                  <button
                    onClick={copyRawOutput}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    {copiedRaw ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy All
                      </>
                    )}
                  </button>
                </div>

                <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-6 overflow-x-auto font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {rawFormattedOutput}
                </div>
              </div>
            )}

            {/* TAB 5: Research Mentor Chat */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <ResearchMentorChat
                  paperTitle={analysisData.title || 'Research Paper'}
                  paperSummary={analysisData.coreConcept?.problemStatement || ''}
                  flowchart={cleanFlowchart}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CS Research Agent</span>
            <span>•</span>
            <span>Token-Constrained System Architect</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Limit: &lt;25,000 Tokens • Mermaid.js graph TD • 3rd-Year CS Mentorship
          </div>
        </div>
      </footer>
    </div>
  );
}
