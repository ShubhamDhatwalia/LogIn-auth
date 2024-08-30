import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import styles from "../styles/Username.module.css";
import useFetch from "../hooks/fetch.hook.js";
import { updateUser } from "../helper/helper.js";

export default function Register() {
  const [file, setFile] = useState();

  
  const [{ isLoading, apiData, serverError }] = useFetch();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || '',
      
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || apiData?.profile || "" });
      let updatePromise = updateUser(values);
      
      toast.promise(updatePromise, {
        loading:'Updating...',
        success: <b>Update successfully...</b>,
        error: <b>Could not update</b>
      })

    },
  });

  //   Formik does not support file upload so we neeed to handle this

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  //  logout Handler Function ------------------

  function userLogout(){
    localStorage.removeItem('token');
    navigate('/');
  }

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;


  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center mx-0 items-center h-screen">
        <div className={styles.glass}>
          <div className="title  flex flex-col items-center">
            <span className="py-0 text-2xl w-[100%] text-center text-gray-500">
              You can update your profile
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4 ">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile ||file || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </label>
              <input
                type="file"
                id="profile"
                name="profile"
                onChange={onUpload}
              />
            </div>

            <div className="textbox flex flex-col items-center gap-2">
              <div className="name flex w-[100%] gap-3">
                <input
                  {...formik.getFieldProps("firstName")}
                  type="text"
                  className={styles.textbox}
                  placeholder="First Name"
                />

                <input
                  {...formik.getFieldProps("lastName")}
                  type="text"
                  className={styles.textbox}
                  placeholder="Last Name"
                />
              </div>


              <div className="name flex w-[100%] gap-3">


                <input
                {...formik.getFieldProps("mobile")}
                className={styles.textbox}
                type="text"
                placeholder="Mobile no."
              />

              <input
                {...formik.getFieldProps("email")}
                className={styles.textbox}
                type="email"
                placeholder="example@gmail.com"
                />
                
               </div>

              

              <input
                {...formik.getFieldProps("address")}
                className={styles.textbox}
                type="text"
                placeholder="Address"
              />
              <button className={styles.btn} type="submit">
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                come back later? {" "}
                <Link onClick={userLogout} className="text-red-500" to="/">
                  Log out
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
