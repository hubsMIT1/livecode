
interface LTextAreaProps{
        label:string;
        handleChange?:any;
        name:string;
        value?:string;
}

const LTextArea: React.FC<LTextAreaProps> = ({ name, value, handleChange, label }) => {

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <textarea 
      name={name}
      value={value}
      onChange={handleChange}
      rows={5}
      className="mt-1 w-full z-5 rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
        {" "}
      </textarea>
    </div>
  );

};

export default LTextArea;
