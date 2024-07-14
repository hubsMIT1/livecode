import React, { useState, useRef, useEffect } from 'react';

interface Item {
  id: string;
  label: string;
}

interface MultiSelectProps {
  items: Item[];
  problemData: {
    title: string;
    slug: string;
    topic: string[];
  };
  setProblemData: React.Dispatch<React.SetStateAction<{
    title: string;
    slug: string;
    topic: string[];
    difficulty_level: ""
  }>>;
}

interface DropdownProps {
  list: Item[];
  addItem: (item: Item) => void;
  searchTerm: string;
  selectedIds: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ list, addItem, searchTerm, selectedIds }) => {
  const filteredList = list.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedIds.includes(item.id)
  );

  return (
    <div id="dropdown" className="absolute shadow top-100 bg-white dark:bg-gray-700 z-40 left-0 rounded max-h-select overflow-y-auto">
      <div className="flex flex-col w-full">
        {filteredList.map((item) => (
          <div key={item.id} 
            className="cursor-pointer w-full border-gray-100 dark:border-gray-500 rounded-t border-b hover:bg-gray-600" 
            onClick={() => addItem(item)}>
            <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-gray-300">
              <div className="w-full items-center flex">
                <div className="mx-2 leading-6">{item.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Multiselect: React.FC<MultiSelectProps> = ({ items, problemData, setProblemData }) => {
  const [dropdown, setDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const addTag = (item: Item) => {
    if (!problemData.topic.includes(item.id)) {
      setProblemData(prev => ({
        ...prev,
        topics: [...prev.topic, item.id]
      }));
    }
    setDropdown(false);
    setSearchTerm('');
    console.log("seleted topic",item,)
  };

  const removeTag = (itemId: string) => {
    setProblemData(prev => ({
      ...prev,
      topics: prev.topic.filter(id => id !== itemId)
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDropdown(true);
  };

  const selectedItems = items.filter(item => problemData.topic.includes(item.id));

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <label htmlFor="topics" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Select Topics
      </label>
      <div className="my-2 p-1 flex mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-auto flex-wrap">
          {selectedItems.map((tag) => (
            <div key={tag.id} className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full bg-teal-100 dark:bg-gray-300">
              <div className="text-xs font-normal leading-none max-w-full flex-initial">{tag.label}</div>
              <div className="flex flex-auto flex-row-reverse">
                <div onClick={() => removeTag(tag.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                    className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
            </div>
          ))}
          <div className="flex-1">
            <input 
              placeholder="Search..." 
              className="bg-transparent p-1 px-2 text-sm text-gray-700 dark:text-gray-200 outline-none h-full w-full" 
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={toggleDropdown}
            />
          </div>
        </div>
        <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-400" onClick={toggleDropdown}>
          <button className="cursor-pointer w-6 h-6 text-gray-400 outline-none focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-up w-4 h-4">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        </div>
      </div>
      {dropdown ? <Dropdown list={items} addItem={addTag} searchTerm={searchTerm} selectedIds={problemData.topic}></Dropdown> : null}
    </div>
  );
};

export default Multiselect;