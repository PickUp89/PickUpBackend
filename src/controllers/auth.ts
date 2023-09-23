import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { setCookie } from "../utils/set_cookies";
import { sendEmail, generateOTP } from "../utils/verifyEmail";

// LOCAL LOGIN
const registerWithEmail = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // If email already exists, return Error
    const existingUser = await User.findOne({
      where: { email: email },
    });

    if (existingUser) return res.status(409).json("User already exists");

    // Hash the password and save the user in the database:
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // give the users certain permissions
    const permissions: string[] = ["View profile", "View dashboard", "Update password", "Update user", "Delete account"];

    const newUser = await User.create({
      firstName,
      lastName,
      email: email,
      password: hashPassword,
      permissions: permissions, // assign the given profile
    });

    // check if new user has been successfully created
    if(!newUser) {
      throw new Error(`Error with server! Cannot create user!`);
    }

    // await to send the email address verification
    const otpCode = await generateOTP();
    // const { response_status, response_message, temp_token } = await sendEmail(email,  otpCode, 'post');
    
    // resolve the email sent
    try {
      const emailResponse = await sendEmail(email, otpCode, 'post');
      // store the user's temporary token into the database
      // update the user's temp token for user's email verification
      await newUser.update({ temp_token : emailResponse["token"] });

      return res.status(201).json('Send verify email successfully');
    } catch(error) {
      throw new Error(`Error: ${error}`);
    };
  
    

    // check if the response's message is True -> the Twilio email is sent successfully
    // if(response_status == 200 || response_status == 201) {
    
    // }
    
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

// LOCAL LOGIN
const loginWithEmail = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // If email doesnt exists, return Error
    const existingUser = await User.findOne({
      where: { email: email },
    });

    if (!existingUser) {
      return res.status(404).json("User doesnt exists");
    }
    // compare
    const isCorrectPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isCorrectPassword) {
      return res.status(403).json("Invalid Password");
    }
    const userWithoutPassword = existingUser.get();
    delete userWithoutPassword.password;

    const token = jwt.sign({email: userWithoutPassword.email, permissions: userWithoutPassword.permissions}, process.env.JWT_SECRET_KEY);
    // set cookie for the user's browser domain
    setCookie(res, 'authToken', token);
    return res.status(200).json({user: userWithoutPassword});

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

// an endpoint to perform a query string to get the token from the url and decode it to verify the user's email address
const emailVerification = async(req: Request, res: Response) => {
  // get the jwt token from the query string after the user clicked on the link from the email address
  try {
    const token: string = String(req.query.token );

    const secret_key = process.env.JWT_SECRET_KEY;
  
    // decode the token
    const decoded_token = jwt.verify(token, secret_key) as {[key: string]: any };
    
    // if the token is still valid -> check if the user's email has the correct temp token
    const user_email = decoded_token.email;
    
    // query the database with the user's email
    const findUser = await User.findOne({
      where : { email: user_email },
    });

    delete findUser.id;
    delete findUser.password;

    if(findUser.temp_token == token) {
      // verify the user's email with the system
      await findUser.update({ 
        account_verified : true,
        is_active: true,
      });

      return res.status(201).json({ user: findUser }); // user is verified
    }

    return res.status(403); // return unauthorized if the token is invalid or expired

  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

// Sign in with OAuth 2.0

export { registerWithEmail, loginWithEmail, emailVerification };
