import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GenericTable from '../components/GenericTable';
import { Problem, Column, filterOptions, columns } from '../lib/interfaces';
import { dataStructuresTopics } from '../api/constants';
import { CircleCheckBig, CircleSlash, Ellipsis } from 'lucide-react';
import { serviceApiAction } from '../lib/endUserServicesApi';

const ProblemPage: React.FC = () => {
  const { getAllQuestions } = serviceApiAction();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [problemsData, setProblemsData] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const res = await getAllQuestions(currentPage, itemsPerPage);
      if (res.success) {
        setProblemsData(res?.data.data);
        console.log(res.data.data)
        setTotalPages(res.totalPages || 1);
      }
    };
    fetchProblems();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const renderCell = (problem: Problem, column: Column) => {
    switch (column.key) {
      // case 'status':
      //   return (
      //     <div className="flex justify-center" title={problem.status}>
      //       {problem.status === "Attempted" && <CircleSlash color='yellow' />}
      //       {problem.status === "Solved" && <CircleCheckBig color='green' />}
      //       {problem.status === "Todo" && <Ellipsis color='black' />}
      //     </div>
      //   );
      case 'title':
        return (
          <Link to={`/problems/${problem.slug}`} className="text-blue-600 hover:text-blue-800">
            {problem.title}
          </Link>
        );
      case 'difficulty_level':
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
            ${problem.difficulty_level === 'Easy' ? 'bg-green-100 text-green-800' :
              problem.difficulty_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'}`}>
            {problem.difficulty_level}
          </span>
        );
      case 'average_time_to_solve':
        return `${problem.average_time_to_solve}`;
      // case 'solved_by':
      //   return problem.solved_by.toLocaleString();
      default:
        return problem[column.key as keyof Problem];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
      <div className="max-w-7xl mx-auto">
        <GenericTable<Problem>
          initialData={problemsData}
          columns={columns}
          filterOptions={filterOptions}
          renderCell={renderCell}
          searchFields={['title']}
          filterField="difficulty_level"
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          topicDrop={true}
          topicDropItem={dataStructuresTopics}
        />
      </div>
    </div>
  );
};

export default ProblemPage;