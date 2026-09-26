import React, { useState } from 'react';
import { Target, Layers, Briefcase, ChevronRight, Terminal, Copy, Check, Sparkles, X, Download } from 'lucide-react';

export interface Opportunity {
  title: string;
  extension: string;
  targetMetric: string;
  techStack: string[] | string;
  resumeBullet?: string;
  milestones?: string[];
}

interface StudentProjectsProps {
  opportunities: Opportunity[];
  paperTitle: string;
}

export const StudentProjects: React.FC<StudentProjectsProps> = ({ opportunities, paperTitle }) => {
  const [selectedProject, setSelectedProject] = useState<Opportunity | null>(null);
  const [codeScaffold, setCodeScaffold] = useState<string>('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [copiedResumeIdx, setCopiedResumeIdx] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleGenerateScaffold = async (opp: Opportunity) => {
    setSelectedProject(opp);
    setIsGeneratingCode(true);
    setCodeScaffold('');
    try {
      const res = await fetch('/api/generate-starter-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: opp.title,
          extension: opp.extension,
          techStack: opp.techStack,
          paperTitle,
        }),
      });
      const data = await res.json();
      setCodeScaffold(data.code || '# Code generation completed.');
    } catch (err) {
      console.error(err);
      setCodeScaffold('# Error generating code template. Please try again.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyResumeBullet = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedResumeIdx(idx);
    setTimeout(() => setCopiedResumeIdx(null), 2000);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(codeScaffold);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadPythonFile = () => {
    const blob = new Blob([codeScaffold], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(selectedProject?.title || 'student_project').toLowerCase().replace(/\s+/g, '_')}_scaffold.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-900/30 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              3rd-Year CS Student Development Opportunities
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Actionable, resume-worthy project extensions engineered for undergraduate research and FAANG internships.
          </p>
        </div>
        <div className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-3 py-1.5 rounded-lg border border-indigo-800/50 self-start sm:self-auto">
          3 Tailored Proposals
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {opportunities.map((opp, idx) => {
          const techList = Array.isArray(opp.techStack)
            ? opp.techStack
            : (opp.techStack || '').split(',').map((s) => s.trim());

          return (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg hover:border-indigo-500/40 transition-all group hover:shadow-indigo-500/5"
            >
              <div className="space-y-4">
                {/* Header tag */}
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-400">
                    Project #{idx + 1}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Resume Project</span>
                </div>

                {/* Project Title */}
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {opp.title || `Extension Proposal ${idx + 1}`}
                </h4>

                {/* Exact Extension */}
                <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Exact Extension:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-5">
                    {opp.extension}
                  </p>
                </div>

                {/* Targeted Performance Metric */}
                <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    Targeted Performance Metric:
                  </div>
                  <p className="text-xs text-emerald-200/90 font-mono leading-relaxed pl-5">
                    {opp.targetMetric}
                  </p>
                </div>

                {/* Recommended Tech Stack */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400">
                    Recommended Tech Stack:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {techList.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center rounded-md bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resume Bullet Point */}
                {opp.resumeBullet && (
                  <div className="rounded-lg bg-indigo-950/30 border border-indigo-900/40 p-3 relative group/bullet">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-300 mb-1">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-indigo-400" />
                        Google XYZ Resume Bullet
                      </span>
                      <button
                        onClick={() => copyResumeBullet(opp.resumeBullet!, idx)}
                        className="text-slate-400 hover:text-indigo-200 p-0.5 rounded transition-colors"
                        title="Copy bullet"
                      >
                        {copiedResumeIdx === idx ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 italic font-sans leading-normal">
                      "{opp.resumeBullet}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button: Generate Code Scaffold */}
              <div className="pt-5 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => handleGenerateScaffold(opp)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-900/30 transition-all hover:scale-[1.01]"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Generate PyTorch Scaffold
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-300" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Code Scaffold Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Starter Scaffold: {selectedProject.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    PyTorch implementation skeleton with dummy forward pass & benchmark harness
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/70 flex-1">
              {isGeneratingCode ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-sans">
                    Synthesizing PyTorch module, loss functions & benchmark loop...
                  </span>
                </div>
              ) : (
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto text-indigo-200 leading-relaxed">
                  <code>{codeScaffold}</code>
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-3">
              <div className="text-[11px] text-slate-500 font-mono">
                Ready for student experimentation & GitHub portfolio upload
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadPythonFile}
                  disabled={isGeneratingCode || !codeScaffold}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .py
                </button>
                <button
                  onClick={copyCode}
                  disabled={isGeneratingCode || !codeScaffold}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
