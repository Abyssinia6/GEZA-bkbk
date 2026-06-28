import { User } from '@supabase/supabase-js'; // or import your own User type/interface if you have one

declare global {
  namespace Express {
    interface Request {
      // This merges our custom property into the native Express Request interface
      user?: any; // You can use 'any' for now, or your specific User type
    }
  }
}