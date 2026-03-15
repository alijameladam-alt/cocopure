import { useState } from 'react';

interface TranscriptViewerProps {
  transcript: string;
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-sm font-medium text-gray-700">Transcript</span>
        <span className="text-xs text-gray-400">{expanded ? '▲ collapse' : '▼ expand'}</span>
      </div>
      {expanded && (
        <div className="px-4 py-3 max-h-64 overflow-y-auto text-sm text-gray-600 whitespace-pre-wrap">
          {transcript}
        </div>
      )}
    </div>
  );
}
