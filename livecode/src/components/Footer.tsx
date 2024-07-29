import { Code2Icon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '@/api/constants';
// import DropdownMenu from './DropMenu';


// export function ModeToggle() {
//   const { setTheme } = useTheme()
//   onClick={() => setTheme("light")}

//   return (
//     <DropdownMenu title="Theme" />
//   )

// }
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
          <a
            className="inline-block smooth-scroll rounded-full bg-teal-600 p-2 text-white shadow transition hover:bg-teal-500 sm:p-3 lg:p-4 dark:bg-gray-700 dark:text-teal-300 dark:hover:bg-gray-600"
            href="#MainContent"
            data-scroll
          >
            <span className="sr-only">Back to top</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <div className="flex justify-center text-teal-600 lg:justify-start dark:text-teal-300">
            <div>
            <Link
              to="/"
              className="flex gap-1 font-bold dark:text-white text-gray-700 items-center"
            >
              <Code2Icon className="h-6 w-6 text-primary" />
              <span className="text-lg">Livecode</span>
            </Link>
          </div>
            </div>

            <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left dark:text-gray-400">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt consequuntur amet culpa
              cum itaque neque.
            </p>
          </div>

          <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
          {navItems.map((item, index) => (
                  <li key={item.label + index}>
                    <Link
                      className={`text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75 ${
                        location.pathname === item.link
                          ? "border-b-2 border-teal-600"
                          : ""
                      }`}
                      to={item.link}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
          </ul>
        </div>

        <p className="mt-12 text-center text-sm text-gray-500 lg:text-right dark:text-gray-400">
          Copyright &copy; 2024. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;