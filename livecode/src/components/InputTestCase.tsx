// import { StoreIcon } from 'lucide-react';
import React,{useState} from 'react';
// import { Dispatch, SetStateAction } from "react";
interface InputType{
    handlerUserInput:(input: string) => void;
}

const TextAreaComponent: React.FC<InputType> = ({handlerUserInput}) => {
  const [content, setContent] = useState<string>('');
//   const [storedInput, setStoredInput] = useState<string[]>([]);
//   const [x, setX] = useState<number>(5);
//   const [testInput,setTestInput] = useState<string>('')
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(event.target.value);
      const newValue = event.target.value
      handlerUserInput(newValue)
//     // const lastChar = newValue.charAt(newValue.length - 1);

//     // Check if the last character is not a space or just an empty new line
//     // if (lastChar !== ' ' && lastChar !== '\n') {
//     //     setTestInput(testInput+lastChar);
//     // }
//     // const lines = newValue.split('\n');
//     // setStoredInput(lines);
//     // console.log(lines,storedInput)
  };

//   const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if (event.key === 'Enter') {
    //     const lines = content.split('\n');
    //     // console.log(lines)
    //     const len = lines.length;
    //     storedInput

    //     // const testLen = testInput.length;
    //     // lastInput = testInput[testLen-1];
    //     // console.log("test inp len",testLen);
    //     const inputLen = storedInput.length-1;

    //     const newStoredInput: string[]  =[];
    //     console.log(storedInput);
    //     if( ( len>1 && ((len)%x) ==0 ) || (x===1)){
              
    //         newStoredInput.push(lastInput);
    //         setStoredInput([...storedInput,newStoredInput]);
    //         console.log("new line");
    //     }
    //     else {
    //         const addInput = storedInput;
    //         if(inputLen>=0){
    //             addInput[inputLen].push(lastInput);
    //             // setStoredInput(addInput)
    //         }
    //         else{
    //             addInput.push([lastInput]);
    //         }
    //         setStoredInput([...addInput]);
    //         console.log(addInput)

    //     }
    //     console.log(testInput)
    //     console.log(storedInput)
    //   }
//   };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full min-h-2">
      <textarea
        rows={6}
        className="block no-scrollbar p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
        placeholder="Enter your test cases..."
        value={content}
        onChange={handleChange}
      ></textarea>
        {/* <textarea
          className="w-full p-2 text-lg text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-blue-600 resize-none"
          rows={8}
          placeholder="Enter your test cases..."
          value={content}
          onChange={handleChange}
        //   onKeyPress={handleKeyPress}
        /> */}
      </div>
      {/* <div className="mt-4">
        <pre className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm whitespace-pre-wrap">
          {JSON.stringify(storedInput, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default TextAreaComponent;