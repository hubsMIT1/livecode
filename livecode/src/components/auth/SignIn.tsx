// import { Code2Icon } from "lucide-react";
import React, { useState } from "react";
import  {HeaderTemplate, HeaderMiniTemplate } from "./HeaderSection";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthActions } from "@/lib/authUtils";
import ButtonSkeleton from "../ButtonSkelton";
import DividerWordMiddle from "../DividerMiddel";
import { Slide, ToastContainer, toast } from "react-toastify";

const Login: React.FC = () => {
  const { loginUser } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    credential: "",
    password: "",
  });
  const [showPassword,setShowPassword] = useState<boolean>(false);
  const [isLoading,setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState({
    credential: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { credential: "", password: "" };

    if (!formData.credential.trim()) {
      newErrors.credential = "Email | username is required";
      isValid = false;
    } else if (!/\S+\S+\S+/.test(formData.credential)) {
      newErrors.credential = "Email is invalid";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()){
      setLoading(true);
      const result = await loginUser(formData);
      if (result.success) {
        // Login successful
        toast.success(`${result.user?.username} Registration successful!`, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
          });
        console.log("Login successful!", result.user);
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
        console.log(from)
        navigate(from,{replace:true});
        // You might want to save the token and redirect the user here
      } else {
        // Set errors returned from the server
        setErrors(prevErrors => ({ ...prevErrors, ...result.errors }));
        toast.error(result?.errors?.general || 'Error, while login!', {
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
      setLoading(false)
    }
  };
  const loginViaGoogle = ()=>{
    toast.success(`Registration successful!`, {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
      });
  }
  const CreateNew = ()=>{
    return (
      <p className="text-center text-sm">
                No account?
                <Link className="underline" to={'/register'}>Sign up</Link>
              </p>
    )
  }

  return (
    <section className="bg-white dark:bg-gray-900">
        <ToastContainer />
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left section with image and welcome text */}
        <HeaderTemplate />

        {/* Main form section */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-6  lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-5xl">
            <HeaderMiniTemplate />

            <form onSubmit={handleSubmit} className="mb-0 mt-6 space-y-4 rounded-lg p-4 sm:p-6">
              <p className="text-center text-lg font-medium">Sign in to your account</p>

              <div className="lg:w-[30vw] xl:w-[30vw]">
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                  <input
                    type="text"
                    id="credential"
                    name="credential"
                    value={formData.credential}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"

                    placeholder="Enter email or username"
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
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
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </span>
                </div>
                {errors.credential && <p className="text-red-500 text-xs mt-1">{errors.credential}</p>}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <input
                    type={showPassword?"text" : "password"}
                    id="password"
                    name= "password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    
                    placeholder="Enter password"
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4 cursor-pointer" onClick={()=>setShowPassword(!showPassword)} >
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
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              {!isLoading ?
                <button
                  type="submit"
                  className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                  disabled={isLoading}
                >
                  Sign in
                </button>
                : <ButtonSkeleton title="Signing" />}
              <div className="col-span-6">
                <DividerWordMiddle WordComp={CreateNew} />

              </div>
              {/* <div className="col-span-6 border border-t-0 border-gray-500 text-gray-500  dark:border-gray-400"></div> */}

              <button 
              onClick={loginViaGoogle}
              className="block w-full rounded-lg bg-gray-100 dark:bg-gray-600 px-5 py-3 text-sm font-medium text-gray-800 dark:text-white ">
                {/* <h1 className="whitespace-nowrap text-gray-600 font-bold"> */}
                  Sign in with Google
                {/* </h1> */}
              </button>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Login;