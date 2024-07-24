import express from 'express';
import { addProduct, getByID, updateProducts } from '../controllers/productController.js';

const router = express.Router();

router.post('/products', addProduct);
router.put('/updateproducts/:id', updateProducts);
router.get('/getbyid/:id', getByID);

export default router;
