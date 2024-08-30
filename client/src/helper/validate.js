import toast from 'react-hot-toast';
import { authenticate } from './helper';


// Validate login page username

export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);

  // Only check if the user exists if there are no username validation errors
  if (values.username && Object.keys(errors).length === 0) {
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exist = toast.error('User does not exist', { duration: 2000 });
    }
  }

  return errors;
}


// Validate profile page

export async function profileValidation(values){
  const error = emailVerify({}, values);
  return error;
}





/** VAlidate Username */

function usernameVerify(error = {}, values) {
    if (!values.username) {
        error.username = toast.error("Username Required", { duration: 2000 });
    } else if (values.username.includes(" ")) {
        error.username = toast.error("Invalid Username", { duration: 2000 });
    }
    return error;
}


// email verify 

function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("email cannot contain spaces!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
}



// Validate Password 

export async function passwordVerify(values) {
    const errors = passwordValidate({}, values);
    return errors;
}



//  Validate reset password 

export async function resetPasswordValidate(values) {
  const errors = passwordValidate({}, values);

  
      if (!errors.password && values.password !== values.conf_password) {
        errors.exist = toast.error("Password not matching", { duration: 2000 });
      }
  
  return errors;
}


//  Validate Registration 

export async function registerValidation(values) {
  let errors = {};

  // Validate username
  errors = usernameVerify({}, values);
  if (Object.keys(errors).length > 0) {
    return errors; // Return after the first error
  }

  // Validate email
  errors = emailVerify({}, values);
  if (Object.keys(errors).length > 0) {
    return errors; // Return after the first error
  }

  // Validate password
  errors = passwordValidate({}, values);
  if (Object.keys(errors).length > 0) {
    return errors; // Return after the first error
  }

  return {}; // No errors
}


// Simple password validation for login ---------

export function simplePasswordVerify(values) {
  let error = {};

  if (!values.password) {
    error.password = toast.error("Password Required", { duration: 2000 });
  }

  return error;
}



//  Verify Password    

function passwordValidate(error = {}, values) {
    const specialChars =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,}$/;


    if (!values.password) {
      error.password = toast.error("Password Required", { duration: 2000 });
    } else if (values.password.includes(" ")) {
      error.password = toast.error("Password cannot contain spaces", {
        duration: 2000,
      });
    } else if (values.password.length < 8) {
      error.password = toast.error("Password must be more than 8 character", {
        duration: 2000,
        style: { fontSize: "15px" },
      });
    } else if (!specialChars.test(values.password)) {
      error.password = toast.error(
        "Password must have special characters",
        { duration: 2000 }
      );
    }
    
    return error;
}