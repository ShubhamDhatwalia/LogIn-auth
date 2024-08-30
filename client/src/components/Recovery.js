import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from '../Store/store';
import styles from "../styles/Username.module.css";
import { generateOTP, verifyOTP } from "../helper/helper";


export default function Recovery() {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();


  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if (OTP) return toast.success("OTP has been send to your email.");
      return toast.error("Problem while generating OTP");
    });
  }, [username]);



  async function onSubmit(e) {
    e.preventDefault();

    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success("Verifed successfully");
        return navigate("/reset");
      }
    } catch (error) {
       return toast.error("Wrong OTP");
    }

  }


  // handler of resend OTP
  function resendOTP() {
    let sentPromise = generateOTP(username);

    toast.promise(sentPromise, {
      loading: "Sending...",
      success: <b>OTP has been send to your email!</b>,
      error: <b>Could not Send it!</b>,
    });
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center mx-0 items-center h-screen">
        <div className={styles.glass}>
          <div className="title  flex flex-col items-center">
            <h4 className="text-xl pb-7 font-medium text-gray-500">
              Enter OTP to reset password
            </h4>
          </div>

          <form className="py-1" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                className={styles.textbox}
                type="text"
                placeholder="OTP"
                onChange={(e) => setOTP(e.target.value)}
              />
              <button className={styles.btn} type="submit">
                Submit
              </button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP?{" "}
              <button onClick={resendOTP} className="text-red-500">
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
