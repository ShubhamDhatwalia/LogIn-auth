import {Router} from "express";
const router = Router();
import Auth from '../middleware/auth.js'
import {registerMail} from '../controller/mailer.js'

//  import all controllers
import * as controller from '../controller/appcontroller.js';
import { localVariables } from "../middleware/auth.js";


// -----------------  Post Methods ------------

router.route('/register').post(controller.register);        // register user

router.post("/registerMail", registerMail);         // send mail
router.post('/authenticate', controller.verifyUser, (req, res)=>res.end());         // authenticate
router.post('/login', controller.login);      //  login in app


// -----------------  Get Methods ------------


router.get('/user/:username', controller.getUser);        // user with username
router.get('/generateOTP',controller.verifyUser, localVariables, controller.generateOTP);       // generate random OTP
router.get('/verifyOTP', controller.verifyUser, controller.verifyOTP);          // verify OTP
router.get('/createResetSession', controller.createResetSession);             // reset  all variables

// -----------------  Put Methods ------------
router.put('/updateuser',Auth, controller.updateUser);        // is use to update user profile
router.put('/resetPassword',controller.verifyUser, controller.resetPassword);         //  use to reset password


export default router;


