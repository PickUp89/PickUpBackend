// this is a helper function to set cookies for the user's browser
import express, { Request, Response } from 'express';


// Set cookies helper function
export function setCookie(res: Response, name: string, value: string, custom_config: any = {}) {
    // Default config for cookie
    const defaultConfig = {
        httpOnly : true,
        maxAge : 60 * 60000, // 60 minutes in miliseconds
        sameSite: 'none', // Allow cross-origin sharing
        domain: 'localhost',
    };

    // Merge custom config with default config
    const mergeConfig = { ...defaultConfig, ...custom_config };
    
    res.cookie(name, value, mergeConfig);
}