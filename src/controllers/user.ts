// user read (query one user), update and delete account 
import express, { Request, Response } from "express";
import User from "../models/User";
import jwt from 'jsonwebtoken';

// GET request to get one user with a specific email
const getUserWithEmail = async (req: Request, res: Response) => {
    try {
        // get the cookies from front-end
        const authToken = req.cookies['authToken'];

        // decode the token and get the user's email for query
        const decodedToken: any = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
        const email: string = decodedToken.email;
        // query the user with the email
        const findUser = await User.findOne({
            where: { email: email },
        });

        // if user is not found in the database
        if(!findUser) {
            return res.status(404).json("Cannot find user with the provided email");
        }

        // response 200 if query successful
        return res.status(200).json(findUser);

    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

// UPDATE request to update user's email or password


