import React, { useState, useEffect,useRef } from 'react';
import Topics from './Topics';
import { dataStructuresTopics } from '@/api/constants';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  items?: MenuItem[];
  isTopic:true | false;
  title?:string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items,isTopic,title="Topics" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (item:MenuItem) => {
    item.onClick(item.label);
    console.log('Selected item:', onClick.toString());
    setIsOpen(false);
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  const handleTopics = (topics: string[]) => {
    console.log(topics);
    // setScheduleRecord(prevRecord => ({
    //     ...prevRecord,
    //     topics: topics
    // }));
};

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex justify-end overflow-visible items-center rounded-md border bg-white">
          <p 
          onClick={() => setIsOpen(!isOpen)}
          className="border-e px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700"
        >
         {title}
        </p>
        <button
          className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {
      isOpen && (
        <div
          className="absolute end-0 z-10 mt-2 w-60 p-3 overflow-auto no-scrollbar max-h-[400px] divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
          role="menu"
        >
          { isTopic?
            <Topics topics={dataStructuresTopics} handleTopics={handleTopics} isDrop={true}/>
            : (<div
            className="absolute end-0 z-10 mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
            role="menu"
          >
            <ul className="p-2">
              {items.map((item,index)=>(
              <li
                key={item+index}
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
                {item}
              </li>
              ))}
           </ul>
           </div>)
          }
        </div>
      )}
      </div>)}


export default DropdownMenu;