interface PostEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function PostEditor({ value, onChange }: PostEditorProps) {
  const wordCount = countWords(value);
  const inRange = wordCount >= 300 && wordCount <= 500;
  const charCount = value.length;

  return (
    <div className="w-full">
      <textarea
        className="w-full h-72 p-4 border border-gray-300 rounded-lg text-sm text-gray-800 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your LinkedIn post will appear here…"
      />
      <div className="flex justify-between mt-1 text-xs">
        <span className={inRange ? 'text-green-600' : 'text-red-500'}>
          {wordCount} words {inRange ? '✓' : '(target: 300–500)'}
        </span>
        <span className={charCount > 3000 ? 'text-red-500' : 'text-gray-400'}>
          {charCount}/3000 chars
        </span>
      </div>
    </div>
  );
}
