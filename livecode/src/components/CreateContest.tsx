import React,{useEffect, useState} from "react";
import EventDetails from "./SelectDateTime";
import { dataStructuresTopics, difficultyOptions, unavailableTimes } from "@/api/constants";
import Topics from "./Topics";
import DifficultySelection from "./DifficultyLevel";
import BottonUI from "./Button";
import { ScheduleRecord, TopicData, updateContestProps } from "@/lib/interfaces";
import { useRecoilState, useRecoilValue } from "recoil";
import { serviceApiAction } from "@/lib/endUserServicesApi";
import { Slide, ToastContainer, toast } from "react-toastify";
import ButtonSkeleton from "./ButtonSkelton";
import { useLocation, useParams } from "react-router-dom";

const TextContent: React.FC = () => {
    // const {edit,id} = useParams();
    // console.log(edit);
    const location = useLocation();
    const {id} = location.state || {};
    const initialSchedule:ScheduleRecord = {
      level:'',
      topic:[],
      start_time:0,
    }
    const [newScheduleRecord, setScheduleRecord] = useState<ScheduleRecord>(initialSchedule);
    // const [topics,setTopics] = useRecoilState(topicState);
    const [isLoading,setIsLoading] = useState(false);
    const {createContest,updateContest} = serviceApiAction();
    const [editId,setEditId] = useState<string | undefined>(undefined)

  
    // console.log(topics)
    

    const handleDifficultyLevel = (e:React.ChangeEvent<HTMLInputElement>) => {
        // console.log(level);
        const {value} = e.target;
        
        setScheduleRecord(prevRecord => ({
            ...prevRecord,
            level: value
        }));
    };

    const handleTopics = (topics: string[]) => {
        console.log(topics);
        setScheduleRecord(prevRecord => ({
            ...prevRecord,
            topic: topics
        }));
    };

    const handleSchedule = (unixDT: number) => {
        console.log(unixDT, "gootoss");
        setScheduleRecord(prevRecord => ({
            ...prevRecord,
            start_time: unixDT
        }));
    };

    const createNewSchedule = async () => {
        if((newScheduleRecord.level && newScheduleRecord.start_time > 0 && newScheduleRecord.topic.length>0) ||( id && (newScheduleRecord.level  || newScheduleRecord.start_time > 0 || newScheduleRecord.topic.length>0) )){
            console.log(newScheduleRecord);
          setIsLoading(true)
          
          let res 
          if(!id){
            res = await createContest(newScheduleRecord);
          }
          else{
            let data:updateContestProps={};
            if(newScheduleRecord.level!==''){
              data.level = newScheduleRecord.level;
            }
            if(newScheduleRecord.start_time !==0)
                data.start_time = newScheduleRecord.start_time
            if(newScheduleRecord.topic.length >0)
                data.topic = newScheduleRecord.topic

            res = await updateContest(data,id);
          }
          if(res?.success){
            toast.success('Your Contest is scheduled successfully!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Slide,
              });
              setScheduleRecord(initialSchedule)
          }
          else {
            console.log(res)
            toast.error( res?.errors?.message || 'Error, while creating contest!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Slide,
              });
          }
          setIsLoading(false);
        }
        else{
          toast.error( 'Please, fill the details properly!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Slide,
            });
            console.log('choose the details')
        }
        // Here you would typically send the newScheduleRecord to your backend or perform some action
    };

  return (
    <section className="min-h-full">
      <ToastContainer />
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 h-f">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:py-12">
            <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
              Create New Contest Schedule
            </h1>

            <p className="mx-auto mt-4 max-w-md text-center text-gray-500 dark:text-gray-300">
              Process how the contest work and what time you can choose while creating....
            </p>
          </div>

          <div className="rounded-lg bg-white dark:bg-gray-900 p-8 shadow-lg lg:col-span-3 lg:p-12">
            {/* Add your form or additional content here */}
            <EventDetails unavailableTimes={unavailableTimes} handleSchedule={handleSchedule} />
            <div className=" mt-6 border-t"></div>
            <Topics handleTopics={handleTopics}/>
            <div className=" mt-6 border-t"></div>
            <DifficultySelection options={difficultyOptions} handleDifficultyLevel={handleDifficultyLevel}/>
            <div className=" mt-6 flex justify-end">
            {!isLoading ? (

            <BottonUI title={id ?` Reschedule` : `Create`} handleSubmit={createNewSchedule}/>
                ) : (
                  // <div className="w-auto">
                    <ButtonSkeleton title="Scheduling..." />
                  // </div>
            )} 

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TextContent;
