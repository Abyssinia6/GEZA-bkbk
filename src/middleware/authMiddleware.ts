import { Request, Response, NextFunction } from 'express'; // Fixed import syntax
import { supabase } from '../config/supabase.js';

export const authmiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Middleware is checking request...');
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ error: "No correct token provided" });
    }

    try {
        // Everything below stays INSIDE the try block
        const { data: { user }, error } = await supabase.auth.getUser(token);

        // This IF is inside the TRY because it uses the 'user' variable
        if (error || !user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        (req as any).user = user; // Putting the user in the suitcase
        next(); // Opening the gate
        
    } catch (err) {
        // This only runs if the database connection fails completely
        return res.status(500).json({ error: "Server error during authentication" });
    }
};