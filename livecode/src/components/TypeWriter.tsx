import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
  size:string
}

const Typewriter: React.FC<TypewriterProps> = ({ words,size }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [currentText, setCurrentText] = useState('');

  // Array of Tailwind color classes
  const colors = [
    'text-blue-500',
    'text-green-500',
    'text-red-500',
    'text-yellow-500',
    'text-purple-500',
  ];

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
      setCurrentText(words[index].substring(0, subIndex));
    }, Math.max(reverse ? 75 : 150, parseInt((Math.random() * 350).toString())));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className={`${size} ${words.length > 1 ? colors[index % colors.length] : ''}`}>
        {currentText}
      </h1>
    </div>
  );
};

export default Typewriter;