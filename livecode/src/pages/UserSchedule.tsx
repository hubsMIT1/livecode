import React, { useEffect, useState } from "react";
import GenericTable from "../components/GenericTable";
import {
  Column,
  ScheduleSession,
  scheduleColumns,
  scheduleFilterOptions,
  Schedule,
  ResponseProps,
  TopicRecord,
  TopicData,
  Topic
} from "../lib/interfaces";
import { dummyScheduleData, user1, user2 } from "../api/constants";
import Avatar from "../components/Avatar";
import { Link } from "react-router-dom";
import Topics from "@/components/Topics";
import DropdownMenu from "@/components/DropMenu";
// import { formatDate, isNearSchedule, getAction } from '../lib/utils'; // Assume you've moved these functions to a utils file
import { serviceApiAction } from '@/lib/endUserServicesApi'
import { Copy } from "lucide-react";
const SchedulePage: React.FC = () => {
  const [userSchedulesData, setUserSchedulesData] = useState<Schedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { getAllContest } = serviceApiAction();

  const [topicIds, setTopicIds] = useState<Record<string, string[]>>({});
  useEffect(()=>{
    document.title = 'Your Contest | Livecode'
  },[])
  const getUserSchedules = async (page: number, limit: number) => {
    const res = await getAllContest(page, limit);
    if (res.success) {
      const data = res?.data?.data;
      // const topic = data?.map(schedule=>schedule?.map(topic=>topic.title)
      const newTopicIds: Record<string, string[]> = {};
      data?.map((schedule: Schedule, index: number) => {
        if (schedule.topic) {
          console.log(schedule.topic)
          const topics = schedule.topic;
          data[index].topic = schedule.topic?.map((topic: any) => topic.topic);
          console.log(data[index].topic)
          // const tIds = topics.map((topic: any) => topic.topic?.topic_id);
          // newTopicIds[index.toString()] = tIds;
        }
      })
      // console.log(newTopicIds)
      // setTopicIds(newTopicIds);
      setUserSchedulesData(res?.data?.data as Schedule[]);
      setTotalPages(res.totalPages || 1);
    }
    console.log(res, topicIds);
  };

  useEffect(() => {
    getUserSchedules(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const dt = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <span className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700">
        {dt}
      </span>
    );
  };

  type ScheduleSession = {
    time: string;
    joinLink: string;
    status: "live" | "completed" | "absent" | "pause" | "incoming";
    joinlink: string;
    action: string[];
    selectedTopics: string[];
  };

  const statusStyles = {
    live: "bg-purple-100 text-purple-700",
    completed: "bg-emerald-100 text-emerald-700",
    absent: "bg-red-100 text-red-700",
    pause: "bg-amber-100 text-amber-700",
    upcoming: "bg-gray-100 text-gray-700",
    incoming: "bg-gray-100 text-gray-700"


  };



  const isNearSchedule = (scheduleTime: string) => {
    const scheduleDate = new Date(scheduleTime);
    const now = new Date();
    const tenMinutesInMillis = 10 * 60 * 1000;

    return (
      Math.abs(scheduleDate.getTime() - now.getTime()) <= tenMinutesInMillis
    );
  };
  const getStatus = (schedule: Schedule) => {
    const scheduleDate = new Date(schedule.start_time);
    const now = new Date();
    if (scheduleDate < now) {
      if (schedule?.status == 'upcoming' || schedule?.status == 'Incomplete')
        schedule.status = 'absent';
    }
    const statusClass = statusStyles[schedule.status];

    return (
      <div
        className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 ${statusClass}`}
      >
        <span className="text-sm">{schedule.status || 'incoming'}</span>
      </div>
    );
  };

  const getAction = (schedule: Schedule, column: Column) => {
    const scheduleDate = new Date(schedule.start_time);
    const now = new Date();

    if (
      isNearSchedule(schedule.start_time) ||
      schedule.status == "pause" ||
      schedule.status === "live"
    ) {
      return (
        <a
          href={`contest/pre/${schedule.schedule_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block text-blue-600 hover:text-blue-800 bg-blue-100 border-b-4 border-blue-600 hover:bg-blue-200 p-2 rounded-md"
        >
          Join
          <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 animate-pulse"></span>
        </a>
      );
    } else if (scheduleDate > now) {
      return (
        <>

        <button className="text-yellow-600 hover:text-yellow-800 bg-yellow-100 hover:bg-yellow-200 p-2 rounded-md">
          <Link
            to={`/schedule-contest?id=${schedule.schedule_id}&edit=1`}
            state={{
              start_time: schedule.start_time,
              topicIds: schedule.topic,
              level: schedule.level,
              id:schedule.schedule_id
            }}

          >
            Reschedule
          </Link>
        </button>
            <div
          className={`inline-flex items-center px-2 justify-center cursor-pointer hover:scale-105 transition-all duration-100 text-blue-500 hover:scale-105 active:text-green-900 
                 transition-all duration-300`}
          onClick={() => {navigator.clipboard.writeText(`http://localhost:5174/contest/pre/${schedule.schedule_id}`)}}
          title="join link"
        >
          <Copy />
        </div>
        </>
      );
    } else if (
      schedule.status === "completed"
    ) {
      // schedule.status = "absent";
      return (
        // <Link
        //   to={schedule.join_link || `contest/pre/${schedule.schedule_id}`}
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   className="text-gray-600 hover:text-gray-800"
        // >
        //   Join link
        // </Link>
        <div
          className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 ${statusStyles['completed']}`}
        >
          <span className="text-sm">{schedule.status || 'Completed'}</span>
        </div>
      );
    }
    else {
      return (<div
        className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 ${statusStyles['absent']}`}
      >
        <span className="text-sm">{schedule.status || 'Absent'}</span>
      </div>)
    }
  };

  const getUsers = (allowed_users: string[]) => {
    return (
      <div className="flex -space-x-1 rtl:space-x-reverse">
        <Avatar username={allowed_users[0]} />
        {allowed_users.length > 1 ? <Avatar username={allowed_users[1]} /> : ''}
      </div>
    );
  };

  const SelectedTopics = (selectedTopics) => {
    const maxTopicsToShow = 2; // Maximum number of topics to display without tooltip

    if (selectedTopics.length <= maxTopicsToShow) {
      // If there are 2 or fewer topics, display all of them
      return (
        <div className="flex">
          {selectedTopics.map((item, index) => (
            <p key={index}>{item.title},</p>
          ))}
        </div>
      );
    } else {
      // If there are more than 2 topics, display the first two followed by "..."
      const displayedTopics = selectedTopics.slice(0, maxTopicsToShow);
      return (
        <div className="flex" title={selectedTopics}>
          {displayedTopics.map((item, index) => (
            <p key={index}>{item},</p>
          ))}
          <p key="more">...</p>
        </div>
      );
    }
  };

  const renderCell = (schedule: Schedule, column: Column) => {
    switch (column.key) {
      case "start_time":
        return formatDate(schedule.start_time);
      case "status":
        return getStatus(schedule);
      case "allowed_users":
        return getUsers(schedule.allowed_users);
      case "join_link":
        return getAction(schedule, column);
      case "topic":
        return SelectedTopics(schedule.topic);
      case "feedback":
        return schedule.feedback ? (
          <Link
            to={`contest/feedback/${schedule.feedback[0].feedback_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800"
          >
            Give Feedback
          </Link>
        ) : null;
      // case "details":
      //   return (
      //     <Link
      //       to={`/schedule/${schedule.schedule_id}`}
      //       className="text-purple-600 hover:text-purple-800"
      //     >
      //       View Details
      //     </Link>
      //   );
      default:
        return schedule[column.key as keyof Schedule];
    }
  };

  const getRowClassName = (schedule: Schedule) =>
    isNearSchedule(schedule.start_time) ? "border-l-4 border-l-red-500" : "";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <GenericTable<Schedule>
        initialData={userSchedulesData}
        columns={scheduleColumns}
        filterOptions={scheduleFilterOptions}
        renderCell={renderCell}
        getRowClassName={getRowClassName}
        searchFields={["details"]}
        filterField="status"
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SchedulePage;

// // components/ScheduleTable.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ScheduleSession, scheduleColumns, Column } from '../lib/interfaces';
// import Avatar from './Avatar';
// import { user1, user2 } from '@/api/constants';
// // import { dummyScheduleData } from '../api/constants';

// interface ScheduleTableProps {
//   schedules: ScheduleSession[];
// }

// const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules }) => {
//   const formatDate = (isoString: string) => {
//     const date = new Date(isoString);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const isNearSchedule = (scheduleTime: string) => {
//     const now = new Date();
//     const scheduleDate = new Date(scheduleTime);
//     const diffMinutes = Math.abs(scheduleDate.getTime() - now.getTime()) / 60000;
//     return diffMinutes <= 10;
//   };

//   const getAction = (schedule: ScheduleSession) => {
//     const scheduleDate = new Date(schedule.time);
//     const now = new Date();
//     if (isNearSchedule(schedule.time)) {
//       return (
//         <a href={schedule.joinLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
//           Join
//         </a>
//       );
//     } else if (scheduleDate > now) {
//       return <button className="text-yellow-600 hover:text-yellow-800">Reschedule</button>;
//     }
//     return null;
//   };
//   const getUsers= ()=>{
//     return (
//       <div className="flex -space-x-1 rtl:space-x-reverse">
//       <Avatar {...user1} />
//       <Avatar {...user2} />
//      </div>
//     )
//   }

//   const renderCell = (schedule: ScheduleSession, column: Column) => {
//     switch (column.key) {
//       case 'time':
//         return formatDate(schedule.time);
//       case 'participants':
//         return getUsers(); // Replace with avatar component
//       case 'action':
//         return getAction(schedule);
//       case 'joinLink':
//         return isNearSchedule(schedule.time) ? (
//           <Link to={schedule.joinLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
//             Join Meeting
//           </Link>
//         ) : <Link to={`schedule-contest/${schedule.id}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-800">
//         Reschedule
//       </Link>;
//       case 'feedback':
//         return schedule.feedback ? (
//           <a href={schedule.feedback} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
//             Give Feedback
//           </a>
//         ) : null;
//       case 'details':
//         return (
//           <Link to={`/schedule/${schedule.id}`} className="text-purple-600 hover:text-purple-800">
//             View Details
//           </Link>
//         );
//       default:
//         return schedule[column.key as keyof ScheduleSession];
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//           <tr>
//             {scheduleColumns.map((column) => (
//               <th key={column.key} scope="col" className="px-6 py-3">
//                 {column.header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {schedules.map((schedule) => (
//             <tr
//               key={schedule.id}
//               className={`border-b dark:border-gray-700 ${
//                 isNearSchedule(schedule.time) ? 'border-l-4 border-l-red-500' : ''
//               }`}
//             >
//               {scheduleColumns.map((column) => (
//                 <td key={`${schedule.id}-${column.key}`} className="px-6 py-4">
//                   {renderCell(schedule, column)}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ScheduleTable;

// App.tsx or wherever you want to render the schedule
