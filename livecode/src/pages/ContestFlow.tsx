// ContestFlow.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PreMeetingPage from './PreMeetingPage';
import Contest from './Contest';
import { SocketProvider } from '@/components/socketContext';
import SimpleEditor from '@/components/liveEditorTest';

const ContestFlow: React.FC = () => {
  return (
    <SocketProvider>
      <Routes>
        <Route path="pre/:roomId" element={<PreMeetingPage />} />
        <Route path="live/:roomId" element={<Contest />} />
        <Route path="codeshare/:roomId/:username" element={<SimpleEditor />} />
      </Routes>
     </SocketProvider>
  );
};

export default ContestFlow;