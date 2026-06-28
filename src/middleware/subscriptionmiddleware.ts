import { Request, Response, NextFunction } from 'express';
// ❌ REMOVED: import { fullName } from '../controllers/authController.js';

export const subscriptioncheck = (req: Request, res: Response, next: NextFunction) => {
    // 1. Ensure the user is authenticated
    if (!req.user) {
        console.log("unauthorized");
        return res.status(401).json({ error: "please login first" }); // 401 is standard for unauthorized
    }

    // Capture the name safely from the logged-in user object
    const currentUserName = req.user.raw_user_meta_data?.full_name || 'Hairdresser';

    // 2. Block standard customers from accessing professional features
    if (req.user.role === 'user') {
        console.log(`⚠️ ${currentUserName} tried to access hairdresser features.`);
        return res.status(403).json({ error: "this feature is for hairdresser" });
    }

    // 3. Handle features based on roles
    let maxVideos = 0;
    let maxImage = 0;

    if (req.user.role === 'freehairdresser') {
        maxVideos = 4;
        maxImage = 10;
        console.log(`ℹ️ Checking limits for Free Hairdresser: ${currentUserName}`);
    } 
    else if (req.user.role === 'premiumhairdresser') {
        maxVideos = 10;
        maxImage = 20;
        console.log(`👑 Checking limits for Premium Hairdresser: ${currentUserName}`);
    } 
    else {
        // Fallback catch if their role doesn't match expected types
        console.log("Unknown role tier tried to access features");
        return res.status(403).json({ error: "Upgrade your plan to use premium features" });
    }

    // 4. Attach the calculated limits to the request object so the controller can read them
    req.body.limits = {
        maxVideos,
        maxImage
    };

    next();
};