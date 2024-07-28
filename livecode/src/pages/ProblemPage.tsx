import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GenericTable from '../components/GenericTable';
import { Problem, Column, filterOptions, columns, ResponseProps } from '../lib/interfaces';
import { dataStructuresTopics } from '../api/constants';
import { CircleCheckBig, CircleSlash, Ellipsis } from 'lucide-react';
import { serviceApiAction } from '../lib/endUserServicesApi';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { SelectedTopics } from '@/components/HelperComponents';

const ProblemPage: React.FC = () => {
  const { getAllQuestions } = serviceApiAction();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [problemsData, setProblemsData] = useState<Problem[] | []>([]);
  const [isLoading,setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      const res = await getAllQuestions(currentPage, itemsPerPage);
      if (res.errors) {
        console.log(res?.errors?.message);
        toast.error(res?.errors?.message,{
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        })
      }
      else {
        setProblemsData([])
        console.log(res.data);
        const data = res.data as Problem[];
        data?.map((problem:Problem,index:number)=>
        {
          data[index].topic = problem.topic?.map((topic:any)=>topic.topic);
        })
        setTotalPages(res?.totalPages || 1);
        setProblemsData(data);
      }
      setIsLoading(false);
    };

    if(!isLoading)
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
      case 'topic':
        return SelectedTopics(problem?.topic)

      // case 'solved_by':
      //   return problem.solved_by.toLocaleString();
      default:
        return problem[column.key as keyof Problem];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
      <ToastContainer />
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
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProblemPage;