import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Video, VideoOff, MicOff, Mic } from 'lucide-react';

interface VideoControlsProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
}) => {
  return (
    <div className="absolute bottom-4 left-4 flex space-x-4">
      <button
        onClick={onToggleAudio}
        className={`p-2 rounded-full ${
          audioEnabled ? 'bg-green-500' : 'bg-red-500'
        } text-white focus:outline-none`}
      >
        {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </button>
      <button
        onClick={onToggleVideo}
        className={`p-2 rounded-full ${
          videoEnabled ? 'bg-green-500' : 'bg-red-500'
        } text-white focus:outline-none`}
      >
        {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
      </button>
    </div>
  );
};

interface VideoComponentProps {
  stream: MediaStream | null;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ stream,onToggleAudio,onToggleVideo }) => {
  const videoRef = useRef<Webcam>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    onToggleAudio();
    if (videoRef.current && videoRef.current.stream) {
      const webCamAudioTracks = videoRef.current.stream.getAudioTracks();
      webCamAudioTracks.forEach((track)=>{
        track.enabled = !track.enabled;
      })
    }
    // Handle audio toggle logic here
  };

  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    onToggleVideo();
    if (videoRef.current && videoRef.current.stream) {
      const webcamVideoTracks = videoRef.current.stream.getVideoTracks();
      webcamVideoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  return (
    <div className="relative ">
      <Webcam
        ref={videoRef}
        audio={false}
        videoConstraints={{ facingMode: 'user' }}
        className= "min-w-60 lg:w-80 bg-gray-500 "
        style={{ transform: 'scaleX(-1)' }}
        videoStream={stream}
      />
      <VideoControls
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
      />
    </div>
  );
};

const RemoteVideoComponent: React.FC<VideoComponentProps> = ({ stream,onToggleAudio,onToggleVideo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    } 
  }, [stream]);

  const handleToggleAudio = () => {
    if (videoRef.current && stream) {
      videoRef.current.muted = !audioEnabled;
      onToggleAudio()
    }
    setAudioEnabled(!audioEnabled);
    // Handle audio toggle logic here
  };

  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    onToggleVideo()
    // Handle video toggle logic here
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="min-w-60 lg:w-80 bg-gray-500"

        style={{ transform: 'scaleX(-1)' }}
      />
      <VideoControls
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
      />
    </div>
  );
};

export { VideoComponent, RemoteVideoComponent };