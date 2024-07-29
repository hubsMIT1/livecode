
interface LInputProps{
    label:string;
    handleChange?:any;
    name:string;
    value?:string;
    type?:string;
    errors:{[key:string]:string};
    style?:string;
    Icon?:any;
    handleIcon?:any;
}

const LInput:React.FC<LInputProps>  = ({label,handleChange,name,type,errors,style,value}) =>{
    
    return (
        <div className={style? style : ''}>
                <label
                  htmlFor={name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {label}
                </label>
                <div className="relative">
                <input
                  type={type}
                  name={name}
                  value={value}
                  onChange={handleChange}
                  className="mt-1 w-full z-5 rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                {/* {Icon &&
                <div>
                <span
                  className="absolute inset-y-0 -top-20 py-7 end-0 grid place-content-center px-4 cursor-pointer"
                  onClick={handleIcon}
                >
                 <Icon />
                </span> */}
                 
                 {/* </div>
                } */}
                </div>
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                )}

        </div>
    )
}

export default LInput;