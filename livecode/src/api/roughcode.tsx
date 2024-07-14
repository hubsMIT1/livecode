
// Premeeting page

// // VideoCall.tsx
// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer/simplepeer.min.js";
// import { VideoComponent, RemoteVideoComponent } from "./VideoView";
// import ButtonUI from "./Button";
// import AgreementPage from "./condition";
// import { useNavigate } from "react-router-dom";
// import { useSocket } from './socketContext';
// import uuid4 from "uuid4";
// import { useParams } from "react-router-dom";
// import { user1 } from "@/api/constants";
// const VideoCall: React.FC = () => {
  // const { setSocket } = useSocket();
//   const navigate = useNavigate();

//   const socketRef = useRef<SocketIOClient.Socket>();
//   const peerRef = useRef<Peer.Instance>();
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [isOwner, setIsOwner] = useState(false);
//   const [pendingUsers, setPendingUsers] = useState<string[]>([]);
//   const [joinStatus, setJoinStatus] = useState<string | null>(null);
//   const {id} = useParams() //useRef(uuid4());
//   const contestId = useRef(id);

//   useEffect(() => {
//     const token = uuid4(); // Assuming you store the JWT in localStorage
//     const socket = io("http://localhost:3002", {
//       auth: { token:token }
//     });
//     socketRef.current = socket;
//     setSocket(socket);

//     socket.on("joinStatus", (status) => {
//       setJoinStatus(status.status);
//       if (status.status === 'joined') {
//         setIsOwner(status.isOwner);
//         if (status.isOwner) {
//           // Start the meeting for the owner
//           joinRoom();
//         }
//       }
//     });

//     socket.on("joinRequest", ({ userId, roomId }) => {
//       setPendingUsers(prev => [...prev, userId]);
//     });

//     socket.on("userJoined", (userId) => {
//       console.log(`User ${userId} joined the room`);
//       // Initiate peer connection here
//     });

//     socket.on("userLeft", (userId) => {
//       console.log(`User ${userId} left the room`);
//       // Handle peer disconnection here
//     });

//     socket.on("ownershipTransferred", () => {
//       setIsOwner(true);
//     });
//     // Handle signaling events
//     socketRef.current.on("offer", handleOffer);
//     socketRef.current.on("answer", handleAnswer);
//     socketRef.current.on("iceCandidate", handleIceCandidate);

//     // Cleanup on component unmount
//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, [setSocket]);

//   const handleOffer = (offer: Peer.SignalData) => {
//     // Handle received offer and create an answer
//     if (peerRef.current) {
//       peerRef.current.signal(offer);
//     } else {
//       // Create a new peer connection if it doesn't exist
//       peerRef.current = new Peer({
//         initiator: false,
//         trickle: false,
//       });

//       // Handle signaling events
//       peerRef.current.on("signal", (data: Peer.SignalData) => {
//         // Send the answer back to the server
//         socketRef.current?.emit("answer", data);
//       });

//       peerRef.current.on("stream", (stream: MediaStream) => {
//         // Set the remote video stream
//         setRemoteStream(stream);
//       });

//       // Signal the received offer
//       peerRef.current.signal(offer);
//     }
//   };

//   const handleAnswer = (answer: Peer.SignalData) => {
//     // Handle received answer
//     if (peerRef.current) {
//       peerRef.current.signal(answer);
//     }
//   };

//   const handleIceCandidate = (candidate: Peer.ICECandidateJSON) => {
//     // Handle received ICE candidate
//     if (peerRef.current) {
//       peerRef.current.signal({
//         type: "candidate",
//         candidate: JSON.stringify(candidate),
//       });
//     }
//   };

//   const startContest = () => {
//     // if (localStream) {
//     //   localStream.getTracks().forEach((track) => track.stop());
//     //   setLocalStream(null);
//     // }
//     // setRemoteStream(null);
//     // navigate(`/contest/${contestId.current}`);
//     joinRoom()
//   };

//   const allowUser = (userId: string) => {
//     socketRef.current?.emit('allowUser', { userId, roomId: contestId.current });
//     setPendingUsers(prev => prev.filter(id => id !== userId));
//   };

