import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ColorOption {
  id: string;
  label: string;
  color:string
}

interface ColorSelectionProps {
  options: ColorOption[];
  handleDifficultyLevel:any;
  isLabel?:boolean
}

const DifficultySection: React.FC<ColorSelectionProps> = ({ isLabel=false, options, handleDifficultyLevel}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const location = useLocation();
  const {level} = location.state || {}
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    // console.log("adfasdjfal;skfl;asjf")
    handleDifficultyLevel(event)
  };
  useEffect(()=>{
    setSelectedOption(level || null);
  },[level])

  return (
    <div>
      { !isLabel &&
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-white mt-3">Select Difficulty</h3> }
        
    <fieldset className="flex flex-wrap gap-10">
      <legend className="sr-only">Color</legend>
      {options.map((option) => (
        <div key={option.id}>
          <label
            htmlFor={option.id}
            style={{border:`2px solid ${option.color}`, borderRadius:'1rem'}}
            className={`flex cursor-pointer items-center justify-center rounded-lg border border-gray-100 bg-white-100 dark:bg-gray-700 px-3 py-2 dark:text-gray-300 text-gray-900 hover:border-gray-200 has-[:checked]:border-blue-500 dark:has-[:checked]:bg-gray-100 dark:has-[:checked]:text-black `}
          >
            <input
              type="radio"
              name="level"
              value={option.id}
              id={option.id}
              className="sr-only"
              checked={selectedOption === option.id}
              onChange={handleOptionChange}
            />
            <p className="text-sm font-medium">{option.label}</p>
          </label>
        </div>
      ))}
    </fieldset>
    </div>
  );
};

export default DifficultySection;