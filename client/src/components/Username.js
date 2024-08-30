import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate';
import { useAuthStore } from "../Store/store";

import styles from "../styles/Username.module.css";

export default function Username() {

  const navigate = useNavigate();

  const setUsername = useAuthStore(state => state.setUsername);

    const formik = useFormik({
        initialValues: {
            username: ""
        },
        validate: usernameValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
          setUsername(values.username)
          navigate('/password')
        }
    })


  return (
    <div className="container mx-auto">

          <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center mx-0 items-center h-screen">
        <div className={styles.glass}>
          <div className="title  flex flex-col items-center">
            
            <span className="py-3 text-xxl font-medium w-[100%] text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit} >
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps('username')}
                className={styles.textbox}
                type="text"
                placeholder="Username"
              />
              <button className={styles.btn} type="submit">
                Let's Go
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a Member{" "}
                <Link className="text-red-500" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
