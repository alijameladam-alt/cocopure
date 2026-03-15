import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { PostPreview } from '../components/PostPreview';
import { useAppStore } from '../store/useAppStore';

export function PreviewPage() {
  const navigate = useNavigate();
  const linkedinPost = useAppStore((s) => s.linkedinPost);
  const wordCount = useAppStore((s) => s.wordCount);
  const linkedinProfile = useAppStore((s) => s.linkedinProfile);

  useEffect(() => {
    if (!linkedinPost) navigate('/generate');
  }, [linkedinPost, navigate]);

  if (!linkedinPost) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-4 pb-16">
      <div className="w-full max-w-2xl">
        <StepIndicator current={4} />
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Preview Your Post</h1>
        <p className="text-gray-500 text-center mb-8">
          This is exactly how your post will appear on LinkedIn. Happy with it?
        </p>

        <PostPreview
          post={linkedinPost}
          authorName={linkedinProfile?.name}
          profilePicture={linkedinProfile?.profile_picture}
          wordCount={wordCount}
        />

        <div className="mt-8 flex gap-3 justify-between">
          <button
            onClick={() => navigate('/generate')}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            ← Edit Post
          </button>
          <button
            onClick={() => navigate('/publish')}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Confirm &amp; Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
