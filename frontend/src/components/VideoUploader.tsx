import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface VideoUploaderProps {
  onUpload: (file: File) => void;
  uploading: boolean;
  progress: number;
}

const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

export function VideoUploader({ onUpload, uploading, progress }: VideoUploaderProps) {
  const [fileError, setFileError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      setFileError(null);
      if (accepted.length > 0) onUpload(accepted[0]);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [], 'audio/*': [] },
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
    disabled: uploading,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors[0]?.message ?? 'File rejected.';
      setFileError(msg);
    },
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="text-5xl mb-4">🎬</div>
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop the video here</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium mb-1">
              Drag &amp; drop a video or audio file here
            </p>
            <p className="text-gray-400 text-sm">or click to select — up to 2 GB</p>
          </>
        )}
      </div>

      {fileError && (
        <p className="mt-2 text-red-600 text-sm text-center">{fileError}</p>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Uploading…</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
