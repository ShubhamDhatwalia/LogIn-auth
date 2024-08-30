import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidate } from "../helper/validate";
import { resetPassword } from "../helper/helper";
import { useAuthStore } from "../Store/store";
import useFetch from "../hooks/fetch.hook";
import styles from "../styles/Username.module.css";

export default function Reset() {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, status, serverError }] = useFetch('createResetSession') 

  const formik = useFormik({
    initialValues: {
      password: "",
      conf_password: "",
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const resetPromise = resetPassword({
          username,
          password: values.password,
        });
        await toast.promise(resetPromise, {
          loading: "Updating...",
          success: <b>Reset Successfully...!</b>,
          error: <b>Could not Reset!</b>,
        });
        navigate("/password");
      } catch (error) {
        
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }
  if(serverError) return <Navigate to={"/"} replace={true}></Navigate>;
  if(status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

 
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center mx-0 items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-xl pb-7 font-medium text-gray-500">
              Enter new password
            </h4>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="New password"
              />
              <input
                {...formik.getFieldProps("conf_password")}
                className={styles.textbox}
                type="password"
                placeholder="Repeat Password"
              />
              <button className={styles.btn} type="submit">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
