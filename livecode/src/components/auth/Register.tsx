import React, { useState } from "react";
import { HeaderMiniTemplate, HeaderTemplate } from "./HeaderSection";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthActions } from "@/lib/authUtils";
import ButtonSkeleton from "../ButtonSkelton";
import DividerWordMiddle from "../DividerMiddel";
import { Slide, ToastContainer, toast } from 'react-toastify';
const Registration: React.FC = () => {
  const { registerUser } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    marketingAccept: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", fullName: "", email: "", password: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const AlreadySign = () => {
    return (
      <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-400">
        Already have an account?
        <Link
          to={"/login"}
          className="text-gray-700 underline dark:text-gray-200"
        >
          Log in
        </Link>
        .
      </p>
    );
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const result = await registerUser(formData);
      if (result.success) {
        // Registration successful
        console.log("Registration successful!", result.user);
        toast.success(`${result.user?.username} Registration successful!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
          });
          const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });

        // You might want to redirect the user or clear the form here
      } else {
        // Set errors returned from the server
        setErrors((prevErrors) => ({ ...prevErrors, ...result.errors }));
        toast.error('Error, while creating accout!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
          });
      }
      setLoading(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <ToastContainer />
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left section with image and welcome text */}
        <HeaderTemplate />

        {/* Main form section */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            {/* ... (keep the existing content for the logo and welcome text) ... */}
            <HeaderMiniTemplate />

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                <span
                  className="absolute inset-y-4 py-7 end-0 grid place-content-center px-4 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="col-span-6">
                <label htmlFor="marketingAccept" className="flex gap-4">
                  <input
                    type="checkbox"
                    id="marketingAccept"
                    name="marketingAccept"
                    checked={formData.marketingAccept}
                    onChange={handleChange}
                    className="size-5 rounded-md border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    I want to receive emails about events, product updates and
                    company announcements.
                  </span>
                </label>
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By creating an account, you agree to our
                  <Link
                    to={"#"}
                    className="text-gray-700 underline dark:text-gray-200"
                  >
                    terms and conditions
                  </Link>
                  and
                  <Link
                    to={"#"}
                    className="text-gray-700 underline dark:text-gray-200"
                  >
                    {" "}
                    privacy policy{" "}
                  </Link>
                  .
                </p>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                {!isLoading ? (
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="inline-block w-full rounded-md border border-blue-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-indigo-700 dark:hover:text-white"
                  >
                    Create an account
                  </button>
                ) : (
                  <div className="inline-block w-full">
                    {" "}
                    <ButtonSkeleton title="Creating" />{" "}
                  </div>
                )}
              </div>
              <div className="col-span-6">
                <DividerWordMiddle WordComp={AlreadySign} />
              </div>
              {/* <div className="col-span-6 border border-t-0 border-gray-500 text-gray-500  dark:border-gray-400"></div> */}
              <div className=" col-span-6 sm:flex sm:items-center sm:gap-4">
                <button className="block w-full rounded-lg bg-gray-100 dark:bg-gray-600 px-5 py-3 text-sm font-medium text-gray-800 dark:text-white ">
                  {/* <h1 className="whitespace-nowrap text-gray-600 font-bold"> */}
                  Sign in with Google
                  {/* </h1> */}
                </button>
              </div>
              {/* ... (keep the existing content for sign up with Google and login link) ... */}
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Registration;
