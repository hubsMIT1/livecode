import React, { useRef, useEffect, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// import { debounce } from "lodash";
import { useTheme } from "./ThemeProvider";

interface CodeEditorProps {
  language: string;
  initialCode: string;
  onCodeChange: (code: string) => void;
}

const ProblemSolveEditor: React.FC<CodeEditorProps> = ({
  language,
  initialCode,
  onCodeChange,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const codeRef = useRef(initialCode);
  const remoRef = useRef(false);
  const { theme } = useTheme();

  const getEditorTheme = useCallback((currentTheme: string | undefined) => {
    return currentTheme === "dark" ? "vs-dark" : "light";
  }, []);
  
  const [editorTheme, setEditorTheme] = useState(getEditorTheme(theme));
  useEffect(() => {
    setEditorTheme(getEditorTheme(theme));
  }, [theme, getEditorTheme]);

  useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setTheme(editorTheme);
    }
  }, [editorTheme]);



  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      if (!remoRef.current) {
        const updatedCode = editor.getValue();
        codeRef.current = updatedCode;
        onCodeChange(updatedCode);
      }
    });
  };

  return (
    <div className="relative">
      <Editor
        height="500px"
        language={language}
        value={codeRef.current}
        onMount={handleEditorDidMount}
        options={{
          readOnly: false,
          minimap: { enabled: false },
          scrollbar: {
            vertical: "hidden",
            alwaysConsumeMouseWheel: false,
          },
        }}
        theme={editorTheme}
        className="overflow-hidden p-0 bg-gray-50 dark:bg-gray-900"
      />
    </div>
  );
};

export default React.memo(ProblemSolveEditor);
