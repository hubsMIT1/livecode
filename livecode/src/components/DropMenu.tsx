import React, { useState, useEffect,useRef } from 'react';
import Topics from './Topics';
import { dataStructuresTopics } from '@/api/constants';
import { TopicData } from '@/lib/interfaces';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  items?: TopicData[];
  isTopic?:true | false;
  title?:string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items,isTopic,title="Topics" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (item:MenuItem) => {
    item.onClick();
    console.log('Selected item:', item.toString());
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
      <button className="flex justify-end overflow-visible py-2 px-4 items-center rounded-md text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "
        onClick={() => setIsOpen(!isOpen)}
        type='button'
        >
         {title}
        
          <span className="sr-only">Menu</span>
          <svg className={`-mr-1 ml-1.5 w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
      {
      isOpen && (
       
          <div className="absolute w-40 md:w-80 md:end-0 z-10 overflow-auto no-scrollbar max-h-[400px]  rounded-md shadow-lg dark:bg-gray-700 bg-white"
          role="menu">
          { isTopic?
            <Topics handleTopics={handleTopics} isDrop={true}/>
  
            : 
            <ul className="p-2 grid grid-col-2">
              {items?.map((item,index)=>(
              <li
                key={item?.title+index}
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full"
                role="menuitem"
              >
                {item.title}
              </li>
              ))}
           </ul>
          }
          </div>
      )}
      </div>)}


export default DropdownMenu;