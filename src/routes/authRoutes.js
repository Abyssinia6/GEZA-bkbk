import {Router} from 'express';
import{register} from '../controllers/authController';
import { validateRegistrationRegex ,sanitizeInputData} from '../middleware/SecurityValidation';

const router= Router();

router.post('/register', validateRegistrationRegex, sanitizeInputData, register);
export default router;