//   const rejectUser = (userId: string) => {
//     socketRef.current?.emit('rejectUser', { userId, roomId: contestId.current });
//     setPendingUsers(prev => prev.filter(id => id !== userId));
//   };

//   const joinRoom = () => {

//     // Get the local video stream
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         // Set the local video stream
//         setLocalStream(stream);

//         // Create a new peer connection
//         peerRef.current = new Peer({
//           initiator: true,
//           trickle: false,
//           stream: stream,
//         });

//         // Handle signaling events
//         peerRef.current.on("signal", (data: Peer.SignalData) => {
//           // Send the signaling data to the server
//           socketRef.current?.emit("offer", data);
//           console.log("sending your video");
//         });

//         peerRef.current.on("stream", (stream: MediaStream) => {
//           // Set the remote video stream
//           console.log("got peers video");
//           setRemoteStream(stream);
//         });

//         // Join the room
//         socketRef.current?.emit('join', contestId.current);
//       })
//       .catch((error) => {
//         console.error("Error accessing media devices:", error);
//       });

//   };

//   useEffect(()=>{
//     joinRoom()
//   },[])

//   const leaveRoom = () => {
//     // Disconnect from the room and cleanup
//     if (peerRef.current) {
//       peerRef.current.destroy();
//       peerRef.current = undefined;
//     }

//     if (socketRef.current) {
//       socketRef.current.emit("leaveRoom");
//       socketRef.current.disconnect();
//     }

//     // Stop the local video stream
//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//       setLocalStream(null);
//     }

//     // Clear the remote video
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
//     console.log(localStream);
//     if (localStream) {
//       const videoTracks = localStream.getVideoTracks();

//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteAudio = () => {
//     console.log("toggle audio remote");

//     // Toggle remote audio mute/unmute
//     if (remoteStream) {
//       const audioTracks = remoteStream.getAudioTracks();

//       audioTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteVideo = () => {
//     console.log("toggle video remote");

//     // Toggle remote video on/off
//     if (remoteStream) {
//       const videoTracks = remoteStream.getVideoTracks();
//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//    return (
//     <section className="bg-gradient-to-r from-pink-100 to-purple-100 min-h-full">
//       <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 h-f">
//         <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
//           <div className="lg:col-span-3 lg:py-12">
//             <AgreementPage />
//           </div>
//           <div className="rounded-lg bg-white shadow-lg lg:col-span-2 flex flex-col justify-around">
//             {joinStatus === 'pending' && (
//               <div>Waiting for the owner to allow you to join...</div>
//             )}
//             {joinStatus === 'joined' && (
//               <>
//                 <div>
//                   <div className="flex justify-center">
//                     <VideoComponent
//                       stream={localStream}
//                       onToggleAudio={toggleAudio}
//                       onToggleVideo={toggleVideo}
//                     />
//                   </div>
//                   <div className="flex justify-center mt-2 w-full">
//                     <RemoteVideoComponent
//                       stream={remoteStream}
//                       onToggleAudio={toggleRemoteAudio}
//                       onToggleVideo={toggleRemoteVideo}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <div className="mt-6 flex justify-start">
//                     <ButtonUI title="Leave" handleSubmit={leaveRoom} color="red" />
//                   </div>
//                   <div className="mt-6 flex justify-end max-w-10">
//                     <ButtonUI
//                       title="Start Contest"
//                       handleSubmit={startContest}
//                       color="indigo"
//                     />
//                   </div>
//                 </div>
//               </>
//             )}
//             {isOwner && pendingUsers.length > 0 && (
//               <div role="alert" className="rounded-xl border border-gray-100 bg-white p-4">
//                 <h3>Pending Join Requests:</h3>
//                 {pendingUsers.map(userId => (
//                   <div key={userId}>
//                     User {userId} wants to join
//                     <ButtonUI title="Allow" handleSubmit={() => allowUser(userId)} color="green" />
//                     <ButtonUI title="Reject" handleSubmit={() => rejectUser(userId)} color="red" />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
// export default VideoCall;

// VideoCall.tsx
// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer/simplepeer.min.js";
// import { VideoComponent, RemoteVideoComponent } from "./VideoView";
// import ButtonUI from "./Button";
// import AgreementPage from "./condition";
// import {redirect,useNavigate, useParams} from "react-router-dom";
// import uuid4 from "uuid4";

