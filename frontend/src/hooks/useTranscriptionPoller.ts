import { useEffect, useRef, useState } from 'react';
import { getTranscriptionStatus } from '../api/transcription';
import type { TranscriptionStatusResponse } from '../types';

const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 120; // ~10 minutes

interface UseTranscriptionPollerResult {
  status: TranscriptionStatusResponse['status'] | null;
  transcript: string | null;
  error: string | null;
}

export function useTranscriptionPoller(jobId: string | null): UseTranscriptionPollerResult {
  const [status, setStatus] = useState<TranscriptionStatusResponse['status'] | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollCount = useRef(0);

  useEffect(() => {
    if (!jobId) return;

    pollCount.current = 0;
    const id = setInterval(async () => {
      pollCount.current += 1;

      if (pollCount.current > MAX_POLLS) {
        clearInterval(id);
        setError('Transcription timed out. Please try again.');
        return;
      }

      try {
        const res = await getTranscriptionStatus(jobId);
        setStatus(res.status);

        if (res.status === 'completed') {
          setTranscript(res.transcript ?? null);
          clearInterval(id);
        } else if (res.status === 'error') {
          setError(res.error ?? 'Transcription failed.');
          clearInterval(id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Polling error.');
        clearInterval(id);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [jobId]);

  return { status, transcript, error };
}
