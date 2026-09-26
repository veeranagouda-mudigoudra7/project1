import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Copy, Check, ZoomIn, ZoomOut, RotateCcw, Code, Eye, Download } from 'lucide-react';

interface MermaidViewerProps {
  chartDefinition: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chartDefinition }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'diagram' | 'code'>('diagram');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Sanitize chart code to ensure it complies with graph TD without markdown code blocks
  const cleanChart = React.useMemo(() => {
    let clean = (chartDefinition || '')
      .replace(/^```mermaid\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    if (!clean.startsWith('graph ') && !clean.startsWith('flowchart ')) {
      clean = `graph TD\n${clean}`;
    }
    return clean;
  }, [chartDefinition]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Fira Code, monospace',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
      themeVariables: {
        darkMode: true,
        background: '#090d16',
        primaryColor: '#4f46e5',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#6366f1',
        lineColor: '#818cf8',
        secondaryColor: '#0f172a',
        tertiaryColor: '#1e1b4b',
      },
    });

    let isMounted = true;
    const renderChart = async () => {
      if (!cleanChart) return;
      const id = `mermaid-svg-${Date.now()}`;
      try {
        setError(null);
        const { svg } = await mermaid.render(id, cleanChart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Mermaid render error:', err);
          setError('Unable to render flowchart automatically. View raw Mermaid syntax below.');
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [cleanChart]);

  const handleCopyCode = async () => {
    const textToCopy = `[FLOWCHART]\n${cleanChart}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `architecture-flowchart-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-1 text-xs font-semibold text-indigo-300">
            [FLOWCHART] (graph TD)
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Components, data inputs, model layers & data outputs
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Zoom controls (diagram mode only) */}
          {viewMode === 'diagram' && (
            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 mr-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 px-1.5">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
                className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Toggle View Mode */}
          <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={() => setViewMode('diagram')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-all ${
                viewMode === 'diagram'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" />
              Diagram
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-all ${
                viewMode === 'code'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3 h-3" />
              Mermaid
            </button>
          </div>

          {/* Download SVG */}
          {svgContent && viewMode === 'diagram' && (
            <button
              onClick={handleDownloadSVG}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              title="Download SVG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Mermaid block */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            title="Copy [FLOWCHART] block"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="relative p-4 sm:p-6 min-h-[340px] flex items-center justify-center bg-gradient-to-b from-slate-950/60 to-slate-900/60 overflow-auto">
        {viewMode === 'diagram' ? (
          error ? (
            <div className="text-center p-6 max-w-lg">
              <div className="text-amber-400 text-sm font-medium mb-2">{error}</div>
              <p className="text-xs text-slate-400 mb-4">
                The diagram syntax is shown in the Code tab. You can copy it directly into any Mermaid viewer.
              </p>
              <pre className="text-left bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-indigo-300 overflow-x-auto">
                {cleanChart}
              </pre>
            </div>
          ) : svgContent ? (
            <div
              ref={containerRef}
              className="mermaid-container w-full transition-transform duration-150 ease-out origin-top flex justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500 py-12">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono">Rendering architecture graph...</span>
            </div>
          )
        ) : (
          <div className="w-full">
            <div className="text-xs text-slate-400 mb-2 font-mono flex items-center justify-between">
              <span>Labeled Format Output:</span>
              <span className="text-slate-500 text-[11px]">Strict syntax without markdown wrappers</span>
            </div>
            <pre className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto selection:bg-emerald-950">
              <code>{`[FLOWCHART]\n${cleanChart}`}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
