const LFileInput: React.FC = () => {
  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        htmlFor="file_input"
      >
        
      </label>
      <input
        className="mt-1 w-full z-5 rounded-md cursor-pointer border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        id="file_input"
        type="file"
      />
    </div>
  );
};

export default LFileInput
