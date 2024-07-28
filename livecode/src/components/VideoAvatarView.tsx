import React, { useRef, useState, useEffect } from 'react';
import { Video, VideoOff, MicOff, Mic } from 'lucide-react';

interface AvatarVideoProps {
  stream: MediaStream | null;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  isLocal: boolean;
  remoteStatus?:boolean;
}

const AvatarVideo: React.FC<AvatarVideoProps> = ({
  stream,
  onToggleAudio,
  onToggleVideo,
  isLocal,
  remoteStatus,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    onToggleAudio();
  };

  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    onToggleVideo();
  };

  return (
    <div className="relative w-32 h-32" style={{'zIndex':10}}>
      <div className={`w-full h-full rounded-full border-2 overflow-hidden ${remoteStatus || isLocal ? 'bg-green-300 border-green-300' : 'bg-gray-300'} space-x-2`}>
        {stream && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        )}
        {/* {!videoEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-2xl font-bold">
            {isLocal ? 'Y' : 'User'}
          </div>
        )} */}
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 mb-2">
        <button
          onClick={handleToggleAudio}
          className={`p-2 rounded-full ${
            audioEnabled ? 'bg-green-500' : 'bg-red-500'
          } text-white focus:outline-none transition-colors duration-200 hover:opacity-80`}
        >
          {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
        </button>
        <button
          onClick={handleToggleVideo}
          className={`p-2 rounded-full ${
            videoEnabled ? 'bg-green-500' : 'bg-red-500'
          } text-white focus:outline-none transition-colors duration-200 hover:opacity-80`}
        >
          {videoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
        </button>
      </div>
    </div>
  );
};

export default AvatarVideo;