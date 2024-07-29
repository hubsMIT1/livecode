
import { userState, tokenState} from '@/state/authState';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import io, { Socket } from 'socket.io-client';
import {AnswerData,OfferData,IceCandidateData,User,UserDetails,JoinStatusData,NoUserData} from '../lib/interfaces'
import { API_URL } from '@/api/constants';
// import { useParams } from 'react-router-dom';

interface SocketContextType {
  socket: Socket | null;
  connectSocket: (token: string,roomId:string) => void;
  disconnectSocket: () => void;
  remoteStream: MediaStream | null;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  localStream: MediaStream | null;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>;
  // handleJoinStatus: (data: JoinStatusData) => void;
  handleAnswer: (data: AnswerData) => Promise<void>;
  handleOffer: (data: OfferData) => Promise<void>;
  handleIceCandidate: (data: IceCandidateData) => void;
  leaveRoom: (isLeave?: boolean) => void;
  checkAndStartStreaming: () => void;
  handleUserLeft: (data: JoinStatusData) => void;
  initializeWebRTC: (roomId:string) => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleRemoteAudio: () => void;
  toggleRemoteVideo: () => void;
  setRoomId: React.Dispatch<React.SetStateAction<string | undefined>>;
  remoteUser:UserDetails;
  setRemoteUser: React.Dispatch<React.SetStateAction<UserDetails>>;
  isOwner:boolean;
  setIsOwner: React.Dispatch<React.SetStateAction<boolean>>;
  roomId:string | undefined;
  user:User;
  contestUser: string | null;
  setContestUser: React.Dispatch<React.SetStateAction<string | null>>;
  startStreaming:() =>void;
  stopStreaming: () => void;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [contestUser, setContestUser] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [remoteUser, setRemoteUser] = useState<UserDetails>({
    user_id: undefined,
    username: '',
    isOwner: undefined,
    status: false,
  });
  const [isOwner, setIsOwner] = useState<boolean>(false);
  // const {username} = useParams()
  const user:User = useRecoilValue(userState)!;
  const token = useRecoilValue(tokenState)
  const [roomId,setRoomId] = useState<string | undefined>()
  
  useEffect(()=>{
    console.warn(user,"users in scoket")
  },[user])

  useEffect(() => {
    console.warn("Trying to call socket in socketCOntext")
    if (socket) {
    console.warn("called socket in socketCOntext")
      // socket.on("joinStatus", handleJoinStatus);
      socket.on("offer", handleOffer);
      socket.on("answer", handleAnswer);
      socket.on("iceCandidate", handleIceCandidate);
      // socket.on("joinRequest", handleJoinRequest);
      socket.on("NoUser", handleNoUser);
      socket.on("userLeft", handleUserLeft);
      // socket.on("startContest", handleStartContest);

      return () => {
        // socket.off("joinStatus");
        socket.off("offer",handleOffer);
        socket.off("answer",handleAnswer);
        socket.off("iceCandidate",handleIceCandidate);
        // socket.off("joinRequest");
        socket.off("NoUser",handleNoUser);
        socket.off("userLeft",handleUserLeft);
        // socket.off("startContest");
      };
    }
  }, [socket]);