// const VideoCall: React.FC = () => {
//   // ... (keep the existing code)
//   const navigate = useNavigate();

//   const socketRef = useRef<SocketIOClient.Socket>();
//   const peerRef = useRef<Peer.Instance>();
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [isOwner, setIsOwner] = useState(false);
//   const [pendingUsers, setPendingUsers] = useState<string[]>([]);
//   const [joinStatus, setJoinStatus] = useState<string | null>(null);
//   const {id} = useParams() //useRef(uuid4());
//   const contestId = useRef(id);

//   useEffect(() => {
//     // Connect to the server using Socket.IO
//     // socketRef.current = io("http://localhost:3002");
//     let token = localStorage.getItem('token'); // Assuming you store the JWT in localStorage

//     if(!token){
//       token = uuid4();
//       localStorage.setItem('token',token!);
//     }
//     const socket = io("http://localhost:3002", {
//       auth: { token:token }
//     });
//     socketRef.current = socket;
//     // setSocket(socket);

//     socket.on("joinStatus", (status) => {
//       setJoinStatus(status.status);
//       if (status.status === 'joined') {
//         setIsOwner(status.isOwner);
//         if (status.isOwner) {
//           // Start the meeting for the owner
//           joinRoom();
//         }
//       }
//     });

//     socket.on("joinRequest", ({ userId, roomId }) => {
//       setPendingUsers(prev => [...prev, userId]);
//     });

//     socket.on("userJoined", (userId) => {
//       console.log(`User ${userId} joined the room`);
//       // Initiate peer connection here
//     });

//     socket.on("userLeft", (userId) => {
//       console.log(`User ${userId} left the room`);
//       // Handle peer disconnection here
//     });

//     socket.on("ownershipTransferred", () => {
//       setIsOwner(true);
//     });

//     // Handle signaling events
//     socketRef.current.on("offer", handleOffer);
//     socketRef.current.on("answer", handleAnswer);
//     socketRef.current.on("iceCandidate", handleIceCandidate);

//     // Cleanup on component unmount
//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, []);

//     const allowUser = (userId: string) => {
//     socketRef.current?.emit('allowUser', { userId, roomId: contestId.current });
//     setPendingUsers(prev => prev.filter(id => id !== userId));
//   };

//   const rejectUser = (userId: string) => {
//     socketRef.current?.emit('rejectUser', { userId, roomId: contestId.current });
//     setPendingUsers(prev => prev.filter(id => id !== userId));
//   };

//   const handleOffer = (offer: Peer.SignalData) => {
//     // Handle received offer and create an answer
//     if (peerRef.current) {
//       peerRef.current.signal(offer);
//     } else {
//       // Create a new peer connection if it doesn't exist
//       peerRef.current = new Peer({
//         initiator: false,
//         trickle: false,
//       });

//       // Handle signaling events
//       peerRef.current.on("signal", (data: Peer.SignalData) => {
//         // Send the answer back to the server
//         socketRef.current?.emit("answer", data);
//       });

//       peerRef.current.on("stream", (stream: MediaStream) => {
//         // Set the remote video stream
//         setRemoteStream(stream);
//       });

//       // Signal the received offer
//       peerRef.current.signal(offer);
//     }
//   };

//   const handleAnswer = (answer: Peer.SignalData) => {
//     // Handle received answer
//     if (peerRef.current) {
//       peerRef.current.signal(answer);
//     }
//   };

//   const handleIceCandidate = (candidate: Peer.ICECandidateJSON) => {
//     // Handle received ICE candidate
//     if (peerRef.current) {
//       peerRef.current.signal({
//         type: "candidate",
//         candidate: JSON.stringify(candidate),
//       });
//     }
//   };

//   const joinRoom = () => {
//     console.log("go to contest room")
//     // navigate(`/contest/122`);
//     // Get the local video stream
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         // Set the local video stream
//         setLocalStream(stream);

//         // Create a new peer connection
//         peerRef.current = new Peer({
//           initiator: true,
//           trickle: false,
//           stream: stream,
//         });

//         // Handle signaling events
//         peerRef.current.on("signal", (data: Peer.SignalData) => {
//           // Send the signaling data to the server
//           socketRef.current?.emit("offer", data);
//           console.log("sending your video");
//         });

