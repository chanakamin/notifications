import express from 'express';
import { createUserPreferences, updateUserPreferences } from '../controllers/preferences.controller.js';

const router = express.Router();

router.post('/', createUserPreferences);
router.put('/:userId', updateUserPreferences);

export default router;