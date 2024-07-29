// import React, { useEffect, useRef, useState } from 'react';
// import { useParams,useNavigate } from 'react-router-dom';
// import io, { Socket } from 'socket.io-client';
// import ToastDemo from './Toast';
// import { VideoComponent, RemoteVideoComponent } from "./VideoView";
// import ButtonUI from "./Button";
// import AgreementPage from "./condition";
// import { useSocket } from './socketContext';
// // import VideoComponent from './VideoComponent';
// // import RemoteVideoComponent from './RemoteVideoComponent';
// // import ButtonUI from './ButtonUI';
// // import AgreementPage from './AgreementPage';

// const Meeting: React.FC = () => {
//   const { roomId, userId } = useParams<{ roomId: string; userId: string }>();
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [joinStatus, setJoinStatus] = useState<string>('');
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [isOwner, setIsOwner] = useState(false);
//   const [pendingUsers, setPendingUsers] = useState<string[]>([]);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const [isOwerJoined,setIsOwnerJoined] = useState<boolean>(false);
//   const [toast, setToast] = useState<string | null>(null);

//   const { setContextSocket,setContestUser,setUserDetails } = useSocket();
//   const navigate = useNavigate();
//   const [remoteUser,setRemoteUser] = useState<any>();


//   // const peerConnectionRef = useRef(null);
//   interface JoinStatusData {
//     status: string;
//     isOwner: boolean;
//     message: string;
//     from:string;
//     type:string;

//   }
  
//   interface OfferData {
//     offer: RTCSessionDescriptionInit;
//   }
  
//   interface AnswerData {
//     answer: RTCSessionDescriptionInit;
//   }
  
//   interface IceCandidateData {
//     candidate: RTCIceCandidateInit;
//   }
  
//   interface JoinRequestData {
//     userId: string;
//   }
  
//   interface NoUserData {
//     data: string;
//   }
  
//   interface UserLeftData {
//     userId: string;
//   }
  
//   const socketRef = useRef<Socket | null>(null);
  
//   useEffect(() => {
//     const newSocket = io('http://localhost:3002', {
//       auth: { token: userId },
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

  
//     newSocket.on('connect', () => {
//       console.log('Socket connected');
//       newSocket.emit('join', roomId);
//     });
  
//     newSocket.on('disconnect', () => {
//       leaveRoom(true);
//       console.log('Socket disconnected');
//     });
//     setContextSocket(newSocket);
//     setSocket(newSocket);
//     socketRef.current = newSocket;
  
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [userId, roomId]);
  
//   useEffect(() => {
//     if (socket) {
//       socket.on('joinStatus', handleJoinStatus);
//       socket.on('offer', handleOffer);
//       socket.on('answer', handleAnswer);
//       socket.on('iceCandidate', handleIceCandidate);
//       socket.on('joinRequest', handleJoinRequest);
//       socket.on('NoUser', handleNoUser);
//       socket.on('userLeft', handleUserLeft);
//       socket.on('startContest',handleStartContest);
  
//       return () => {
//         socket.off('joinStatus');
//         socket.off('offer');
//         socket.off('answer');
//         socket.off('iceCandidate');
//         socket.off('joinRequest');
//         socket.off('NoUser');
//         socket.off('userLeft');
//         socket.off('startContest')
//       };
//     }
//   }, [socket]);
  
//   const handleJoinStatus = (data: JoinStatusData) => {
//     setJoinStatus(data.status);
//     setIsOwner(data.isOwner);
//     console.log(data.status,data.isOwner,isOwner);
//     if (data.status === 'joined') {
//       setToast(data.message);
//       console.log(data.message);
//       setRemoteUser(data.from);
//       initializeWebRTC();
//     } else if (data.status === 'rejected') {
//       console.log("You are not allowed to join the contest");
//       setToast(data.message);
//     } else if (data.status === 'error') {
//       console.log(data.message);
//       setToast(data.message);
//     } else if (data.status === 'waiting') {
//       console.log(data.message);
//       setToast(data.message);
//     } else if (data.status === 'ownerJoined') {
//       setIsOwnerJoined(true);
//       setIsOwner(true)
//       console.log(data.message);
//       const userWantsToJoin = window.confirm(
//         `${data.message}\nDo you want to ask to join the room?`
//       );
//       if (userWantsToJoin) {
//         askForJoin();
//       }
//     }
//   };
  
