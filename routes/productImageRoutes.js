import express from 'express';
import multer from 'multer';
import { addProductImages, getProductImages, getProductImageById, getProductImageIds } from '../controllers/productImageControllers.js';

const router = express.Router();
const upload = multer();

router.post('/products/:product_id/images', upload.array('images', 10), addProductImages);
router.get('/products/:product_id/getimages', getProductImages);
router.get('/products/:product_id/images/:image_id', getProductImageById);
router.get('/products/:product_id/image-ids', getProductImageIds);

export default router;
