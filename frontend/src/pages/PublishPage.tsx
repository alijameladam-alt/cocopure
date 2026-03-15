import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { LinkedInConnect } from '../components/LinkedInConnect';
import { ConfirmPublishModal } from '../components/ConfirmPublishModal';
import { PostPreview } from '../components/PostPreview';
import { publishPost } from '../api/linkedin';
import { useAppStore } from '../store/useAppStore';
import { useLinkedInAuth } from '../hooks/useLinkedInAuth';

export function PublishPage() {
  const navigate = useNavigate();
  const linkedinPost = useAppStore((s) => s.linkedinPost);
  const wordCount = useAppStore((s) => s.wordCount);
  const postUrl = useAppStore((s) => s.postUrl);
  const setPostUrl = useAppStore((s) => s.setPostUrl);

  const { linkedinToken, linkedinProfile } = useLinkedInAuth();

  const [showModal, setShowModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!linkedinPost) navigate('/generate');
  }, [linkedinPost, navigate]);

  const handlePublish = async () => {
    if (!linkedinToken || !linkedinProfile || !linkedinPost) return;
    setPublishing(true);
    setError(null);
    try {
      const res = await publishPost(linkedinToken, linkedinProfile.linkedin_id, linkedinPost);
      setPostUrl(res.post_url);
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed.');
      setShowModal(false);
    } finally {
      setPublishing(false);
    }
  };

  if (!linkedinPost) return null;

  // Success state
  if (postUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-4">
        <div className="w-full max-w-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Published!</h1>
          <p className="text-gray-500 mb-6">Your post is now live on LinkedIn.</p>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#0A66C2] text-white font-medium rounded-lg hover:bg-[#004182] mb-8"
          >
            View on LinkedIn →
          </a>
          <div>
            <button
              onClick={() => {
                useAppStore.getState().reset();
                navigate('/upload');
              }}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
              Start a new post
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-4 pb-16">
      <div className="w-full max-w-2xl">
        <StepIndicator current={5} />
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Publish to LinkedIn</h1>
        <p className="text-gray-500 text-center mb-8">
          Connect your LinkedIn account and then publish your post.
        </p>

        {/* Post summary */}
        <div className="mb-6">
          <PostPreview
            post={linkedinPost}
            authorName={linkedinProfile?.name}
            profilePicture={linkedinProfile?.profile_picture}
            wordCount={wordCount}
          />
        </div>

        {/* LinkedIn connect */}
        <div className="mb-6">
          <LinkedInConnect profile={linkedinProfile ?? null} />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-between">
          <button
            onClick={() => navigate('/preview')}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            ← Back to Preview
          </button>
          <button
            onClick={() => setShowModal(true)}
            disabled={!linkedinToken || !linkedinProfile || publishing}
            className="px-6 py-2.5 bg-[#0A66C2] text-white font-medium rounded-lg hover:bg-[#004182] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Publish to LinkedIn
          </button>
        </div>

        {!linkedinProfile && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Connect your LinkedIn account above to enable publishing.
          </p>
        )}
      </div>

      {showModal && (
        <ConfirmPublishModal
          onConfirm={handlePublish}
          onCancel={() => setShowModal(false)}
          loading={publishing}
        />
      )}
    </div>
  );
}