//   const handleOffer = async (data: OfferData) => {
//     if (peerConnectionRef.current) {
//       try {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
//         const answer = await peerConnectionRef.current.createAnswer();
//         await peerConnectionRef.current.setLocalDescription(answer);
//         socket?.emit('answer', { answer, roomId });
//       } catch (error) {
//         console.error('Error handling offer:', error);
//       }
//     }
//   };
  
//   const handleAnswer = async (data: AnswerData) => {
//     if (peerConnectionRef.current) {
//       try {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//       } catch (error) {
//         console.error('Error handling answer:', error);
//       }
//     }
//   };
  
//   const handleIceCandidate = (data: IceCandidateData) => {
//     if (peerConnectionRef.current) {
//       try {
//         peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//       } catch (error) {
//         console.error('Error adding ICE candidate:', error);
//       }
//     }
//   };
  
//   const handleJoinRequest = (data: JoinRequestData) => {
//     setIsOwner(true);
//     setContestUser(data.userId)
//     setPendingUsers(prev => [...prev, data.userId]);
//   };
  
//   const handleNoUser = (data: NoUserData) => {
//     console.log(data.data);
//     // Handle the case when no other user is in the room
//   };

//   const handleUserLeft = (data: UserLeftData) => {
//     console.log(data.userId, "Left the contest");
//     // Handle the case when a user leaves the room
//     setRemoteStream(null);
//   };

//   const askForJoin = () => {
//     if (socket) {
//       socket.emit('join', roomId);
//     }
//   };

//   const initializeWebRTC = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setLocalStream(stream);

//       peerConnectionRef.current = new RTCPeerConnection();

//       stream.getTracks().forEach((track) => {
//         if (peerConnectionRef.current) {
//           peerConnectionRef.current.addTrack(track, stream);
//         }
//       });

//       peerConnectionRef.current.ontrack = (event) => {
//         setRemoteStream(event.streams[0]);
//       };

//       peerConnectionRef.current.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket?.emit('iceCandidate', { candidate: event.candidate, roomId });
//         }
//       };
//       const offer = await peerConnectionRef.current.createOffer();
//       await peerConnectionRef.current.setLocalDescription(offer);
//       socket?.emit('offer', { offer, roomId });
//     } catch (error) {
//       console.error('Error initializing WebRTC:', error);
//     }
//   };
 
//   const getRandomQuestion = ()=>{
//     // get the schedule by room/contest id 
//     // take topics, level
//     // both user id
//     // think how to give random questions
//     // then call this fucntion only once when the remote video set
//   }

//   const joinContest =()=>{
//     // send message to other peer if call this page if not called 
//      socket?.emit('startContest', {roomId});
//      leaveRoom(false);
//      navigate(`/contest/${roomId}/${userId}`);

//   }

//   const handleStartContest =(data:JoinStatusData)=>{
//     setToast(data.message);
//     leaveRoom(false);
//     navigate(`/contest/${roomId}/${userId}`);
//   }

//   const leaveRoom = (isLeave?:boolean) => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }

//     if (socket && isLeave) {
//       socket.emit("leaveRoom");
//       socket.disconnect();
//     }

//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//       setLocalStream(null);
//     }

//     setRemoteStream(null);
//   };

//   const toggleAudio = () => {
//     if (localStream) {
//       const audioTracks = localStream.getAudioTracks();
//       audioTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleVideo = () => {
//     if (localStream) {
//       const videoTracks = localStream.getVideoTracks();
//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteAudio = () => {
//     if (remoteStream) {
//       const audioTracks = remoteStream.getAudioTracks();
//       audioTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteVideo = () => {
//     if (remoteStream) {
//       const videoTracks = remoteStream.getVideoTracks();
//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const allowUser = (userId: string) => {
//     socket?.emit('allowUser', { userId, roomId });
//     setPendingUsers(prev => prev.filter(id => id !== userId));
//   };

//   const rejectUser = (userId: string) => {
//     socket?.emit('rejectUser', { userId, roomId });
//     setPendingUsers(prev => prev.filter(id => id !== userId));
//   };

//   return (
//     <section className="bg-gradient-to-r from-pink-100 to-purple-100 min-h-full">
//       <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 h-f">
//         <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
//           <div className="lg:col-span-3 lg:py-12">
//             <AgreementPage />
//           </div>
//           <div className="rounded-lg bg-white shadow-lg lg:col-span-2 flex flex-col justify-around">
//             <div className="">
//               <div className="flex justify-center">
//                 <VideoComponent
//                   stream={localStream}
//                   onToggleAudio={toggleAudio}
//                   onToggleVideo={toggleVideo}
//                 />
//               </div>
//               <div className="flex justify-center mt-2">
//                 <RemoteVideoComponent
//                   stream={remoteStream}
//                   onToggleAudio={toggleRemoteAudio}
//                   onToggleVideo={toggleRemoteVideo}
//                 />
//               </div>
//             </div>


