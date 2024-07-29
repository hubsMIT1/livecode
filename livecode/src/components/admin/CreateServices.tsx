import { useEffect, useState } from "react";
import LInput from "../ui/Input";
// import Multiselect from "../MultiSelectInput";
import ButtonUI from "../Button";
import { ImagePlus } from "lucide-react";
import LTextArea from "../ui/TextArea";
// import LFileInput from "../ui/FileInput";
import {  difficultyOptions } from "@/api/constants";
import DifficultySelection from '../DifficultyLevel'
import { QuestionRecord, TopicRecord } from "@/lib/interfaces";
import { serviceApiAction } from "@/lib/endUserServicesApi";
import { Slide, ToastContainer, toast } from 'react-toastify';
import ButtonSkeleton from "../ButtonSkelton";
// import { topicState } from "@/state/TSQState";
// import { useRecoilState } from "recoil";
import Topics from "../Topics";

const CreateTSP: React.FC = () => {
  const { createQuestion, createTopic } = serviceApiAction()
  // const [topics,setTopics] = useRecoilState(topicState);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    topic: "",
    sheet: "",
    problemTitle: "",
    password: "",
    image: "",
  });
  const [problemData, setProblemData] = useState<QuestionRecord>({
    title: "",
    slug: "",
    topic: [],
    difficulty_level: ""
  });
  const [topic, setTopic] = useState<TopicRecord>({
    title: "",
    description: "",
    image: undefined,
  });
  const [sheet, setSheet] = useState<TopicRecord>({
    title: "",
    description: "",
    image: undefined,
  });

  // useEffect(()=>{
  //   const getTopics = async () =>{
  //     console.log(topics)
  //     if(topics.length===0){
  //       const res = await getAllTopics(1,100);
  //       if(res.success){
  //         // setTopics()
  //         // console.log(res.data?.data)
  //         console.log(res?.data);
  //         setTopics(res?.data?.data!)
  //       }
  //       console.log(res)
  //     }
  //   }
  //   getTopics();
  // },[])

  const handleProblemData = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e)
    let { name, value } = e.target;
    if(name==='level'){
      name = 'difficulty_level';
    }
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setProblemData(prev => ({
        ...prev,
        title: value,
        slug: slug
      }));
    } else {
      setProblemData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  useEffect(()=>{
    console.log(problemData)
  },[problemData])

  const handleTopicData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTopic((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSheetData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSheet((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleTopics = (topics: string[]) => {
    console.log(topics);
    setProblemData(prevRecord => ({
        ...prevRecord,
        topic: topics
    }));
};

  type SubmitData =
    | { type: 'question', data: QuestionRecord }
    | { type: 'topic', data: TopicRecord }
    | { type: 'sheet', data: TopicRecord }

  const handleSubmitData = async (submitData: SubmitData) => {
    if (submitData.type === 'topic') {
      // Handle topic data
      console.log('Handling topic:', submitData.data);
      if (submitData.data.description.trim() && submitData.data.title.trim()) {
        setIsLoading(true)
        const res = await createTopic(submitData.data);
        if (res.success) {
          console.log(res);

          toast.success('Topic added successfully', {
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
        else {
          console.log(res)
          if(res?.errors?.status==500)
            setErrors(prev => ({
              ...prev,
              topic:"Enter the unique title"
            }));

          toast.error(res.errors?.message || 'Error, while creating topic!', {
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
    } else if (submitData.type === 'sheet') {
      // Handle question data
      console.log('Handling sheet:', submitData.data);

    }
    else if (submitData.type === 'question') {
      console.log('Handling question:', submitData.data);

      const data: QuestionRecord = submitData.data;
      if (data.difficulty_level.trim() && data.title.trim() && data.slug.trim() && data.topic.length > 0) {
        setIsLoading(true)
        const res = await createQuestion(data);
        if (res.success) {
          console.log(res);

          toast.success('Question added successfully', {
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
        else {
          console.log(res)
          toast.error(res.errors?.message || 'Error, while creating problem!', {
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

      }else {
        toast.warn('fill the data properly!', {
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

    }
  }
  return (
    <div className="flex lg:flex-row flex-col m-4 gap-10">
      <ToastContainer />
      <div className="flex flex-col lg:w-1/2 w-full border-r-1 py-4 gap-5">
        <div className="flex flex-col gap-5">
          <h1 className="text-center"> Topics </h1>
          <LInput
            label="Title"
            name="title"
            type="text"
            handleChange={handleTopicData}
            value={topic.title}
            errors={errors}
            Icon={ImagePlus}
            handleIcon={() => { }}
          />
          <LTextArea
            value={topic.description}
            handleChange={handleTopicData}
            name="description"
            label="Description"
          />
          <LInput
            label="Media | images"
            name="image"
            type="file"
            handleChange={handleTopicData}
            value={topic.image}
            errors={errors}
          />
          <div className="flex justify-end mt-5">
            {/* <></> */}
            {!isLoading ? (
              <ButtonUI title="Add Topic" handleSubmit={() => { handleSubmitData({ data: topic, type: 'topic' }) }} />

            ) : (
              // <div className="w-auto">
              <ButtonSkeleton title="Adding..." />
              // </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="text-center"> Sheets </h1>
          <LInput
            label="Title"
            name="title"
            type="text"
            handleChange={handleSheetData}
            value={sheet.title}
            errors={errors}
            Icon={ImagePlus}
            handleIcon={() => { }}
          />

          <LTextArea
            value={sheet.description}
            handleChange={handleSheetData}
            name="description"
            label="Description"
          />
          <LInput
            label="Media(images)"
            name="image"
            type="file"
            handleChange={handleSheetData}
            value={sheet.image}
            errors={errors}
          />

          <div className="flex justify-end mt-5">
            {/* <></> */}
            <ButtonUI title="Add Sheet" handleSubmit={() => { handleSubmitData({ data: sheet, type: 'sheet' }) }} />
          </div>
        </div>
      </div>
      <div className="flex flex-col py-4 gap-5 lg:w-1/2">
        <h1 className="text-center"> Create Problems </h1>
        <div className="flex flex-col gap-5">
          <LInput
            label="Title"
            name="title"
            type="text"
            handleChange={handleProblemData}
            value={problemData.title}
            errors={errors}
          />
          <LInput
            label="Slug | problem path"
            name="slug"
            type="text"
            handleChange={handleProblemData}
            value={problemData.slug}
            errors={errors}
          />
          <div>
            <label
              htmlFor="difficulty_level"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Difficulty Level
            </label>
            <DifficultySelection isLabel={true} options={difficultyOptions} handleDifficultyLevel={handleProblemData} />
            <div className=" mt-6 flex justify-end"></div>
          </div>
          {/* <Multiselect
            items={dataStructuresTopics}
            problemData={problemData}
            setProblemData={setProblemData}
          /> */}
           <Topics handleTopics={handleTopics}/>
          <div className="flex justify-end">
            {/* <></> */}
            {/* <></> */}
            {!isLoading ? (
              <ButtonUI title="Add Problem" handleSubmit={() => { handleSubmitData({ type: 'question', data: problemData }) }} />

            ) : (
              // <div className="w-auto">
              <ButtonSkeleton title="Adding..." />
              // </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateTSP;
