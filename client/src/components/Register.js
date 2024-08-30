import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import styles from "../styles/Username.module.css";
import { registerUser } from "../helper/helper";

export default function Register() {

  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = { ...values, profile: file || '' };
      let registerPromise = registerUser(values);

      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register successfully...</b>,
        error: (err) => <b>{err}</b>, // Display the error message
      });
      registerPromise.then(function(){navigate('/')});
    },
  });

  // Formik does not support file upload so we need to handle this
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center mx-0 items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <span className="py-0 text-2xl w-[100%] text-center text-gray-500">
              Happy to join you!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input type="file" id="profile" name="profile" onChange={onUpload} />
            </div>

            <div className="textbox flex flex-col items-center gap-2">
              <input
                {...formik.getFieldProps("username")}
                className={styles.textbox}
                type="text"
                placeholder="username"
              />
              <input
                {...formik.getFieldProps("email")}
                className={styles.textbox}
                type="email"
                placeholder="example@gmail.com"
              />
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="password"
              />
              <button className={styles.btn} type="submit">
                Sign Up
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already registered{" "}
                <Link className="text-red-500" to="/">
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