//           {isOwner &&
//             <div className="flex justify-between">
//               <div className="mt-6 flex justify-start">
//                 <ButtonUI title="Leave" handleSubmit={leaveRoom} color="red" />
//               </div>
//               <div className="mt-6 flex justify-end">
//                 <ButtonUI title="Start" handleSubmit={joinContest} color="indigo" />
//               </div>
//             </div>
//           }
//           </div>
//           {isOwner && pendingUsers.length > 0 && (
//             <div role="alert" className="rounded-xl border border-gray-100 bg-white p-4">
//               <h3>Pending Join Requests:</h3>
//               {pendingUsers.map(userId => (
//                 <div key={userId}>
//                   User {userId} wants to join
//                   <ButtonUI title="Allow" handleSubmit={() => allowUser(userId)} color="green" />
//                   <ButtonUI title="Reject" handleSubmit={() => rejectUser(userId)} color="red" />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         {toast && <ToastDemo message={toast} onClose={() => setToast(null)} />}  
//       </div>
//     </section>
//   );
// };

// export default Meeting;




// ////

// // premeeting socket - 1


// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import io, { Socket } from "socket.io-client";
// import ToastDemo from "./Toast";
// import { VideoComponent, RemoteVideoComponent } from "./VideoView";
// import ButtonUI from "./Button";
// import AgreementPage from "./condition";
// import { useSocket } from "./socketContext";
// // import VideoComponent from './VideoComponent';
// // import RemoteVideoComponent from './RemoteVideoComponent';
// // import ButtonUI from './ButtonUI';
// // import AgreementPage from './AgreementPage';

// const Meeting: React.FC = () => {
//   const { roomId, userId } = useParams<{ roomId: string; userId: string }>();
//   // const [socket, setSocket] = useState<Socket | null>(null);
//   const [joinStatus, setJoinStatus] = useState<string>("");
//   const [isOwner, setIsOwner] = useState<any>(null);
//   const [pendingUsers, setPendingUsers] = useState<string[]>([]);
//   const [isOwerJoined, setIsOwnerJoined] = useState<boolean>(false);
//   const [toast, setToast] = useState<string | null>(null);

//   const {
//     socket,
//     connectSocket,
//     disconnectSocket,
//     userDetails,
//     setUserDetails,
//     contestUser,
//     setContestUser,
//     remoteStream,
//     setRemoteStream,
//     localStream,
//     setLocalStream,
//     peerConnectionRef,
//   } = useSocket();

//   const navigate = useNavigate();
//   const [remoteUser, setRemoteUser] = useState<any>();

//   // const peerConnectionRef = useRef(null);
//   interface JoinStatusData {
//     status: string;
//     isOwner: boolean;
//     message: string;
//     from: string;
//     type: string;
//   }

//   interface OfferData {
//     offer: RTCSessionDescriptionInit;
//   }

//   interface AnswerData {
//     answer: RTCSessionDescriptionInit;
//   }

//   interface IceCandidateData {
//     candidate: RTCIceCandidateInit;
//   }

//   interface JoinRequestData {
//     userId: string;
//   }

//   interface NoUserData {
//     data: string;
//   }

//   interface UserLeftData {
//     userId: string;
//   }

//   const socketRef = useRef<Socket | null>(null);
//   useEffect(() => {
//     // Assume you have a way to get the auth token, e.g., from localStorage
//     // const authToken = 
//     if (userId) {
//       connectSocket(userId);
//     }

//     return () => {
//       disconnectSocket();
//       leaveRoom(true)
//     };
//   }, []);


//   useEffect(() => {
//     if (socket) {
//       // socket.auth = { token: userId };
//       // socket.connect();
//       // socket.emit("join", roomId);

//       socket.on("connect", () => {
//         console.log("Socket connected");
//         socket.emit("join", roomId);
//       });

//       socket.on("disconnect", () => {
//         leaveRoom(true);
//         console.log("Socket disconnected");
//       });
//       // setContextSocket(socket);
//       // setSocket(newSocket);
//       socketRef.current = socket;

//       // return () => {
//       //   socket.disconnect();
//       // };
//     }
//   }, [ socket,userId,roomId ]);

