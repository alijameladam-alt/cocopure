import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoUploader } from '../components/VideoUploader';
import { StepIndicator } from '../components/StepIndicator';
import { uploadVideo } from '../api/upload';
import { useAppStore } from '../store/useAppStore';

export function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const setJobId = useAppStore((s) => s.setJobId);
  const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const res = await uploadVideo(file, setProgress);
      setJobId(res.job_id);
      navigate('/transcribe');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-4">
      <div className="w-full max-w-2xl">
        <StepIndicator current={1} />
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Upload Your Video</h1>
        <p className="text-gray-500 text-center mb-8">
          Upload a video or audio file to generate a LinkedIn post from its content.
        </p>

        <VideoUploader onUpload={handleUpload} uploading={uploading} progress={progress} />

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
