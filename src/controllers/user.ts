// user read (query one user), update and delete account 
import e, { Request, Response } from "express";
import User from "../models/User";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

// GET request to get one user with a specific email
const getUser = async (req: Request, res: Response) => {
    try {
        const id: string = String(req.query.id);
        // query the user with the email
        const findUser = await User.findOne({
            where: { id: id },
        });

        // if user is not found in the database
        if(!findUser) {
            return res.status(404).json("Cannot find user with the provided email");
        }

        const foundUserWithoutPassword = findUser.get();
        delete foundUserWithoutPassword.password;
        delete foundUserWithoutPassword.permissions;

        // response 200 if query successful
        return res.status(200).json(foundUserWithoutPassword);

    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

// POST request to log out the user
const logOutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('authToken'); // clear user's cookies to log out
        
        res.cookie('authToken', '', { expires: new Date(0) }); // set user's client cookie to 0

        // Log user's session out
        return res.status(200).json({ message: 'Logout successful' });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

// UPDATE request to update user's password
// If the user's forgot their password
const updatePassword = async (req: Request, res: Response) => {
    try {
        // get the cookies from client
        const authToken = req.cookies['authToken'];

        // decode the token and get the user's email and the password the user's want to update
        const decodedToken : any = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
        const email: string = decodedToken.email;
        const update_password: string = req.body["update_password"];
        
        // query the user's to update the user's password
        const findUser = await User.findOne({
            where: {email : email},
        })

        if(!findUser) {
            return res.status(404).json({ message: `User doesnt exists`});
        }
        
        // update the user's password
        // Hash the new password
        const salt = await bcrypt.genSalt();
        const update_hashPassword = await bcrypt.hash(update_password, salt);

        // Is new password cannot be the same with old password?????????
        findUser.password = update_hashPassword;

        await findUser.save();

        return res.status(201).json({ message: `Update password successfully!` });

    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        // get the cookies from front-end
        const authToken = req.cookies['authToken'];
        const fieldsToUpdate = req?.body?.fieldsToUpdate;

        // decode the token and get the user's email for query
        const decodedToken: any = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
        const email: string = decodedToken.email;
        // query the user with the email
        let foundUser = await User.findOne({
            where: { email: email },
        });

        // if user is not found in the database
        if(!foundUser) {
            return res.status(404).json("Cannot find user with the provided email");
        }
        
        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
            if (key in foundUser) {
                // @ts-ignore
                foundUser[key] = value;
            }
        });

        foundUser.save();
        


        // response 200 if query successful
        return res.status(200).json(foundUser);

    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

// DELETE request to delete the user's account
const deleteAccount = async (req:Request, res:Response) => {
    // get the user's email from cookies
    try {
        // UNCOMMENT THIS LATER
        // const authToken = req.cookies['authToken'];

        // // decode the token and get the user's email to delete the account
        // const decodedToken : any = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
        // const email: string = decodedToken.email;
        
        const { email } = req.body;
        
        // query to get the user's to delete the account
        const findUser = await User.findOne({
            where: {email : email},
        })

        if(!findUser) {
            return res.status(404).json({ message: `User doesnt exists`});
        }

        // delete the user's account
        await findUser.destroy();
        return res.status(201).json({ message: `User account deleted successfully`});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

export { getUser, logOutUser, updatePassword, deleteAccount, updateUser };