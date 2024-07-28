interface DividerProps{
    WordComp:any
}
const DividerWordMiddle: React.FC<DividerProps> = ({WordComp})=>{
    return(
        <span className="relative flex justify-center">
  <div
    className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"
  ></div>

  <span className="relative z-10 dark:bg-gray-800 bg-gray-50 px-6"><WordComp /></span>
</span>

    )
}

export default DividerWordMiddle;