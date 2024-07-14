import Alert from '@/components/Alert';
import React, { useEffect, useState } from 'react';

interface FeedbackFormData {
  problemSolvingRating: number;
  codingRating: number;
  communicationRating: number;
  peerStrengths: string;
  areasForImprovement: string;
  interviewerRating: number;
  topicRating: number;
}

const FeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    problemSolvingRating: 0,
    codingRating: 0,
    communicationRating: 0,
    peerStrengths: '',
    areasForImprovement: '',
    interviewerRating: 0,
    topicRating: 0,
  });

  useEffect(()=>{
    document.title = 'Feedback | Livecode'
  },[])
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      console.log(data);
      // Reset the form after successful submission
      form.reset();
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div>
       {showAlert && (
        <Alert
          title="Error"
          message="Please fill in all required fields."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          }
        />
      )}
     <section className="bg-white">
  <div className="">
    <section className="relative flex h-32 items-end bg-gray-900  xl:col-span-6">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />

      <div className="hidden">
        <a className="block text-white" href="#">
          <span className="sr-only">Home</span>
          <svg
            className="h-8 sm:h-10"
            viewBox="0 0 28 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG path */}
          </svg>
        </a>

        <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Feedback Form
        </h2>

        <p className="mt-4 leading-relaxed text-white/90">
          Please provide your valuable feedback to help improve the interview process.
        </p>
      </div>
    </section>

    <main className="flex items-center justify-center px-8 py-8 sm:px-12 ">
      <div className="">
        <div className="relative -mt-16 block">
          
           <a className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
            href="#"
          >
            <span className="sr-only">Home</span>
            <svg
              className="h-8 sm:h-10"
              viewBox="0 0 28 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG path */}
            </svg>
          </a>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Feedback Form
          </h1>

          <p className="mt-4 leading-relaxed text-gray-500">
            Please provide your valuable feedback to help improve the interview process.
          </p>
        </div>

        <form action="#" className="mt-8 grid grid-cols-6 gap-6" onSubmit={handleSubmit}>
          <div className="col-span-6">
            <label htmlFor="ProblemSolvingRating" className="block text-sm font-medium text-gray-700">
              Problem Solving Rating
            </label>

            <input
              type="number"
              id="ProblemSolvingRating"
              name="problem_solving_rating"
              min="1"
              max="5"
              required
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="CodingRating" className="block text-sm font-medium text-gray-700">
              Coding Rating
            </label>

            <input
              type="number"
              id="CodingRating"
              name="coding_rating"
              min="1"
              max="5"
              required
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="CommunicationRating" className="block text-sm font-medium text-gray-700">
              Communication Rating
            </label>

            <input
              type="number"
              id="CommunicationRating"
              name="communication_rating"
              min="1"
              max="5"
              required
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="PeerStrengths" className="block text-sm font-medium text-gray-700">
              Peer Strengths
            </label>

            <textarea
              id="PeerStrengths"
              name="peer_strengths"
              required
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            ></textarea>
          </div>

          <div className="col-span-6">
            <label htmlFor="AreasForImprovement" className="block text-sm font-medium text-gray-700">
              Areas for Improvement
            </label>

            <textarea
              id="AreasForImprovement"
              name="areas_for_improvement"
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            ></textarea>
          </div>

          <div className="col-span-6">
            <label htmlFor="InterviewerRating" className="block text-sm font-medium text-gray-700">
              Interviewer Rating
            </label>

            <input
              type="number"
              id="InterviewerRating"
              name="interviewer_rating"
              min="1"
              max="5"
              required
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="TopicRating" className="block text-sm font-medium text-gray-700">
              Topic Rating
            </label>

            <input
              type="number"
              id="TopicRating"
              name="topic_rating"
              min="1"
              max="5"
              required
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button
              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
              type='sumbit'
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</section>
   </div>
  );
};

export default FeedbackPage;