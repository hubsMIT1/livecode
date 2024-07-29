
const SkeletonItem = () => (
    <div className="flex w-90 items-center justify-between pt-4 first:pt-0">
      <div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        <div className="w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>

      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>

      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>

      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>

      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>


    </div>
  );
  
  const ListSkeleton:React.FC<{items?:number,title?:string}> = ({ items = 5 }) => (
    <div role="status" className="w-100 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
      {[...Array(items)].map((_, index) => (
        <SkeletonItem key={index} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );

export default ListSkeleton;