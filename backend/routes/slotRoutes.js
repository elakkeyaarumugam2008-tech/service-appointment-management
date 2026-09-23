import express from 'express';
import { getSlots, createSlot } from '../controllers/slotController.js';

const router = express.Router();

router.route('/')
  .get(getSlots)
  .post(createSlot);

export default router;
