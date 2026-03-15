import { create } from 'zustand';
import type { LinkedInProfile } from '../types';

interface AppState {
  // Step 1-2: upload & transcription
  jobId: string | null;
  transcript: string | null;

  // Step 3: generation
  summary: string | null;
  linkedinPost: string | null;
  wordCount: number;
  wordCountWarning: boolean;

  // Step 4-5: LinkedIn
  linkedinToken: string | null;
  linkedinProfile: LinkedInProfile | null;

  // Published result
  postUrl: string | null;

  // Actions
  setJobId: (id: string) => void;
  setTranscript: (text: string) => void;
  setGenerated: (summary: string, post: string, wordCount: number, warning: boolean) => void;
  setLinkedinPost: (post: string) => void;
  setLinkedinAuth: (token: string, profile: LinkedInProfile) => void;
  setPostUrl: (url: string) => void;
  reset: () => void;
}

const initialState = {
  jobId: null,
  transcript: null,
  summary: null,
  linkedinPost: null,
  wordCount: 0,
  wordCountWarning: false,
  linkedinToken: null,
  linkedinProfile: null,
  postUrl: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setJobId: (id) => set({ jobId: id }),
  setTranscript: (text) => set({ transcript: text }),
  setGenerated: (summary, post, wordCount, warning) =>
    set({ summary, linkedinPost: post, wordCount, wordCountWarning: warning }),
  setLinkedinPost: (post) => set({ linkedinPost: post }),
  setLinkedinAuth: (token, profile) =>
    set({ linkedinToken: token, linkedinProfile: profile }),
  setPostUrl: (url) => set({ postUrl: url }),
  reset: () => set(initialState),
}));