//   useEffect(() => {
//     if (socket) {
//       socket.on("joinStatus", handleJoinStatus);
//       socket.on("offer", handleOffer);
//       socket.on("answer", handleAnswer);
//       socket.on("iceCandidate", handleIceCandidate);
//       socket.on("joinRequest", handleJoinRequest);
//       socket.on("NoUser", handleNoUser);
//       socket.on("userLeft", handleUserLeft);
//       socket.on("startContest", handleStartContest);

//       return () => {
//         socket.off("joinStatus");
//         socket.off("offer");
//         socket.off("answer");
//         socket.off("iceCandidate");
//         socket.off("joinRequest");
//         socket.off("NoUser");
//         socket.off("userLeft");
//         socket.off("startContest");
//       };
//     }
//   }, [socket]);

//   const handleJoinStatus = (data: JoinStatusData) => {
//     setJoinStatus(data.status);
//     if(data.status==='setOwner')
//       setIsOwner(data.isOwner);

//     console.log(data.status, data.isOwner, isOwner);
//     if (data.status === "joined") {
//       setToast(data.message);
//       console.log(data.message);
//       setRemoteUser(data.from);
//       initializeWebRTC();
//     } else if (data.status === "rejected") {
//       console.log("You are not allowed to join the contest");
//       setToast(data.message);
//     } else if (data.status === "error") {
//       console.log(data.message);
//       setToast(data.message);
//     } else if (data.status === "waiting") {
//       console.log(data.message);
//       setToast(data.message);
//     } else if (data.status === "ownerJoined") {
//       setIsOwnerJoined(true);
//       setIsOwner(true);
//       console.log(data.message);
//       const userWantsToJoin = window.confirm(
//         `${data.message}\nDo you want to ask to join the room?`
//       );
//       if (userWantsToJoin) {
//         askForJoin();
//       }
//     }
//   };

//   const checkAndStartStreaming = () => {
//     if (peerConnectionRef.current && localStream) {
//       // Check if we have any senders (outgoing tracks)
//       const senders = peerConnectionRef.current.getSenders();
//       if (senders.length === 0) {
//         console.log("No outgoing tracks, starting to share stream");
//         localStream.getTracks().forEach(track => {
//           peerConnectionRef.current?.addTrack(track, localStream);
//         });
//       } else {
//         console.log("Already sharing stream");
//       }
//     } else {
//       console.log("PeerConnection or localStream not ready");
//     }
//   };

//   const handleOffer = async (data: OfferData) => {
//     if (peerConnectionRef.current) {
//       try {
//         await peerConnectionRef.current.setRemoteDescription(
//           new RTCSessionDescription(data.offer)
//         );
//         const answer = await peerConnectionRef.current.createAnswer();
//         await peerConnectionRef.current.setLocalDescription(answer);
//         socket?.emit("answer", { answer, roomId });
//       } catch (error) {
//         console.error("Error handling offer:", error);
//       }
//     }
//   };

//   const handleAnswer = async (data: AnswerData) => {
//     if (peerConnectionRef.current) {
//       try {
//         await peerConnectionRef.current.setRemoteDescription(
//           new RTCSessionDescription(data.answer)
//         );
//       } catch (error) {
//         console.error("Error handling answer:", error);
//       }
//     }
//   };

//   const handleIceCandidate = (data: IceCandidateData) => {
//     console.log("users signals for iceCandidate is coming, streaming...")
//     if (peerConnectionRef.current) {
//       try {
//         peerConnectionRef.current.addIceCandidate(
//           new RTCIceCandidate(data.candidate)
//         );
//         checkAndStartStreaming();
//       } catch (error) {
//         console.error("Error adding ICE candidate:", error);
//       }
//     }
//   };

//   const handleJoinRequest = (data: JoinRequestData) => {
//     setIsOwner(true);
//     setContestUser(data.userId);
//     setPendingUsers((prev) => [...prev, data.userId]);
//   };

//   const handleNoUser = (data: NoUserData) => {
//     console.log(data.data);
//     // Handle the case when no other user is in the room
//   };

//   const handleUserLeft = (data: UserLeftData) => {
//     console.log(data.userId, "Left the contest");
//     // Handle the case when a user leaves the room
//     leaveRoom(false);
//     // setRemoteStream(null);
//   };

//   const askForJoin = () => {
//     if (socket) {
//       socket.emit("join", roomId);
//     }
//   };

//   const initializeWebRTC = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setLocalStream(stream);

//       peerConnectionRef.current = new RTCPeerConnection();

