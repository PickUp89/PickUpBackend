import express from 'express';
import session from 'express-session';
import passport from 'passport';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import syncModel from '../config/syncModels'
dotenv.config();

import authRoutes from "./routes/authRoutes";
import userProfileRoutes from './routes/userProfileRoutes';
import utilRoutes from "./routes/utilRoutes";
import postRoutes from "./routes/postRoutes";

const port = process.env.PORT

const app = express();

// MIDDLEWARE
app.use(cors({
    credentials: true,
}))
// Session management for passport - Need to consolidate with existing 
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/users", userProfileRoutes);
app.use("/utils", utilRoutes);
app.use("/posts", postRoutes);

// SYNC DATABASE:
const wantToSync = true;
if (wantToSync) {
    syncModel();
}

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})