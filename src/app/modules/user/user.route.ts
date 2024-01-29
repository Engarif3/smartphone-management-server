import express from 'express';
const router = express.Router();
import { UserControllers } from './user.controller';

router.post('/register', UserControllers.createUser);

export const UserRoutes = router;
