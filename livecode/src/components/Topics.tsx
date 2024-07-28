import React, { useEffect, useState } from "react";

import { TopicData } from "@/lib/interfaces";
import { time } from "console";
import { useLocation } from "react-router-dom";
import { serviceApiAction } from "@/lib/endUserServicesApi";
import { useRecoilState } from "recoil";
import { topicState } from "@/state/TSQState";

interface IdentificationProps {
  handleTopics: (topics: string[]) => void;
  isDrop?: true | false;
}

const Topics: React.FC<IdentificationProps> = ({
  handleTopics,
  isDrop=false,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const location = useLocation();
  const[isLoading,setIsLoading] =useState<boolean>(false);

  const [topics,setTopics] = useRecoilState(topicState);
  const {topicIds} = location.state || {};
  console.log(topicIds,"topicss")


  const {getAllTopics} = serviceApiAction();
  useEffect(()=>{
      const getTopics = async () =>{
        console.log(topics)
        if(topics.length===0){
          setIsLoading(true);
          const res = await getAllTopics(1,100);
          console.log('topic',res)
          if(res.errors){
            console.log(res?.errors?.message);
          }else{
            const data = res?.data as TopicData[];
            setTopics(data)
          }
          setIsLoading(false);
        }
      }
      if(!isLoading)
        getTopics();
    },[])
  
  useEffect(()=>{
    if(topicIds){
      const tIds = topicIds.map((topic: any) =>{ return topic?.topic_id}) || [];
      setSelectedTopics(tIds)
      console.log("editing topics",selectedTopics,tIds)
    }
  },[topicIds])

  // let selTopics: string[] = [];
  const handleTopicChange = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter((id) => id !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  useEffect(() => {
      handleTopics(selectedTopics);
  }, [selectedTopics]);

  const toggleShowAllTopics = () => {
    setShowAllTopics(!showAllTopics);
  };

  const visibleTopics = topics
    ? showAllTopics
      ? topics
      : topics?.slice(0, 8)
    : [];

  return (
    <div>
      {!isDrop &&
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-white mt-3">
        Select Topics
      </h3>
      }

      <div className="overflow-auto no-scrollbar">
       { visibleTopics.length>0 ? <ul
          className={`grid  ${isDrop ? `grid-cols-1 lg:grid-cols-2`:`grid-cols-2 lg:grid-cols-3`
          } gap-4 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
        >
          { visibleTopics?.map((topic) => (
            <li
              key={topic.topic_id}
              className="flex items-center ps-3 py-2 dark:border-gray-600"
            >
              <input
                id={`checkbox-${topic.topic_id}`}
                type="checkbox"
                value={topic.topic_id}
                checked={selectedTopics.includes(topic.topic_id)}
                onChange={() => handleTopicChange(topic.topic_id)}
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 m-1 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              />
              <label
                htmlFor={`checkbox-${topic.topic_id}`}
                className="w-full ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {topic.title}
              </label>
            </li>
          ))
        }
        </ul>
        :<button className="text-red-500 text-center"> <i>Loading...</i></button>
        }
      </div>

      {topics && topics?.length > 8 && (
        <button
          onClick={toggleShowAllTopics}
          className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-500"
        >
          {showAllTopics ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default Topics;