  const connectSocket = (token: string,roomId:string) => {
    const newSocket = io(API_URL, {
      auth: { token: token,roomId:roomId},
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    console.warn("contestUser changed state or invoke")
    // console.log(token)
    console.log(user.username)
    if (token && !socket && roomId) {
      connectSocket(token,roomId);
    }
    console.log("socket page on contestUser")
    return () => {
      console.log("socket page disconent on contestUser")
      leaveRoom(true);
      setIsOwner(false)
      disconnectSocket();
      
    };
  }, [token,roomId]);

  // useEffect(() => {
  //   console.warn("contestUser changed state or invoke")
  //   // console.log(token)
  //   console.log(contestUser)
  //   if (contestUser && !socket) {
  //     connectSocket(contestUser!);
  //   }
  //   console.log("socket page on contestUser")
  //   return () => {
  //     console.log("socket page disconent on contestUser")
  //     leaveRoom(true);
  //     setIsOwner(false)
  //     disconnectSocket();
      
  //   };
  // }, [contestUser]);

  // console.log(username)

  const initializeWebRTC = async (roomId:string) => {
    console.log("initializeWebRTC started");
    try {
      console.log("Attempting to get user media");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("User media obtained successfully");
      setLocalStream(stream);
  
      console.log("Creating RTCPeerConnection");
      peerConnectionRef.current = new RTCPeerConnection();
  
      stream.getTracks().forEach((track) => {
        if (peerConnectionRef.current) {
          console.log(`Adding track: ${track.kind}`);
          peerConnectionRef.current.addTrack(track, stream);
        }
      });
  
      peerConnectionRef.current.ontrack = (event) => {
        console.log("Received remote track", event.streams[0]);
        setRemoteStream(event.streams[0]);
      };
  
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Emitting ICE candidate", event.candidate);
          socket?.emit("iceCandidate", { candidate: event.candidate, roomId:roomId,targettedUser:remoteUser?.username });
        }
      };
  
      console.log("Creating offer");
      const offer = await peerConnectionRef.current.createOffer();
      console.log("Setting local description");
      await peerConnectionRef.current.setLocalDescription(offer);
      
      console.log("Emitting offer", { roomId:roomId, targettedUser: remoteUser?.username });
      socket?.emit("offer", { offer, roomId:roomId, targettedUser: remoteUser?.username});
      
      console.log("initializeWebRTC completed");
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
    }
  };

//   const handleJoinStatus = async (data: JoinStatusData) => {
//     if (data.status === "joined") {

//       if (data.allowedUser) {
//         const rUser = Array.from(data.allowedUser).find((name) => name !== user?.username) || null;
//         if (rUser)
//           setRemoteUser({ username: rUser, status: true });
//       }
    
