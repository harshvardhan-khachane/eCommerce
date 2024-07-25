import express from 'express';
import { addProduct, deleteProductById, getAllProducts, getByID, updateProducts } from '../controllers/productControllers.js';

const router = express.Router();

router.post('/products', addProduct);
router.put('/updateproducts/:id', updateProducts);
router.get('/getbyid/:id', getByID);
router.get('/getAllProducts', getAllProducts);
router.delete('/deleteproducts/:id', deleteProductById);

export default router;
