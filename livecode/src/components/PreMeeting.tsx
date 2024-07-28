import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ToastDemo from "./Toast";
import { VideoComponent, RemoteVideoComponent } from "./VideoView";
import ButtonUI from "./Button";
import AgreementPage from "./condition";
import { useSocket } from "./socketContext";
import { JoinRequestData, JoinStatusData } from '../lib/interfaces';
import { serviceApiAction } from '../lib/endUserServicesApi'
import { User } from "lucide-react";

const Meeting: React.FC = () => {
  const { roomId, username, remote } = useParams<{ roomId: string; username: string; remote: string }>();
  const [joinStatus, setJoinStatus] = useState<string>("");
  const [pendingUsers, setPendingUsers] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isOwnerJoined, setIsOwnerJoined] = useState<boolean>(false);
  const [allowedUser, setAllowedUser] = useState<string[]>([])
  const navigate = useNavigate();
  const [requestUser, setRequestedUser] = useState<string | undefined>(undefined)
  const {
    socket,
    remoteStream,
    localStream,
    leaveRoom,
    toggleAudio,
    toggleVideo,
    toggleRemoteAudio,
    toggleRemoteVideo,
    handleUserLeft,
    remoteUser,
    setRemoteUser,
    setRoomId,
    setIsOwner,
    isOwner,
    contestUser,
    setContestUser,
    stopStreaming,
    initializeWebRTC,
    user,
  } = useSocket();


  // useEffect(() => {
  //   if (username) setContestUser(username);
  //   // if (remote) setRemoteUser({ username: remote,status:true });
  //   if (roomId) setRoomId(roomId);
  // }, [username, roomId, setContestUser, setRoomId]);

  useEffect(() => {
    // if (username) setContestUser(username);
    // if (remote) setRemoteUser({ username: remote,status:true });
    if (roomId) setRoomId(roomId);
  }, [roomId, setRoomId]);

  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => {
      console.log("Socket connected");
      socket.emit("join", { roomId });
    };
    socket.on("connect", handleConnect);
    socket.on("joinStatus", handleJoinStatus);
    socket.on("joinRequest", handleJoinRequest);
    socket.on("NoUser", handleNoUser);
    socket.on("userLeft", handleUserLeft);
    socket.on("startContest", handleStartContest);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("joinStatus", handleJoinStatus);
      socket.off("joinRequest", handleJoinRequest);
      socket.off("NoUser", handleNoUser);
      socket.off("userLeft", handleUserLeft);
      socket.off("startContest", handleStartContest);
    };
  }, [socket, roomId]);

  const handleJoinStatus = async (data: JoinStatusData) => {
    setJoinStatus(data.status);
    console.log(data.status, data.isOwner, isOwner);
    if (data.status === "joined") {

      setIsOwner(data?.ownerId === user.username);
      setToast(data.message);
      console.log(data.message);
      if (data.allowedUser) {
        const rUser = Array.from(data.allowedUser).find((name) => name !== user.username) || null;
        setAllowedUser(data.allowedUser)
        if (rUser) {
          remoteUser.username = rUser;
          remoteUser.status = true;
        }
        await initializeWebRTC(roomId!);
      }
    } else if (data.status === "rejected" || data.status === "error" || data.status === "waiting") {
      console.log(data.message);
      setToast(data.message);
    } else if (data.status === "ownerJoined") {
      setIsOwnerJoined(true);
      // console.log(data.message);
      // const userWantsToJoin = window.confirm(
      //   `${data.message}\nDo you want to ask to join the room?`
      // );
      // if (userWantsToJoin) {
      //   askForJoin();
      // }
    }
  };

  const handleJoinRequest = (data: JoinStatusData) => {
    setIsOwner(true);
    // setRemoteUser({ username: data?.from, isOwner: false });
    setRequestedUser(data.from);
    console.log(data.message, "request to join", data.from, roomId);
    setPendingUsers((prev) => [...prev, data.from]);
  };

  const handleNoUser = (data: JoinStatusData) => {
    console.log(data.message);
  };

  const askForJoin = () => {
    setIsOwnerJoined(false);
    socket?.emit("join", { roomId });
  };

  const joinContest = () => {
    // stopStreaming();
    leaveRoom(false);
    socket?.emit("startContest", { roomId, targettedUser: remoteUser?.username });
    // navigate(`/contest/live/${roomId}/${contestUser}/${remote}`);
    navigate(`/contest/live/${roomId}`);

  };

  const handleStartContest = (data: JoinStatusData) => {
    // stopStreaming();
    leaveRoom(false);
    setToast(data.message);
    // navigate(`/contest/live/${roomId}/${contestUser}/${remote}`);
    navigate(`/contest/live/${roomId}`);
  };

  const allowUser = (username: string) => {
    console.log(username);
    socket?.emit("allowUser", { targettedUser: username, roomId });
    setPendingUsers([]);
  };

  const rejectUser = (username: string) => {
    socket?.emit("rejectUser", { username, roomId });
    setPendingUsers([]);
  };

  return (
    <section className="min-h-full">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 h-f">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="lg:col-span-3 lg:py-12">
            <AgreementPage />
          </div>
          <div className="rounded-lg bg-white dark:bg-gray-900 shadow-lg lg:col-span-2 flex flex-col justify-around">
            <div>
              <div className="flex justify-center">
                <VideoComponent
                  stream={localStream}
                  onToggleAudio={toggleAudio}
                  onToggleVideo={toggleVideo}
                />
              </div>
              {remoteStream && (
                <div className="flex justify-center mt-2">
                  <RemoteVideoComponent
                    stream={remoteStream}
                    onToggleAudio={toggleRemoteAudio}
                    onToggleVideo={toggleRemoteVideo}
                  />
                </div>
              )}
            </div>

            {allowedUser && allowedUser.includes(user.username) && (
              <div className="flex justify-between">
                <div className="mt-6 flex justify-start">
                  <ButtonUI
                    title="Leave"
                    handleSubmit={leaveRoom}
                    color="red"
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <ButtonUI
                    title="Start"
                    handleSubmit={joinContest}
                    color="indigo"
                  />
                </div>
              </div>
            )}
          </div>
          {isOwner && requestUser && pendingUsers.length > 0 && (
            <div className="rounded-xl border border-gray-500 bg-gray-50 w-[300px] dark:bg-gray-700 fixed top-0 right-0 p-2 z-100 text-center" role="alert">
              <h3 className="font-bold text-lg">Join Requests:</h3>
              {pendingUsers.map((username, index) => (
                <>
                  <span>
                    User <b className="text-blue-600"><i>{username}</i></b> wants to join
                  </span>
                  <div key={username + index} className="pt-2 flex justify-between gap-2 ">
                    <ButtonUI
                      title="Allow"
                      handleSubmit={() => allowUser(requestUser)}
                      color="green"
                    />
                    <ButtonUI
                      title="Reject"
                      handleSubmit={() => rejectUser(requestUser)}
                      color="red"
                    />
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
        <div>
          {isOwnerJoined && (
            <div className="rounded-xl border border-gray-500 bg-gray-50 w-[300px] dark:bg-gray-700 fixed top-0 right-0 p-2 z-100 text-center" role="alert">
              <h3 className="font-bold text-lg">Admin has been joined the meeting, ask for allow!</h3>
              <>

                <div className="pt-2 flex justify-between gap-2 ">
                  <ButtonUI
                    title="Ask"
                    handleSubmit={askForJoin}
                    color="green"
                  />
                  <ButtonUI
                    title="Cancel"
                    handleSubmit={() => setIsOwnerJoined(false)}
                    color="red"
                  />
                </div>
              </>
            </div>
          )}
        </div>
        {toast && <ToastDemo message={toast} onClose={() => setToast(null)} />}
      </div>
    </section>
  );
};

export default Meeting;