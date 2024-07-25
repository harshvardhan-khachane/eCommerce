import express from 'express';
import {
  addInventory,
  getAllInventory,
  getInventoryById,
  updateInventoryById,
  deleteInventoryById
} from '../controllers/inventoryControllers.js';

const router = express.Router();
router.post('/inventory', addInventory);
router.get('/inventory', getAllInventory);
router.get('/inventory/:id', getInventoryById);
router.put('/inventory/:id', updateInventoryById);
router.delete('/inventory/:id', deleteInventoryById);

export default router;