//         peerRef.current.on("stream", (stream: MediaStream) => {
//           // Set the remote video stream
//           console.log("got peers video");
//           setRemoteStream(stream);
//         });

//         // Join the room
//         socketRef.current?.emit("join", "roomId");
//       })
//       .catch((error) => {
//         console.error("Error accessing media devices:", error);
//       });

//   };

//   const leaveRoom = () => {
//     // Disconnect from the room and cleanup
//     if (peerRef.current) {
//       peerRef.current.destroy();
//       peerRef.current = undefined;
//     }

//     if (socketRef.current) {
//       socketRef.current.emit("leaveRoom");
//       socketRef.current.disconnect();
//     }

//     // Stop the local video stream
//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//       setLocalStream(null);
//     }

//     // Clear the remote video
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
//     console.log(localStream);
//     if (localStream) {
//       const videoTracks = localStream.getVideoTracks();

//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteAudio = () => {
//     console.log("toggle audio remote");

//     // Toggle remote audio mute/unmute
//     if (remoteStream) {
//       const audioTracks = remoteStream.getAudioTracks();

//       audioTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteVideo = () => {
//     console.log("toggle video remote");

//     // Toggle remote video on/off
//     if (remoteStream) {
//       const videoTracks = remoteStream.getVideoTracks();
//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
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
//               <div className=" flex justify-center ">
//                 <VideoComponent
//                   stream={localStream}
//                   onToggleAudio={toggleAudio}
//                   onToggleVideo={toggleVideo}
//                 />
//                 {/* <button onClick={toggleVideo}>Control video</button> */}
//               </div>
//               <div className="flex justify-center mt-2 w-full">
//                 <RemoteVideoComponent
//                   stream={remoteStream}
//                   onToggleAudio={toggleRemoteAudio}
//                   onToggleVideo={toggleRemoteVideo}
//                 />
//               </div>
//             </div>

//             <div className="flex justify-between">
//               <div className="mt-6 flex justify-start">
//                 <ButtonUI title="Leave" handleSubmit={leaveRoom} color="red" />
//               </div>
//               <div className="mt-6 flex justify-end max-w-10">
//                 <ButtonUI
//                   title="Start"
//                   handleSubmit={joinRoom}
//                   color="indigo"
//                 />
//               </div>
//             </div>
//           </div>
//           {isOwner && pendingUsers.length > 0 && (
//               <div role="alert" className="rounded-xl border border-gray-100 bg-white p-4">
//                 <h3>Pending Join Requests:</h3>
//                 {pendingUsers.map(userId => (
//                   <div key={userId}>
//                     User {userId} wants to join
//                     <ButtonUI title="Allow" handleSubmit={() => allowUser(userId)} color="green" />
//                     <ButtonUI title="Reject" handleSubmit={() => rejectUser(userId)} color="red" />
//                   </div>
//                 ))}
//               </div>
//             )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default VideoCall;

// VideoCall.tsx
// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer/simplepeer.min.js";
// import { VideoComponent, RemoteVideoComponent } from "./VideoView";
// import ButtonUI from "./Button";
// import AgreementPage from "./condition";
// import { useSocket } from './socketContext';
//   const { setSocket } = useSocket();

// import { redirect, useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";

// interface PeerSignalData {
//   type: string;
//   sdp?: string;
//   candidate?: RTCIceCandidate;
// }
// const VideoCall: React.FC = () => {
//   // ... (keep the existing code)
//   const navigate = useNavigate();

//   const socketRef = useRef<SocketIOClient.Socket>();
//   const peerRef = useRef<Peer.Instance>();
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [isOwner, setIsOwner] = useState(false);
//   const [pendingUsers, setPendingUsers] = useState<string[]>([]);
//   const [joinStatus, setJoinStatus] = useState<string | null>(null);
//   const [peerUserId, setPeerUserId] = useState<string | null>(null);
//   const { cId, uId } = useParams();

//   useEffect(() => {
//     const socket = io("http://localhost:3002", {
//       auth: { token: uId },
//     });
//     socketRef.current = socket;
//     // setSocket(socket);

