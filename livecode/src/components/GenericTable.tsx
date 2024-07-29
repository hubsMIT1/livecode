// components/GenericTable.tsx
import React, { useState, useMemo } from 'react';
import { Column, FilterOption, Topic } from '../lib/interfaces';
import Search from '@/components/Search';
import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import DropdownMenu from '@/components/DropMenu';
import ListSkeleton from './ListSkelton';

interface GenericTableProps<T> {
  initialData: T[];
  columns: Column[];
  filterOptions: FilterOption[];
  itemsPerPage?: number;
  renderCell: (item: T, column: Column) => any;
  getRowClassName?: (item: T) => string;
  searchFields?: (keyof T)[];
  filterField?: keyof T;
  topicDrop?:true|false;
  topicDropItem?:Topic[]
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading:boolean;
}

function GenericTable<T extends { question_id?: string,schedule_id?:string}>({
  initialData,
  columns,
  filterOptions,
  itemsPerPage = 10,
  renderCell,
  getRowClassName,
  searchFields = ['title' as keyof T,'question' as keyof T,'topic' as keyof T],
  filterField = 'difficulty' as keyof T,
  topicDrop,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: GenericTableProps<T>) {
  // const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  // const [isLoading,setIsLoading] = useState(false);

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const matchesSearch = searchFields.some(field => 
        String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
      );
      let matchesFilter = selectedFilters.length === 0 || 
        selectedFilters.includes(String(item[filterField]).toLowerCase());
      
      // if(filterField==='start_time'){
      //   if(selectedFilters.includes('upcoming')){
      //     matchesFilter = 
      //   }
      // }
      return matchesSearch && matchesFilter;
    });
  }, [initialData, searchTerm, selectedFilters, searchFields, filterField]);


  // const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    // const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData //.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = onPageChange;
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // setCurrentPage(1);
  };

  
  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]
    );
    // setCurrentPage(1);
  };

  return (
    <section className="p-3 sm:p-5 ">
      <div className="mx-auto max-w-screen-xl ">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            </div>
            <div className="w-full md:w-auto flex  flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter
              filterOptions={filterOptions}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
            {/* <FilterInput /> */}
             {topicDrop && <DropdownMenu isTopic={true} />}
              {/* <DropdownMenu items={menuItems} /> */}

            </div>
          </div>
          </div>
          <div className={`overflow-x-auto ${!isLoading ? `min-h-[200px]` : ``}`}>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} scope="col" className="px-4 py-3">{column.header}</th>
                  ))}
                </tr>
              </thead>
               
              <tbody>

               { paginatedData.map((item) => (
                  <tr key={item?.question_id || item.schedule_id} className={`border-b dark:border-gray-700 ${getRowClassName ? getRowClassName(item) : ''}`}>
                    {columns.map((column) => (
                      <td key={`${item?.question_id || item.schedule_id}-${column.key}`} className="px-4 py-3">
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </tr>
                ))
              }
              </tbody>

            </table>

          </div>
          {
                isLoading ?
                <ListSkeleton /> :
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
}
        </div>
      </div>
    </section>
  );
}

export default GenericTable;




