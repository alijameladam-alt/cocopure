interface PostPreviewProps {
  post: string;
  authorName?: string;
  profilePicture?: string;
  wordCount: number;
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function PostPreview({ post, authorName, profilePicture, wordCount }: PostPreviewProps) {
  const wc = wordCount || countWords(post);
  const inRange = wc >= 300 && wc <= 500;

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white max-w-2xl mx-auto">
      {/* LinkedIn-style header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={authorName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {authorName ? authorName[0].toUpperCase() : 'Y'}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 text-sm">{authorName || 'You'}</p>
          <p className="text-xs text-gray-400">Preview · Just now</p>
        </div>
      </div>

      {/* Post body */}
      <div className="px-5 pb-5 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
        {post}
      </div>

      {/* Word count badge */}
      <div className="px-5 pb-4">
        <span
          className={`inline-block text-xs px-2 py-1 rounded-full font-medium
            ${inRange ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
        >
          {wc} words {inRange ? '✓ in range' : '(target: 300–500)'}
        </span>
      </div>
    </div>
  );
}
