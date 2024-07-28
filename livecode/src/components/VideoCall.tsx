// VideoCall.tsx
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer/simplepeer.min.js';
import { VideoComponent,RemoteVideoComponent } from './VideoView';

const VideoCall: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  // ... (keep all the existing state and refs)

  // ... (keep all the existing functions like handleOffer, handleAnswer, etc.)
  const socketRef = useRef<SocketIOClient.Socket>();
  const peerRef = useRef<Peer.Instance>();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Connect to the server using Socket.IO
    socketRef.current = io('https://webrtc-test-api.onrender.com');

    // Handle signaling events
    socketRef.current.on('offer', handleOffer);
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('iceCandidate', handleIceCandidate);

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleOffer = (offer: Peer.SignalData) => {
    // Handle received offer and create an answer
    if (peerRef.current) {
      peerRef.current.signal(offer);
    } else {
      // Create a new peer connection if it doesn't exist
      peerRef.current = new Peer({
        initiator: false,
        trickle: false,
      });

      // Handle signaling events
      peerRef.current.on('signal', (data: Peer.SignalData) => {
        // Send the answer back to the server
        socketRef.current?.emit('answer', data);
      });

      peerRef.current.on('stream', (stream: MediaStream) => {
        // Set the remote video stream
        setRemoteStream(stream);
      });

      // Signal the received offer
      peerRef.current.signal(offer);
    }
  };

  const handleAnswer = (answer: Peer.SignalData) => {
    // Handle received answer
    if (peerRef.current) {
      peerRef.current.signal(answer);
    }
  };

  const handleIceCandidate = (candidate: Peer.ICECandidateJSON) => {
    // Handle received ICE candidate
    if (peerRef.current) {
      peerRef.current.signal({
        type: 'candidate',
        candidate: JSON.stringify(candidate),
      });
    }
  };

  const joinRoom = () => {
    // Get the local video stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Set the local video stream
        setLocalStream(stream);

        // Create a new peer connection
        peerRef.current = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });

        // Handle signaling events
        peerRef.current.on('signal', (data: Peer.SignalData) => {
          // Send the signaling data to the server
          socketRef.current?.emit('offer', data);
          console.log("sending your video");
        });

        peerRef.current.on('stream', (stream: MediaStream) => {
          // Set the remote video stream
          console.log('got peers video');
          setRemoteStream(stream);
        });

        // Join the room
        socketRef.current?.emit('join', 'roomId');
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  };

  const leaveRoom = () => {
    // Disconnect from the room and cleanup
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = undefined;
    }

    if (socketRef.current) {
      socketRef.current.emit('leaveRoom');
      socketRef.current.disconnect();
    }

    // Stop the local video stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Clear the remote video
    setRemoteStream(null);
  };

  const toggleAudio = () => {
    // Toggle audio mute/unmute
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();

      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleVideo = () => {
    // Toggle video on/off
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();

      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleRemoteAudio = () => {
    // Toggle remote audio mute/unmute
    if (remoteStream) {
      const audioTracks = remoteStream.getAudioTracks();

      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleRemoteVideo = () => {
    // Toggle remote video on/off
    if (remoteStream) {
      const videoTracks = remoteStream.getVideoTracks();

      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };
  const startVideoCall = () => {
    joinRoom();
    onStart();
  };

  return (
    <>
      <div className="relative">
        <VideoComponent
          stream={localStream}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
        />
      </div>
      <div className="absolute bottom-4 right-4 w-1/4">
        <RemoteVideoComponent
          stream={remoteStream}
          onToggleAudio={toggleRemoteAudio}
          onToggleVideo={toggleRemoteVideo}
        />
      </div>
    </>
  );
};

export default VideoCall;