import React from 'react';

interface CodeOutputProps {
  title: string;
  runtime: string;
  input: string[];
  yourOutput: string[];
  expectedOutput: string[];
}

const CodeOutput: React.FC<CodeOutputProps> = ({
  title,
  runtime,
  input,
  yourOutput,
  expectedOutput,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="mb-4">
        <span className="text-gray-600">Runtime:</span> {runtime}
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Input:</h3>
        {input.map((item, index) => (
          <CodeBlock key={index} code={item} />
        ))}
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Your Output:</h3>
        {yourOutput.map((item, index) => (
          <CodeBlock key={index} code={item} />
        ))}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Expected Output:</h3>
        {expectedOutput.map((item, index) => (
          <CodeBlock key={index} code={item} />
        ))}
      </div>
    </div>
  );
};

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  return (
    <pre className="bg-gray-100 rounded-md p-4 overflow-auto mb-4">
      <code>{code}</code>
    </pre>
  );
};

export default CodeOutput;