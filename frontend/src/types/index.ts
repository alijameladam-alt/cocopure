export interface UploadResponse {
  job_id: string;
  status: string;
}

export interface TranscriptionStatusResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  transcript?: string;
  error?: string;
}

export interface GenerateRequest {
  transcript: string;
  tone?: 'professional' | 'casual' | 'inspiring';
}

export interface GenerateResponse {
  summary: string;
  linkedin_post: string;
  word_count: number;
  word_count_warning: boolean;
}

export interface LinkedInProfile {
  linkedin_id: string;
  name: string;
  profile_picture?: string;
}

export interface LinkedInPublishResponse {
  post_id: string;
  post_url: string;
}
