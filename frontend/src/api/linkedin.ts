import client from './client';
import type { LinkedInProfile, LinkedInPublishResponse } from '../types';

export function startLinkedInOAuth(): void {
  window.location.href = '/api/linkedin/auth';
}

export async function fetchLinkedInProfile(token: string): Promise<LinkedInProfile> {
  const { data } = await client.get<LinkedInProfile>('/linkedin/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function publishPost(
  token: string,
  linkedinId: string,
  linkedinPost: string
): Promise<LinkedInPublishResponse> {
  const { data } = await client.post<LinkedInPublishResponse>('/linkedin/publish', {
    access_token: token,
    linkedin_id: linkedinId,
    linkedin_post: linkedinPost,
  });
  return data;
}
