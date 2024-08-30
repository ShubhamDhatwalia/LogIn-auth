import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/

//  Middleware for verify user

export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existance
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: " Can't find user" });
    next();
  } catch (error) {
    return res.status(404).send({ error: " Authentication Error" });
  }
}



export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // Check if username or email already exists
    const [existingUsername, existingEmail] = await Promise.all([
      UserModel.findOne({ username }).exec(),
      UserModel.findOne({ email }).exec(),
    ]);

    if (existingUsername) {
      return res.status(400).json({ error: "Please use a unique username" });
    }

    if (existingEmail) {
      return res.status(400).json({ error: "Please use a unique email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    // Save the user
    await user.save();
    res
      .status(201)
      .json({
        msg: `User registered successfully. These are the details for user usernam: ${username} password: ${password}`,
      });
  } catch (error) {
    
    res.status(500).json({ error: "Server Error" });
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Check if the password matches
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).send({ error: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id, // Ensure you're using the correct property
        username: user.username,
      },
      "JWT_SECRET", // Use environment variable for the secret
      { expiresIn: "24h" }
    );

    // Send successful response
    return res.status(200).send({
      msg: "Login successful!",
      username: user.username,
      token,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    // Check if username is provided
    if (!username) {
      return res.status(400).send({ error: "Invalid Username" });
    }

    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // destruture password

    const { password, ...rest } = Object.assign({}, user.toJSON());

    // Send the user data
    return res.status(200).send(rest);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
  // const id = req.query.id;

  const {userId} = req.user;

  try {
    // Check if ID is provided
    if (!userId) {
      return res.status(400).send({ error: "User ID is required" });
    }

    // Get the update data from request body
    const updateData = req.body;

    // Perform the update operation
    const result = await UserModel.updateOne({ _id: userId }, updateData);

    // Check if any document was modified
    if (result.nModified === 0) {
      return res
        .status(404)
        .send({ error: "User not found or no changes made" });
    }

    // Respond with success message
    return res.status(200).send({ msg: "Record updated successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});

  res.status(201).send({code: req.app.locals.OTP});
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const {code} = req.query;

  if(parseInt(req.app.locals.OTP)=== parseInt(code)){
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;                         // Start session for reset password

    return res.status(201).send({msg: 'Verified successfully!'});
  }
  return res.status(400).send({error: 'Invalid OTP'});
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired" });
}

export async function resetPassword(req, res) {
  // if (!req.app.locals.resetSession) {
  //   return res.status(440).send({ error: "Session expired" });
  // }
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );
    if (result.nModified === 0) {
      return res
        .status(404)
        .send({ error: "User not found or no changes made" });
    }
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "Record Updated!" });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).send({ error: "Server Error" });
  }
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */

// export async function resetPassword(req, res) {

//   if(!req.app.locals.resetSession) return res.status(440).send({error: "session expired"});

//   try {
//     const { username, password } = req.body;

//     // Find the user by username
//     const user = await UserModel.findOne({ username });

//     if (!user) {
//       return res.status(404).send({ error: "Username not found" });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Update the user's password
//     const result = await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

//     if (result.nModified === 0) {
//       return res.status(404).send({ error: "User not found or no changes made" });
//     }

//     // Reset the session
//     req.app.locals.resetSession = false;

//     // Send success response
//     return res.status(201).send({ msg: "Record Updated!" });
//   } catch (error) {
//     console.error("Error during password reset:", error);
//     return res.status(500).send({ error: "Server Error" });
//   }
// }

