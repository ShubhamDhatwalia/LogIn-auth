// Make Api request -----------

import axios from 'axios';
import {jwtDecode} from 'jwt-decode';


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;



// Get Username from token ----------

export async function getUsername(){
    const token = localStorage.getItem('token');
    if(!token) return Promise.reject("Cannot find token");

    let decode = jwtDecode(token);
    return decode;
}


//  Authenticate function -------

export async function authenticate(username) {
    try {
        return await axios.post('/api/authenticate', {username})
    } catch (error) {
        return {error: "Username doesn't exist ..."}
    }
}

// get user details ----------

export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`/api/user/${username}`)
        return { data };
    } catch (error) {
        return {error: "Password doesn't match"}
    }
}


//  register user function ---------

// register user function ---------
export async function registerUser(credentials) {
    try {
        
        // Check if credentials match server expectations
        const { data: { msg }, status } = await axios.post(`/api/register`, credentials);


        let { username, email,  } = credentials;

        if (status === 201) {
            await axios.post('/api/registerMail', { username,  userEmail: email, text: msg });
        }

        return Promise.resolve(msg);
    } catch (error) {
        // Extract error message from response
        const errorMsg = error.response?.data?.error || 'Could not register';
        return Promise.reject(errorMsg);
    }
}




//  Login function -----------------

export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        const errorMsg = error.response?.data?.error || "Wrong Password...";
        return Promise.reject({ error: errorMsg });
        
    }
}


// update user function -------------

export async function updateUser(response) {
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateUser', response, { headers: { "Authorization": `Bearer ${token}` } });

        return Promise.resolve({ data });
    } catch (error) {
        return Promise.reject({ error: "Couldn't update profile" });

    }
}


//  Generate OTP-----------------------


export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });
        
        if (status === 201) {
            let { data: { email } } = await getUser({ username });

            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery" });
        }
        return Promise.resolve({ code });
    } catch (error) {
        return Promise.reject({error})
    }
}


//  Verify OTP -------------------

export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } });
        return { data, status };
    } catch (error) {
        return Promise.reject({ error })
    }
}


//  reset PAssword ----------------

export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });
    
    return { data, status };
  } catch (error) {
    
    return Promise.reject({ error: error.response?.data || error.message });
  }
}