//   };
// }
  
  const checkAndStartStreaming = () => {
    if (peerConnectionRef.current && localStream) {
      // Check if we have any senders (outgoing tracks)
      const senders = peerConnectionRef.current.getSenders();
      if (senders.length === 0) {
        console.log("No outgoing tracks, starting to share stream");
        localStream.getTracks().forEach(track => {
          peerConnectionRef.current?.addTrack(track, localStream);
        });
      } else {
        console.log("Already sharing stream");
      }
    } else {
      console.log("PeerConnection or localStream not ready");
    }
  };

  const handleOffer = async (data: OfferData) => {
    if (peerConnectionRef.current) {
      try {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        socket?.emit("answer", { answer, roomId,targettedUser: remoteUser?.username });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    }
  };

  const handleAnswer = async (data: AnswerData) => {
    if (peerConnectionRef.current) {
      try {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    }
  };

  const handleIceCandidate = (data: IceCandidateData) => {
    console.log("users signals for iceCandidate is coming, streaming...")
    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
        checkAndStartStreaming();
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    }
  };


  const handleNoUser = (data: NoUserData) => {
    console.log(data.data);
    // Handle the case when no other user is in the room
  };

  const handleUserLeft = (data: JoinStatusData) => {
    console.log(data.from, "Left the contest");
    // Handle the case when a user leaves the room
    leaveRoom(false);
    setIsOwner(false);
    // setRemoteStream(null);
  };
  const stopStreaming = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.getSenders().forEach(sender => {
        peerConnectionRef.current?.removeTrack(sender);
      });
    }
    // setLocalStream(null)
    // setRemoteStream(null)
  };
  
  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
  
      if (peerConnectionRef.current) {
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current?.addTrack(track, stream);
        });
      }
    } catch (error) {
      console.error("Error starting stream:", error);
    }
  };

  const leaveRoom = (isLeave?: boolean) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (socket && isLeave) {
      socket.emit("leaveRoom");
      socket.disconnect();
    }

    if (localStream && isLeave) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    setRemoteStream(null);
    if(remoteUser){
      remoteUser.status = false;
    }

  };

  // useEffect(()=>{
  //   console.log(remoteUser)
  // },[remoteUser])

  const toggleAudio = () => {
    if (localStream ) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleRemoteAudio = () => {
    if (remoteStream) {
      const audioTracks = remoteStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleRemoteVideo = () => {
    if (remoteStream) {
      const videoTracks = remoteStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const value = {
    socket,
    connectSocket,
    disconnectSocket,
    remoteStream,
    setRemoteStream,
    localStream,
    setLocalStream,
    peerConnectionRef,
    handleAnswer,
    handleOffer,
    handleIceCandidate,
    leaveRoom,
    checkAndStartStreaming,
    handleUserLeft,
    initializeWebRTC,
    toggleAudio,
    toggleVideo,
    toggleRemoteAudio,
    toggleRemoteVideo,
    setRoomId,
    remoteUser,
    setRemoteUser,
    isOwner,
    setIsOwner,
    roomId,
    user,
    contestUser,
    setContestUser,
    startStreaming,
    stopStreaming,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
















 // useEffect(()=>{
  //   if(socket){

  //     socket.on("offer",handleOffer);
  //       socket.on("answer",handleAnswer);
  //       socket.on("iceCandidate",handleIceCandidate)
  //       return () => {
  //         socket.off("offer");
  //         socket.off("answer");
  //         socket.off("iceCandidate")
  
  //       };
  //   }
  // },[socket])

  // const handleAnswer = useCallback(async (data: AnswerData) => {
  //   if (peerConnectionRef.current) {
  //     try {
  //       await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
  //     } catch (error) {
  //       console.error('Error handling answer:', error);
  //     }
  //   }
  // }, []);

  // const handleOffer = useCallback(async (data: OfferData) => {
  //   if (peerConnectionRef.current) {
  //     try {
  //       await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
  //       const answer = await peerConnectionRef.current.createAnswer();
  //       await peerConnectionRef.current.setLocalDescription(answer);
  //       socket?.emit('answer', { answer, roomId: roomId });
  //     } catch (error) {
  //       console.error('Error handling offer:', error);
  //     }
  //   }
  // }, []);

  // const handleIceCandidate = useCallback((data: IceCandidateData) => {
  //   if (peerConnectionRef.current) {
  //     try {
  //       peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
  //       checkAndStartStreaming();
  //     } catch (error) {
  //       console.error('Error adding ICE candidate:', error);
  //     }
  //   }
  // }, []);

  // const leaveRoom = useCallback((isLeave?: boolean) => {
  //   if (peerConnectionRef.current) {
  //     peerConnectionRef.current.close();
  //     peerConnectionRef.current = null;
  //   }

  //   if (socket && isLeave) {
  //     socket.emit('leaveRoom');
  //     socket.disconnect();
  //   }

  //   if (localStream && isLeave) {
  //     localStream.getTracks().forEach((track) => track.stop());
  //     setLocalStream(null);
  //   }

  //   setRemoteStream(null);
  // }, []);

  // const checkAndStartStreaming = () => {
  //   if (peerConnectionRef.current && localStream) {
  //     const senders = peerConnectionRef.current.getSenders();
  //     if (senders.length === 0) {
  //       console.log('No outgoing tracks, starting to share stream');
  //       localStream.getTracks().forEach(track => {
  //         peerConnectionRef.current?.addTrack(track, localStream);
  //       });
  //     } else {
  //       console.log('Already sharing stream');
  //     }
  //   } else {
  //     console.log('PeerConnection or localStream not ready');
  //   }
  // };

  // const handleUserLeft = useCallback((data: UserLeftData) => {
  //   console.log(data.userId, 'Left the contest');
  //   leaveRoom(false);
  // }, [leaveRoom]);


  // const initializeWebRTC = async (roomId: string) => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //     setLocalStream(stream);

  //     peerConnectionRef.current = new RTCPeerConnection();

  //     stream.getTracks().forEach((track) => {
  //       if (peerConnectionRef.current) {
  //         peerConnectionRef.current.addTrack(track, stream);
  //       }
  //     });

  //     peerConnectionRef.current.ontrack = (event) => {
  //       setRemoteStream(event.streams[0]);
  //     };

  //     peerConnectionRef.current.onicecandidate = (event) => {
  //       if (event.candidate) {
  //         socket?.emit('iceCandidate', { candidate: event.candidate, roomId });
  //       }
  //     };

  //     const offer = await peerConnectionRef.current.createOffer();
  //     await peerConnectionRef.current.setLocalDescription(offer);
  //     socket?.emit('offer', { offer, roomId });
  //     console.log("offer sending")
  //   } catch (error) {
  //     console.error('Error initializing WebRTC:', error);
  //   }
  // };

  // const toggleAudio = useCallback(() => {
  //   if (localStream) {
  //     const audioTracks = localStream.getAudioTracks();
  //     audioTracks.forEach((track) => {
  //       track.enabled = !track.enabled;
  //     });
  //   }
  // }, []);

  // const toggleVideo = useCallback(() => {
  //   if (localStream) {
  //     const videoTracks = localStream.getVideoTracks();
  //     videoTracks.forEach((track) => {
  //       track.enabled = !track.enabled;
  //     });
  //   }
  // }, []);

  // const toggleRemoteAudio = useCallback(() => {
  //   if (remoteStream) {
  //     const audioTracks = remoteStream.getAudioTracks();
  //     audioTracks.forEach((track) => {
  //       track.enabled = !track.enabled;
  //     });
  //   }
  // }, []);

  // const toggleRemoteVideo = useCallback(() => {
  //   if (remoteStream) {
  //     const videoTracks = remoteStream.getVideoTracks();
  //     videoTracks.forEach((track) => {
  //       track.enabled = !track.enabled;
  //     });
  //   }
  // }, []);
  // / import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback,useRef } from 'react';
  // import io, { Socket } from 'socket.io-client';
  
  // interface UserDetails {
  //   userId: string;
  //   username: string;
  //   // Add any other user details you want to store
  // }
  
  // interface ContestUser {
  //   userId: string;
  //   username: string;
  //   // Add any other contest user details you want to store
  // }
  
  // interface SocketContextType {
  //   socket: Socket | null;
  //   connectSocket: (token: string) => void;
  //   disconnectSocket: () => void;
  //   userDetails: UserDetails | null;
  //   setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
  //   contestUser: ContestUser | null;
  //   setContestUser: React.Dispatch<React.SetStateAction<ContestUser | null>>;
  //   localStream:MediaStream | null;
  //   remoteStream:MediaStream | null;
  //   setLocalStream:React.Dispatch<React.SetStateAction<MediaStream | null>>;
  //   setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  //   peerConnectionRef:any;
  
  // }
  
  // export const SocketContext = createContext<SocketContextType | null>(null);
  
  // export const useSocket = () => {
  //   const context = useContext(SocketContext);
  //   if (!context) {
  //     throw new Error('useSocket must be used within a SocketProvider');
  //   }
  //   return context;
  // };
  
  // interface SocketProviderProps {
  //   children: ReactNode;
  // }
  
  // export const SocketProvider = ({ children }: React.PropsWithChildren<SocketProviderProps>) => {
  //   const [socket, setSocket] = useState<Socket | null>(null);
  //   const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  //   const [contestUser, setContestUser] = useState<ContestUser | null>(null);
  //   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  //   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  //   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  
  
  //   const connectSocket = useCallback((token: string) => {
  //     // Replace 'http://localhost:3002' with your actual backend URL
  //     const newSocket = io('http://localhost:3002', {
  //       auth: { token },
  //       reconnection: true,
  //       reconnectionAttempts: 5,
  //       reconnectionDelay: 1000,
  //     });
  
  //     newSocket.on('connect', () => {
  //       console.log('Socket connected');
  //     });
  
  //     newSocket.on('disconnect', () => {
  //       console.log('Socket disconnected');
  //     });
  
  //     setSocket(newSocket);
  //   }, []);
  
  //   const disconnectSocket = useCallback(() => {
  //     if (socket) {
  //       socket.disconnect();
  //       setSocket(null);
  //     }
  //   }, [socket]);
  
  
  
  
  //   const value = useMemo(
  //     () => ({
  //       socket,
  //       connectSocket,
  //       disconnectSocket,
  //       userDetails,
  //       setUserDetails,
  //       contestUser,
  //       setContestUser,
  //       localStream,
  //       setLocalStream,
  //       remoteStream,
  //       setRemoteStream,
  //       peerConnectionRef
  //     }),
  //     [socket,setRemoteStream,remoteStream,localStream,setLocalStream, connectSocket, disconnectSocket, userDetails, contestUser]
  //   );
  
  //   return (
  //     <SocketContext.Provider value={value}> {children} </SocketContext.Provider>
  //   );
  // };
  
  

