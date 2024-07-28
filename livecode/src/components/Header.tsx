import React, { useState, useEffect, useRef } from "react";
import { Code2Icon, User, User2Icon, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "@/state/authState";

const Header: React.FC = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const user = useRecoilValue(userState)

  const navItems = [
    { label: "Problems", link: "/problems" },
    { label: "Your Session", link: "/schedules" },
    { label: "Connect via Link", link: "/join-vai-link" },//enter link input add
    { label: "Blog", link: "/blog" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setToggleMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setToggleMenu(false);
  }, [location]);

  return (
    <header className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <Link
              to="/"
              className="flex gap-1 font-bold dark:text-white text-gray-700 items-center"
            >
              <Code2Icon className="h-6 w-6 text-primary" />
              <span className="text-lg">Livecode</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
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
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
            <button className="rounded-full border-solid border-2 border-gray-300 py-1 px-4 hover:bg-gray-700 hover:text-gray-100">
                    <Link to={`/schedule-contest/`}>
                    Schedule
                    </Link>
                  </button>
              <div className="hidden sm:flex">

                <Link
                  className="rounded-md flex gap-1  py-2.5 text-sm font-medium text-gray-600  dark:text-white dark:hover:text-white/75"
                  to={user?.username ? `profile/${user?.username}` : '/login'}
                >
                    <UserCircle />
                  {/* Account */}
                </Link>
              </div>
            </div>
            <div className="block md:hidden">
              <button
                ref={buttonRef}
                onClick={() => setToggleMenu(!toggleMenu)}
                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={menuRef}
        className={`fixed z-40 w-full  bg-white dark:bg-gray-900 overflow-hidden flex flex-col lg:hidden gap-12 origin-top duration-700 ${
          !toggleMenu ? "h-0" : "h-full"
        }`}
      >
        <div className="px-8">
          <div className="flex flex-col gap-8 font-bold tracking-wider ">
            {navItems.map((item, index) => (
              <Link
                key={item.label + index}
                to={item.link}
                className={`${
                  location.pathname === item.link
                    ? "border-l-4 border-teal-600"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/account">Account</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;