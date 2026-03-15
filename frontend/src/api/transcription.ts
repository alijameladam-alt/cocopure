import client from './client';
import type { TranscriptionStatusResponse } from '../types';

export async function getTranscriptionStatus(
  jobId: string
): Promise<TranscriptionStatusResponse> {
  const { data } = await client.get<TranscriptionStatusResponse>(
    `/transcription/${jobId}`
  );
  return data;
}
