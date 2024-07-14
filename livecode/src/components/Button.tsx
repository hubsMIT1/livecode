interface ButtonProps {
  title: string;
  handleSubmit: () => void;
  color?: 'red' | 'indigo' | 'blue' | 'green' | 'yellow'; // Add more colors as needed
  height?:number;
}

const ButtonUI: React.FC<ButtonProps> = ({ title, handleSubmit, color = 'indigo',height }) => {
  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case 'red':
        return 'border-red-600 text-red-600 hover:bg-red-600';
      case 'blue':
        return 'border-blue-600 text-blue-600 hover:bg-blue-600';
      case 'green':
        return 'border-green-600 text-green-600 hover:bg-green-600';
      case 'yellow':
        return 'border-yellow-600 text-yellow-600 hover:bg-yellow-600';
      default:
        return 'border-indigo-600 text-indigo-600 hover:bg-indigo-600';
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div>
      <button
        className={`group relative cursor-pointer items-center ${height? `h-${height}` : 'h-auto py-3'} inline-block overflow-hidden border px-8  focus:outline-none focus:ring ${colorClasses}`}
        onClick={handleSubmit}
      >
        <span className="absolute inset-y-0 left-0 w-[2px] bg-current transition-all group-hover:w-full"></span>
        <span className="relative text-center text-sm font-medium transition-colors group-hover:text-white">
          {title}
        </span>
      </button>
    </div>
  );
};

export default ButtonUI;


interface bottonProps{
  title:string;
  handleSubmit:()=>void;
  color?:string;
}
const BottonUI: React.FC<bottonProps> = ({title,handleSubmit,color}) => {
// color = color || 'indigo-600';
console.log(color)
return (
  <div>
    <a
      className={`group relative cursor-pointer inline-block overflow-hidden border ${`border-`+color} px-8 py-3 focus:outline-none focus:ring`}
      onClick={handleSubmit}
    >
      <span className={`absolute inset-y-0 left-0 w-[2px] ${'bg-'+color} transition-all group-hover:w-full group-active:bg-${color}`}></span>

      <span className={`relative text-sm font-medium ${'text-'+color} transition-colors group-hover:text-white`}>
        {title}
      </span>
    </a>
  </div>
);
};