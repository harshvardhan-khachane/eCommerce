import express from 'express';
import {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
} from '../controllers/categoryControllers.js';

const router = express.Router();
router.post('/categories', addCategory);
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', updateCategoryById);
router.delete('/categories/:id', deleteCategoryById);

export default router;
