import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UploadPage } from './pages/UploadPage';
import { TranscribePage } from './pages/TranscribePage';
import { GeneratePage } from './pages/GeneratePage';
import { PreviewPage } from './pages/PreviewPage';
import { PublishPage } from './pages/PublishPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/transcribe" element={<TranscribePage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/publish" element={<PublishPage />} />
      </Routes>
    </BrowserRouter>
  );
}
