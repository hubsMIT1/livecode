import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReadProblem from "@/components/ReadProblem";
import TabComponent from "@/components/Tabs";
import OneTwoComponent from "@/components/OneLeftTwoRight";
import CodeEditor from "@/components/CodeEditor";
import Combobox from "@/components/Combobox";
import { programmingLanguages } from "@/api/constants";
import CodeOutput from "@/components/CodeResult";
import TextAreaComponent from "@/components/InputTestCase";
import Avatar from "@/components/Avatar";
import { useSocket } from "@/components/socketContext";
import ButtonUI from "@/components/Button";
import DraggableAvatar from "@/components/Draggable";
import ToastDemo from "@/components/Toast";
import { JoinStatusData, Schedule, TopicRecord } from "@/lib/interfaces";
import { getContentFromGithub } from "@/lib/api";
import { serviceApiAction } from '../lib/endUserServicesApi'

const initialCode = `
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;

const defaultLang = { value: "javascript", label: "JavaScript" };

export default function Contest() {
  const { roomId, username, remote } = useParams<{
    roomId: string;
    username: string;
    remote: string;
  }>();

  useEffect(()=>{
    document.title = 'Live Contest | Livecode'
  },[])
  // const [code, setCode] = useState(initialCode);
  const [selectedLang, setSelectedLang] = useState(defaultLang);
  const [userInput, setUserInput] = useState("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStart, setChatStart] = useState(false);
  const [requestSend, setRequestSend] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [gotDisReq, setGotDisReq] = useState(false);
  const [problemDesc, setProblemDesc] = useState<string>('')
  const { getContestById, getNewRandomProblem } = serviceApiAction();
  const [allowedUser, setAllowedUser] = useState<string[] | undefined>([])

  const handleGetContest = () => {
    // find contest 

  }
  const getProblemDesc = async (path: string) => {
    const route = `${path}/problem.md`

    const desc = await getContentFromGithub(route)
    console.log("desc", desc)
    // if(!desc)
    if (desc == '404: Not Found')
      setProblemDesc("Title: " + path + '\n\n' + "DESCRIPTION NOT FOUND IN THE GITHUB PATH PLEASE WRITE IT!")
    else setProblemDesc(desc);
  }
  const navigate = useNavigate();
  const {
    socket,
    remoteUser,
    remoteStream,
    localStream,
    initializeWebRTC,
    toggleAudio,
    toggleRemoteAudio,
    toggleRemoteVideo,
    toggleVideo,
    setRoomId,
    user,
    setContestUser,
    setRemoteUser,
    leaveRoom,
  } = useSocket();

  useEffect(() => {
    console.warn("called when roomId invoke in COntest")

    async function getData(roomId: string) {
      try {
        setIsLoading(true);
        const res = await getContestById(roomId);
        if (res && res.success) {
          const { data } = res;
          console.log(res, res?.data, data)
          if (!data?.allowed_users.includes(user.username) || data?.allowed_users.length < 2) {
            navigate(`/contest/pre/${roomId}`);
            return;
          }
          if (data?.allowed_users) {
            setAllowedUser(data?.allowed_users);
            const rUser = Array.from(data?.allowed_users).find((name) => name !== user.username) || null;
            if (rUser && !remoteUser?.username) {
              remoteUser.username = rUser;
              remoteUser.status = false;
            }
            // setRemoteUser({ username: rUser, status: true })
          }

          if (data?.question_id === null) {
            const topics = data?.topic?.map((topic: any) => topic.topic?.topic_id).join(',');
            // console.log(topics);
            const res = await getNewRandomProblem({ id: roomId, topics: topics, level: data.level, allowed_users: data.allowed_users })
            if (res.success) {
              const problem = res?.problem;
              if (problem.slug) {
                getProblemDesc(problem.slug)
              }
            }
            else {
              console.log(res.errors.message)
            }
          } else {
            getProblemDesc(data?.question_id!);
          }
        }
        else {
          console.log(res?.errors)
        }
      } catch (error) {
        if (error instanceof Error)
          console.log(error.message, error)
      } finally {
        setIsLoading(false);
      }
    }
    setRoomId(roomId);

    if (roomId)
      getData(roomId)

  }, [roomId])

  // useEffect(() => {
  //   console.warn("called username or roomId socket in context")

  //   // if (username) setContestUser(username);
  //   // if (remote) setRemoteUser({ username: remote, status: true });
  //   if (roomId) {

  //   }
  // }, [ roomId, setRoomId]);

  const codeRef = useRef(initialCode);

  const handleCodeChange = useCallback((newCode: string) => {
    codeRef.current = newCode;
    console.log(newCode);
  }, []);
  // useEffect(()=>{
  //   leaveRoom(true);
  // },[roomId])


  const handlerUserInput = useCallback((input: string) => {
    setUserInput(input);
  }, []);

  const runTestCases = useCallback(async () => {
    setIsLoading(true);
    // Implement your test case logic here
    setIsLoading(false);
  }, []);

  const handleDiscussionReq = (data: JoinStatusData) => {
    setToast(data.message);
    setGotDisReq(true);
  }
  const handleAcceptedDisReq =
    async (data: JoinStatusData) => {
      console.log("handleAcceptedDisReq called", { data, roomId });
      setToast(data.message);
      try {
        if (data?.allowedUser) {
          const rUser = Array.from(data.allowedUser).find(name => name != user.username);
          remoteUser.status = true;
          remoteUser.username = rUser || '';
        }
        await initializeWebRTC(roomId!);
        setChatStart(true);

        // console.log("WebRTC initialized successfully");
        // remoteUser.status = true;
        // remoteUser.username = data.from
        // setRemoteUser(pre=>({
        //   ...pre,
        //   username:data.from,
        //   status:true
        // }));

      } catch (error) {
        console.error("Error initializing WebRTC:", error);
      }
    }

  const handleRejectedDisReq = useCallback((data: JoinStatusData) => {
    setToast(data.message);
    setTimeout(() => setRequestSend(false), 300000);
  }, []);

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log("Socket connected");
        leaveRoom(false);
        socket.emit("join", { roomId });
      };
      socket.on("connect", handleConnect);
      socket.on("discussReq", handleDiscussionReq);
      socket.on("acceptedDisReq", handleAcceptedDisReq);
      socket.on("rejectedDisReq", handleRejectedDisReq);

      return () => {
        socket.off('connect', handleConnect);
        socket.off("discussReq", handleDiscussionReq);
        socket.off("acceptedDisReq", handleAcceptedDisReq);
        socket.off("rejectedDisReq", handleRejectedDisReq);
      };
    }
  }, [socket]);

  const acceptDisReq =
    (username: string | undefined) => {
      if (username) {
        socket?.emit("acceptedDisReq", { username, roomId, peerId: remoteUser?.username, });
        setGotDisReq(false);
      }
    }
  const rejectDisReq =
    (username: string | undefined) => {
      if (username) {
        socket?.emit("rejectedDisReq", {
          username,
          roomId,
          peerId: remoteUser?.username,
        });
        setGotDisReq(false);
      }
    }
  const DiscussProblem = () => {
    const leftTime = 20; // This should probably be a state or prop
    if ((!requestSend || leftTime < 10) && socket && user?.username) {
      socket.emit("discussReq", {
        username: user.username,
        roomId: roomId,
        peerId: remoteUser?.username,
      });
      setRequestSend(true);
      setToast(
        `You can start discussion after ${leftTime} minute(s) or when peer accepts the request!`
      );
    } else {
      setToast(
        `You can start discussion after ${leftTime} or wait for peer response!`
      );
    }
  }

  const InputTab = {
    id: "input",
    title: "Input",
    icon: <></>,
    content: <TextAreaComponent handlerUserInput={handlerUserInput} />,
  };

  const ResultTab = {
    id: "result",
    title: "Result",
    icon: <></>,
    content: (
      <CodeResultComponent
        isLoading={isLoading}
        apiResponse={apiResponse}
        userInput={userInput}
      />
    ),
  };


  const ProblemDescComponent: React.FC = () => {
    // (async()=>{

    //   //  const route = 'two-sum/problem.md';
    //   // const desc = await getContentFromGithub(route)
    //   // // console.log(desc)
    //   // setProblemDesc(desc)
    // })();

    return (
      <ReadProblem problem_desc={problemDesc} />
    )
  }

  return (
    isLoading && !problemDesc ? <h1 className="text-lg flex justify-center align-center h-100">Loading question...</h1>
      : <OneTwoComponent
        Tab1={ProblemDescComponent}
        Tab2={() => (
          <>
            <EditorHeader
              selectedLang={selectedLang}
              setSelectedLang={setSelectedLang}
              DiscussProblem={DiscussProblem}
              user={user}
              remoteUser={remoteUser}
              gotDisReq={gotDisReq}
              acceptDisReq={acceptDisReq}
              rejectDisReq={rejectDisReq}
            />
            <ChatComponent
              chatStart={chatStart}
              localStream={localStream}
              remoteStream={remoteStream}
              remoteUser={remoteUser}
              toggleAudio={toggleAudio}
              toggleVideo={toggleVideo}
              toggleRemoteAudio={toggleRemoteAudio}
              toggleRemoteVideo={toggleRemoteVideo}
            />
            <CodeEditor
              language={selectedLang.value}
              initialCode={codeRef.current}
              onCodeChange={handleCodeChange}
              live={{ ready: chatStart, roomId: roomId! }}
            />
            <EditorFooter isLoading={isLoading} runTestCases={runTestCases} />
            {toast && (
              <ToastDemo message={toast} onClose={() => setToast(null)} />
            )}
          </>
        )}
        Tab3={() => <TabComponent tabs={[InputTab, ResultTab]} />}
      />

  );
}

function CodeResultComponent({ isLoading, apiResponse, userInput }:{isLoading:boolean,apiResponse:any,userInput:string}) {
  if (isLoading) return <div>Loading...</div>;
  if (!apiResponse) return <div>Run the test cases to see the results</div>;
  if (apiResponse.error) return <div>Error: {apiResponse.error}</div>;

  return (
    <CodeOutput
      title="Test Results"
      runtime={apiResponse.time || "N/A"}
      input={userInput.split("\n")}
      yourOutput={apiResponse.stdout?.split("\n") || []}
      expectedOutput={apiResponse.expected_output?.split("\n") || []}
    />
  );
}

function EditorHeader({
  selectedLang,
  setSelectedLang,
  DiscussProblem,
  user,
  remoteUser,
  gotDisReq,
  acceptDisReq,
  rejectDisReq,
}:{selectedLang:any,setSelectedLang:any}) {
  return (
    <div className="flex justify-between pr-4 mb-2">
      {gotDisReq && (
        <div className="rounded-xl border border-gray-500 bg-gray-50 w-[300px] dark:bg-gray-700 fixed top-0 right-0 p-2 z-1000 text-center" role="alert">
          <h3>Candidate has Requested for Discussion!</h3>
          <div className="pt-2 flex justify-between gap-2 ">
            <ButtonUI
              title="Allow"
              handleSubmit={() => acceptDisReq(user?.username)}
              color="green"
            />
            <ButtonUI
              title="Reject"
              handleSubmit={() => rejectDisReq(user?.username)}
              color="red"
            />
          </div>
        </div>
      )}
      <Combobox
        options={programmingLanguages}
        default={selectedLang}
        setDefault={setSelectedLang}
      />
      <ButtonUI
        title="Request To discuss"
        handleSubmit={DiscussProblem}
        color="blue"
        height={8}
      />
      <div className="flex -space-x-1 rtl:space-x-reverse">
        <Avatar {...user} />
        <Avatar {...remoteUser} />
      </div>
    </div>
  );
}

function ChatComponent({
  chatStart,
  localStream,
  remoteStream,
  toggleAudio,
  remoteUser,
  toggleVideo,
  toggleRemoteAudio,
  toggleRemoteVideo,
}) {
  if (!chatStart) return null;

  return (
    <div className="relative w-screen h-[100px] mb-10">
      <DraggableAvatar
        stream={localStream}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        isLocal={true}
      />
      {remoteStream && (
        <DraggableAvatar
          stream={remoteStream}
          onToggleAudio={toggleRemoteAudio}
          onToggleVideo={toggleRemoteVideo}
          isLocal={false}
          initialPosition={100}
          remoteStatus={remoteUser?.status}
        />
      )}
    </div>
  );
}

function EditorFooter({ isLoading, runTestCases }:{isLoading:boolean,runTestCases:()=>void}) {
  return (
    <div className="flex justify-end gap-5">
      <button
        onClick={runTestCases}
        disabled={isLoading}
        className={`mt-2 px-2 py-2 text-white rounded ${isLoading ? "bg-gray-400" : "bg-gray-500 hover:bg-gray-600"
          }`}
      >
        {isLoading ? "Running..." : "Run Test Cases"}
      </button>
      <button
        onClick={runTestCases}
        disabled={isLoading}
        className={`mt-2 px-2 py-2 text-white rounded ${isLoading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
          }`}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
