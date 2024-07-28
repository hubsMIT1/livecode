import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReadProblem from "@/components/ReadProblem";
import TabComponent from "@/components/Tabs";
import OneTwoComponent from "@/components/OneLeftTwoRight";
import Combobox from "@/components/Combobox";
import { programmingLanguages } from "@/api/constants";
import CodeOutput from "@/components/CodeResult";
import TextAreaComponent from "@/components/InputTestCase";
import ToastDemo from "@/components/Toast";
import { getContentFromGithub } from "@/lib/api";
import { serviceApiAction } from '../lib/endUserServicesApi';
import ProblemSolveEditor from '@/components/SolveProblemEditor'

const initialCode = `
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;

const defaultLang = { value: "javascript", label: "JavaScript" };

export default function SolveProblem() {
  const { slug, } = useParams<{
    slug:string
  }>();

  useEffect(()=>{
    document.title = 'Live Contest | Livecode'
  },[])
  // const [code, setCode] = useState(initialCode);
  const [selectedLang, setSelectedLang] = useState(defaultLang);
  const [userInput, setUserInput] = useState("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [problemDesc, setProblemDesc] = useState<string>('')
  const {getQuestionBySlug} = serviceApiAction();
  const handleGetContest = () => {
    // find contest 

  }
  const getProblemDesc = async (path: string) => {
    const route = `${path}/problem.md`

    const desc = await getContentFromGithub(route)
    console.log("desc", desc)
    // if(!desc)
    if (desc == '404: Not Found')
      setProblemDesc("Title: " + path + '\n\n' + "DESCRIPTION and INSTRUCTION stil have to enter for some of the problem!")
    else setProblemDesc(desc);
  }
  const navigate = useNavigate();


  useEffect(() => {
    // console.warn("called username or roomId socket in context")
    if (slug) {
      getProblemDesc(slug);
    }
  }, [slug]);

  const codeRef = useRef(initialCode);

  const handleCodeChange = useCallback((newCode: string) => {
    codeRef.current = newCode;
    console.log(newCode);
  }, []);
  // useEffect(()=>{
  //   leaveRoom(true);
  // },[roomId])


  const handlerUserInput = useCallback((input: string) => {
    console.log(input)
    // setUserInput(input);
  }, []);

  const runTestCases = useCallback(async () => {
    setIsLoading(true);
    // Implement your test case logic here
    setIsLoading(false);
  }, []);

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
            />
            <ProblemSolveEditor
              language={selectedLang.value}
              initialCode={codeRef.current}
              onCodeChange={handleCodeChange}
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
  if (!apiResponse) return <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 overflow-auto mb-4"><code> Run the test cases to see the results </code></div>;
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
}:{selectedLang:any,setSelectedLang:any}) {
  return (
    <div className="flex justify-between pr-4 mb-2">

      <Combobox
        options={programmingLanguages}
        default={selectedLang}
        setDefault={setSelectedLang}
      />
      
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