//       stream.getTracks().forEach((track) => {
//         if (peerConnectionRef.current) {
//           peerConnectionRef.current.addTrack(track, stream);
//         }
//       });

//       peerConnectionRef.current.ontrack = (event) => {
//         setRemoteStream(event.streams[0]);
//       };

//       peerConnectionRef.current.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket?.emit("iceCandidate", { candidate: event.candidate, roomId });
//         }
//       };
//       const offer = await peerConnectionRef.current.createOffer();
//       await peerConnectionRef.current.setLocalDescription(offer);
//       socket?.emit("offer", { offer, roomId });
//     } catch (error) {
//       console.error("Error initializing WebRTC:", error);
//     }
//   };

//   const getRandomQuestion = () => {
//     // get the schedule by room/contest id
//     // take topics, level
//     // both user id
//     // think how to give random questions
//     // then call this fucntion only once when the remote video set
//   };

//   const joinContest = () => {
//     // send message to other peer if call this page if not called
//     socket?.emit("startContest", { roomId });
//     // leaveRoom(false);
//     navigate(`/contest/${roomId}/${userId}`);
//   };

//   const handleStartContest = (data: JoinStatusData) => {
//     setToast(data.message);
//     // leaveRoom(false);
//     navigate(`/contest/${roomId}/${userId}`);
//   };

//   const leaveRoom = (isLeave?: boolean) => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }

//     if (socket && isLeave) {
//       socket.emit("leaveRoom");
//       socket.disconnect();
//     }

//     if (localStream && isLeave) {
//       localStream.getTracks().forEach((track) => track.stop());
//       setLocalStream(null);
//     }

//     setRemoteStream(null);
//   };

//   const toggleAudio = () => {
//     if (localStream) {
//       const audioTracks = localStream.getAudioTracks();
//       audioTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleVideo = () => {
//     if (localStream) {
//       const videoTracks = localStream.getVideoTracks();
//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteAudio = () => {
//     if (remoteStream) {
//       const audioTracks = remoteStream.getAudioTracks();
//       audioTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteVideo = () => {
//     if (remoteStream) {
//       const videoTracks = remoteStream.getVideoTracks();
//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const allowUser = (userId: string) => {
//     socket?.emit("allowUser", { userId, roomId });
//     setPendingUsers((prev) => prev.filter((id) => id !== userId));
//   };

//   const rejectUser = (userId: string) => {
//     socket?.emit("rejectUser", { userId, roomId });
//     setPendingUsers((prev) => prev.filter((id) => id !== userId));
//   };

//   return (
//     <section className="bg-gradient-to-r from-pink-100 to-purple-100 min-h-full">
//       <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 h-f">
//         <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
//           <div className="lg:col-span-3 lg:py-12">
//             <AgreementPage />
//           </div>
//           <div className="rounded-lg bg-white shadow-lg lg:col-span-2 flex flex-col justify-around">
//             <div className="">
//               <div className="flex justify-center">
//                 <VideoComponent
//                   stream={localStream}
//                   onToggleAudio={toggleAudio}
//                   onToggleVideo={toggleVideo}
//                 />
//               </div>
//               <div className="flex justify-center mt-2">
//                 <RemoteVideoComponent
//                   stream={remoteStream}
//                   onToggleAudio={toggleRemoteAudio}
//                   onToggleVideo={toggleRemoteVideo}
//                 />
//               </div>
//             </div>

//             {isOwner && (
//               <div className="flex justify-between">
//                 <div className="mt-6 flex justify-start">
//                   <ButtonUI
//                     title="Leave"
//                     handleSubmit={leaveRoom}
//                     color="red"
//                   />
//                 </div>
//                 <div className="mt-6 flex justify-end">
//                   <ButtonUI
//                     title="Start"
//                     handleSubmit={joinContest}
//                     color="indigo"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//           {isOwner && pendingUsers.length > 0 && (
//             <div
//               role="alert"
//               className="rounded-xl border border-gray-100 bg-white p-4"
//             >
//               <h3>Pending Join Requests:</h3>
//               {pendingUsers.map((userId) => (
//                 <div key={userId}>
//                   User {userId} wants to join
//                   <ButtonUI
//                     title="Allow"
//                     handleSubmit={() => allowUser(userId)}
//                     color="green"
//                   />
//                   <ButtonUI
//                     title="Reject"
//                     handleSubmit={() => rejectUser(userId)}
//                     color="red"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         {toast && <ToastDemo message={toast} onClose={() => setToast(null)} />}
//       </div>
//     </section>
//   );
// };

// export default Meeting;


