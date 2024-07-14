import React, { useState, useRef, useEffect } from 'react';

// Define the Option type
interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  default?: Option | null;
  setDefault: (option: any) => void;
}

const Combobox: React.FC<ComboboxProps> = ({ options, default: defaultOption = null, setDefault }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(defaultOption);
  const [searchTerm, setSearchTerm] = useState(defaultOption ? defaultOption.label : '');
  const [showOptions, setShowOptions] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOptions = [
    ...filteredOptions,
    ...options.filter((option) => !filteredOptions.includes(option)),
  ];

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setSearchTerm(option.label);
    setDefault(option);
    setShowOptions(false);
  };

  const handleInputClick = () => {
    setShowOptions(true);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
      setShowOptions(false);
      // console.log(selectedOption)
      setSearchTerm(selectedOption ? selectedOption.label : '');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [selectedOption]);

  return (
    <div ref={comboboxRef} className="relative inline-block w-40">
      <div className="relative" onClick={handleInputClick}>
        <input
          type="text"
          className="w-full bg-gray-50 dark:bg-gray-900  px-2 py-1 pr-2 focus:border-0 hover:outline-0 text-base placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search options..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 cursor-pointer flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {showOptions && (
        <ul className="absolute z-10 w-full py-1 mt-1 no-scrollbar bg-gray-50 dark:bg-gray-900  border border-gray-500 overflow-auto text-base rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none ">
          {sortedOptions.map((option) => (
            <li
              key={option.label}
              className={`px-4 py-2 text-sm cursor-pointer ${
                filteredOptions.includes(option)
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
          {sortedOptions.length === 0 && (
            <li className="px-4 py-2 text-sm text-gray-700">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Combobox;