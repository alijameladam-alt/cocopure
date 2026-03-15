import { startLinkedInOAuth } from '../api/linkedin';
import type { LinkedInProfile } from '../types';

interface LinkedInConnectProps {
  profile: LinkedInProfile | null;
}

export function LinkedInConnect({ profile }: LinkedInConnectProps) {
  if (profile) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        {profile.profile_picture ? (
          <img
            src={profile.profile_picture}
            alt={profile.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {profile.name[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">Connected as {profile.name}</p>
          <p className="text-xs text-green-600">LinkedIn account linked ✓</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={startLinkedInOAuth}
      className="flex items-center gap-3 px-5 py-3 bg-[#0A66C2] text-white font-medium rounded-lg hover:bg-[#004182] transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 01-1.977-1.977 1.98 1.98 0 011.977-1.977 1.98 1.98 0 011.977 1.977 1.98 1.98 0 01-1.977 1.977zm1.707 13.019H3.63V9h3.414v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
      Connect LinkedIn
    </button>
  );
}
