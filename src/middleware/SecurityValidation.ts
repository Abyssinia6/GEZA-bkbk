import { Request, Response, NextFunction } from 'express';


export const validateRegistrationRegex = (req: Request, res: Response, next: NextFunction) => {
    const { fullName, phone } = req.body;

    // Strict Name Regex: Allows only letters, spaces, hyphens, and apostrophes. NO NUMBERS allowed.
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    
    // Optional Phone Regex: Matches standard international or local numerical formats
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    // Validate Full Name if it exists in the request body
    if (fullName) {
        if (!nameRegex.test(fullName)) {
            console.log(`❌ Validation Failed: "${fullName}" contains invalid characters or numbers.`);
            return res.status(400).json({
                error: "Invalid characters in Full Name. Numbers and special symbols are not allowed."
            });
        }
    }

    // Validate Phone Number if it exists in the request body
    if (phone) {
        if (!phoneRegex.test(phone)) {
            console.log(`❌ Validation Failed: "${phone}" is not a valid phone structure.`);
            return res.status(400).json({
                error: "Invalid phone number format. Please check and try again."
            });
        }
    }

    // If everything passes, move forward
    next();
};

/**
 * 2. NOSQL INJECTION SANITIZATION MIDDLEWARE
 * Recursively searches through request elements (body, query, params) 
 * and strips out malicious key strings prefixed with '$' or containing '.'
 */
export const sanitizeInputData = (req: Request, res: Response, next: NextFunction) => {
    
    const cleanObject = (obj: any): any => {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                // If a key starts with a MongoDB operator prefix ($), delete or rename it
                if (key.startsWith('$') || key.includes('.')) {
                    console.warn(`⚠️ Malicious character detected and sanitized from key: "${key}"`);
                    const safeKey = key.replace(/[\$.]/g, '_');
                    obj[safeKey] = obj[key];
                    delete obj[key];
                    
                    // Recursively check the value if it's an nested object
                    cleanObject(obj[safeKey]);
                } else {
                    cleanObject(obj[key]);
                }
            }
        }
        return obj;
    };

    // Sanitize all primary incoming data channels
    req.body = cleanObject(req.body);
    req.query = cleanObject(req.query);
    req.params = cleanObject(req.params);

    next();
};