//     socket.on("joinStatus", (status) => {
//       setJoinStatus(status.status);
//       if (status.status === "joined") {
//         setIsOwner(status.isOwner);
//         if (status.isOwner) {
//           // Start the meeting for the owner
//           joinRoom();
//         }
//       }
//     });

//     socket.on("joinRequest", ({ userId }) => {
//       setPendingUsers((prev) => [...prev, userId]);
//     });

//     socket.on("userJoined", (userId) => {
//       console.log(`User ${userId} joined the room`);
//       // Initiate peer connection here
//     });

//     socket.on("userLeft", (userId) => {
//       console.log(`User ${userId} left the room`);
//       // Handle peer disconnection here
//     });

//     socket.on("ownershipTransferred", () => {
//       setIsOwner(true);
//     });

//     socketRef.current.on("offer", handleOffer);
//     socketRef.current.on("answer", handleAnswer);
//     socketRef.current.on("iceCandidate", handleIceCandidate);

//     return () => {
//       socketRef.current?.disconnect();
//       if (peerRef.current) {
//         peerRef.current.destroy();
//       }
//     };
//   }, []);

//   const createPeer = (initiator: boolean, stream: MediaStream) => {
//     const peer = new Peer({
//       initiator,
//       trickle: false,
//       stream,
//     });

//     peer.on("signal", (data: PeerSignalData) => {
//       if (data.type === "offer") {
//         socketRef.current?.emit("offer", { offer: data, roomId: cId });
//       } else if (data.type === "answer") {
//         socketRef.current?.emit("answer", { answer: data, roomId: cId });
//       } else if (data.candidate) {
//         socketRef.current?.emit("iceCandidate", {
//           candidate: data.candidate,
//           roomId: cId,
//         });
//       }
//     });

//     peer.on("stream", (stream: MediaStream) => {
//       setRemoteStream(stream);
//     });

//     return peer;
//   };

//   const joinRoom = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setLocalStream(stream);
//         socketRef.current?.emit("join",cId);
//         peerRef.current = createPeer(true, stream);
//       })
//       .catch((error) => {
//         console.error("Error accessing media devices:", error);
//       });
//   };

//   const handleOffer = (data: { offer: PeerSignalData; fromUserId: string }) => {
//     console.log(`Received offer from user ${data.fromUserId}`);
//     setPeerUserId(data.fromUserId);

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setLocalStream(stream);
//         if (!peerRef.current) {
//           peerRef.current = createPeer(false, stream);
//         }
//         peerRef.current.signal(data.offer);
//       })
//       .catch((error) => {
//         console.error("Error accessing media devices:", error);
//       });
//   };

//   const handleAnswer = (data: {
//     answer: PeerSignalData;
//     fromUserId: string;
//   }) => {
//     console.log(`Received answer from user ${data.fromUserId}`);
//     setPeerUserId(data.fromUserId);

//     if (peerRef.current) {
//       peerRef.current.signal(data.answer);
//     } else {
//       console.warn("Received answer, but peer connection doesn't exist");
//     }
//   };

//   const handleIceCandidate = (data: {
//     candidate: RTCIceCandidate;
//     fromUserId: string;
//   }) => {
//     console.log(`Received ICE candidate from user ${data.fromUserId}`);

//     if (peerRef.current) {
//       peerRef.current.signal({ candidate: data.candidate });
//     } else {
//       console.warn("Received ICE candidate, but peer connection doesn't exist");
//     }
//   };

//   const allowUser = (userId: string) => {
//     socketRef.current?.emit("allowUser", { userId, roomId: cId });
//     setPendingUsers((prev) => prev.filter((id) => id !== userId));
//   };

//   const rejectUser = (userId: string) => {
//     socketRef.current?.emit("rejectUser", { userId, roomId: cId });
//     setPendingUsers((prev) => prev.filter((id) => id !== userId));
//   };

//   const handleJoining = () => {
//     console.log("go to contest room");
//     // navigate(`/contest/122`);
//     // Get the local video stream
//     socketRef.current?.emit("join", cId);
//   };
 
//   const leaveRoom = () => {
//     // Disconnect from the room and cleanup
//     if (peerRef.current) {
//       peerRef.current.destroy();
//       peerRef.current = undefined;
//     }

//     if (socketRef.current) {
//       socketRef.current.emit("leaveRoom");
//       socketRef.current.disconnect();
//     }

