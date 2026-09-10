import express from 'express';
import { doRegister, doLogin } from '../controllers/loginController.js';

const router = express.Router();

router.post('/register', doRegister);
router.post('/login', doLogin)

export default router;

