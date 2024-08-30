import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import {  simplePasswordVerify } from "../helper/validate";
import useFetch from "../hooks/fetch.hook.js";
import { useAuthStore } from "../Store/store";
import styles from "../styles/Username.module.css";
import { verifyPassword } from "../helper/helper.js";

export default function Password() {

  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);


  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: simplePasswordVerify,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({username, password: values.password});

      toast.promise(loginPromise, {
        loading: 'Checking',
        success: <b>Login successfully..</b>,
        error:  <b>Wrong Password...</b>,
      }
      )
      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile');
    }).catch(err => {
        // Handle any additional logic if needed
        
    });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

 
  

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center mx-0 items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <span className="py-2 text-2xl w-[100%] text-center font-bold text-gray-500">
              Hello {apiData?.firstName || apiData?.username || "Guest"}
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="Password"
              />
              <button className={styles.btn} type="submit">
                Sign In
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot password?{" "}
                <Link className="text-red-500" to="/recovery">
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
