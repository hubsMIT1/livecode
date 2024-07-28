import React, { useRef, useEffect, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useSocket } from "./socketContext";
// import { debounce } from "lodash";
import { useTheme } from "./ThemeProvider";

interface CodeEditorProps {
  language: string;
  initialCode: string;
  onCodeChange: (code: string) => void;
  live?: { roomId: string; ready: boolean };
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  initialCode,
  onCodeChange,
  live,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const codeRef = useRef(initialCode);
  const remoRef = useRef(false);
  const { socket, remoteUser } = useSocket();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  useEffect(() => {
    if (socket && live?.ready) {
      const handleCodeUpdate = async (updatedCode: string) => {
        if (editorRef.current) {
          remoRef.current = true;
          // setIsRemoteUpdate(true);
          const model = editorRef.current.getModel();
          const position = editorRef.current.getPosition();

          if (model) {
            const oldValue = model.getValue();
            const newValue = updatedCode;

            // Only update if there's an actual change
            if (oldValue !== newValue) {
              const range = model.getFullModelRange();
              const edits = [
                {
                  range: range,
                  text: newValue,
                },
              ];

              model.pushEditOperations([], edits, () => null);

              // Restore cursor position
              if (position) {
                editorRef.current.setPosition(position);
                editorRef.current.revealPositionInCenter(position);
              }
            }
          }
          // editorRef.current.setValue(updatedCode)
          codeRef.current = updatedCode;
          onCodeChange(updatedCode);
          // setIsRemoteUpdate(false);
          remoRef.current = false;
        }
        // console.log("update code came");
      }; // Debounce for 100ms

      socket.on("code_update", handleCodeUpdate);

      return () => {
        socket.off("code_update");
        // handleCodeUpdate.cancel(); // Cancel any pending debounced calls
      };
    }
  }, [socket,live?.ready]);

  const emitCodeChange = (code: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      socket?.emit("code_change", {
        roomId: live?.roomId,
        code: code,
        to: remoteUser?.username,
      });
      console.log("called dounce ur own");
    }, 0);
    // }, [socket, live.roomId]);
  };

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      if (!remoRef.current) {
        const updatedCode = editor.getValue();
        codeRef.current = updatedCode;
        onCodeChange(updatedCode);
        if (live?.ready && socket) {
          emitCodeChange(updatedCode);
        }
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

export default React.memo(CodeEditor);