//     // Stop the local video stream
//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//       setLocalStream(null);
//     }

//     // Clear the remote video
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
//     console.log(localStream);
//     if (localStream) {
//       const videoTracks = localStream.getVideoTracks();

//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteAudio = () => {
//     console.log("toggle audio remote");

//     // Toggle remote audio mute/unmute
//     if (remoteStream) {
//       const audioTracks = remoteStream.getAudioTracks();

//       audioTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleRemoteVideo = () => {
//     console.log("toggle video remote");

//     // Toggle remote video on/off
//     if (remoteStream) {
//       const videoTracks = remoteStream.getVideoTracks();
//       videoTracks.forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
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
//               <div className=" flex justify-center ">
//                 <VideoComponent
//                   stream={localStream}
//                   onToggleAudio={toggleAudio}
//                   onToggleVideo={toggleVideo}
//                 />
//                 {/* <button onClick={toggleVideo}>Control video</button> */}
//               </div>
//               {remoteStream && (
//                 <div className="flex justify-center mt-2 w-full">
//                   <RemoteVideoComponent
//                     stream={remoteStream}
//                     onToggleAudio={toggleRemoteAudio}
//                     onToggleVideo={toggleRemoteVideo}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-between">
//               <div className="mt-6 flex justify-start">
//                 <ButtonUI title="Leave" handleSubmit={leaveRoom} color="red" />
//               </div>
//               <div className="mt-6 flex justify-end max-w-10">
//                 <ButtonUI
//                   title="Start"
//                   handleSubmit={handleJoining}
//                   color="indigo"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {isOwner && pendingUsers.length > 0 && (
//         <div
//           role="alert"
//           className=" rounded-xl border border-gray-100 bg-white p-4"
//         >
//           <h3>Pending Join Requests:</h3>
//           {pendingUsers.map((userId) => (
//             <div key={userId}>
//               User {userId} wants to join
//               <ButtonUI
//                 title="Allow"
//                 handleSubmit={() => allowUser(userId)}
//                 color="green"
//               />
//               <ButtonUI
//                 title="Reject"
//                 handleSubmit={() => rejectUser(userId)}
//                 color="red"
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default VideoCall;

// components/Meeting.tsx
// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import io, { Socket } from 'socket.io-client';

// const Meeting: React.FC = () => {
//   const { roomId, userId } = useParams<{ roomId: string; userId: string }>();
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [joinStatus, setJoinStatus] = useState<string>('');
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

//   useEffect(() => {
//     const newSocket = io('http://localhost:3002', {
//       auth: { token: userId },
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [userId]);

//   useEffect(() => {
//     if (socket) {
//       socket.emit('join', roomId);

//       socket.on('joinStatus', (data) => {
//         setJoinStatus(data.status);
//         if (data.status === 'joined') {
//           initializeWebRTC();
//         }
//       });

//       socket.on('offer', async (data) => {
//         if (peerConnectionRef.current) {
//           await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
//           const answer = await peerConnectionRef.current.createAnswer();
//           await peerConnectionRef.current.setLocalDescription(answer);
//           socket.emit('answer', { answer, roomId });
//         }
//       });

//       socket.on('answer', async (data) => {
//         if (peerConnectionRef.current) {
//           await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//         }
//       });

//       socket.on('iceCandidate', (data) => {
//         if (peerConnectionRef.current) {
//           peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//         }
//       });
//     }
//   }, [socket, roomId]);

//   const initializeWebRTC = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

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

//   useEffect(() => {
//     if (remoteVideoRef.current && remoteStream) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [remoteStream]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Meeting Room: {roomId}</h1>
//       <p className="mb-4">Join Status: {joinStatus}</p>
//       <div className="flex space-x-4">
//         <div className="w-1/2">
//           <h2 className="text-xl font-semibold mb-2">Local Video</h2>
//           <video ref={localVideoRef} autoPlay muted playsInline className="w-full" />
//         </div>
//         <div className="w-1/2">
//           <h2 className="text-xl font-semibold mb-2">Remote Video</h2>
//           <video ref={remoteVideoRef} autoPlay playsInline className="w-full" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Meeting;

// components/Meeting.tsx
