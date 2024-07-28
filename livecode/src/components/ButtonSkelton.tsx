import Typewriter from "./TypeWriter";

interface BtnSkeletonProps {
    title?:string;
}

const ButtonSkeleton:React.FC<BtnSkeletonProps> = ({title="Loading"}) =>{
    return (
        <div className="bg-gray-400 rounded-lg items-center shadow-md px-4 animate-pulse">
            <div className=" h-10 rounded py-2 text-center">
                <Typewriter words={[title+"..."]} size="text-xl"/>
                
            </div>
      </div>
    )
}

export default ButtonSkeleton;