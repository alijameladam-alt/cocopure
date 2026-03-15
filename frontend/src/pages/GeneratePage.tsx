import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { TranscriptViewer } from '../components/TranscriptViewer';
import { PostEditor } from '../components/PostEditor';
import { generatePost } from '../api/generation';
import { useAppStore } from '../store/useAppStore';

type Tone = 'professional' | 'casual' | 'inspiring';

export function GeneratePage() {
  const navigate = useNavigate();
  const transcript = useAppStore((s) => s.transcript);
  const linkedinPost = useAppStore((s) => s.linkedinPost);
  const wordCountWarning = useAppStore((s) => s.wordCountWarning);
  const setGenerated = useAppStore((s) => s.setGenerated);
  const setLinkedinPost = useAppStore((s) => s.setLinkedinPost);

  const [tone, setTone] = useState<Tone>('professional');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transcript) {
      navigate('/upload');
      return;
    }
    // Auto-generate on first visit
    if (!linkedinPost) {
      handleGenerate();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerate = async () => {
    if (!transcript) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await generatePost({ transcript, tone });
      setGenerated(res.summary, res.linkedin_post, res.word_count, res.word_count_warning);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-4 pb-16">
      <div className="w-full max-w-2xl">
        <StepIndicator current={3} />
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Edit Your Post</h1>
        <p className="text-gray-500 text-center mb-8">
          Claude has drafted a LinkedIn post from your transcript. Edit it until you're happy.
        </p>

        {transcript && (
          <div className="mb-4">
            <TranscriptViewer transcript={transcript} />
          </div>
        )}

        {/* Tone selector */}
        <div className="flex gap-2 mb-4">
          {(['professional', 'casual', 'inspiring'] as Tone[]).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors capitalize
                ${tone === t ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'}`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="ml-auto px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 disabled:opacity-50"
          >
            {generating ? 'Regenerating…' : 'Regenerate'}
          </button>
        </div>

        {wordCountWarning && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-xs">
            The generated post may be slightly outside the 300–500 word target. Feel free to edit.
          </div>
        )}

        {generating ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Claude is writing your post…</p>
          </div>
        ) : (
          <>
            {linkedinPost !== null && (
              <PostEditor
                value={linkedinPost}
                onChange={setLinkedinPost}
              />
            )}
          </>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {linkedinPost && !generating && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate('/preview')}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Preview Post →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
