import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { setCookie } from "../utils/set_cookies";

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
    const permissions: string[] = ["View profile", "View dashboard", "Update password", "Delete account"];

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

    return res.status(201).json({ message: 'Register successfully!' }); // client has no permission to see user's information
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
    return res.status(200).json({ message : "Login successfully!" }); // No need to show client the user's information

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

// Sign in with OAuth 2.0

const googleRegister = (req: object, res: object): number => 5;

export { registerWithEmail, loginWithEmail, googleRegister };
