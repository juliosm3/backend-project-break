const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', productController.showProducts);
router.get('/:productId', productController.showProductById);

router.get('/dashboard', authMiddleware, productController.showProducts);
router.get('/dashboard/new', authMiddleware, productController.showNewProductForm);
router.post('/dashboard', authMiddleware, productController.createProduct);
router.get('/dashboard/:productId/edit', authMiddleware, productController.showEditProductForm);
router.post('/dashboard/:productId?_method=PUT', authMiddleware, productController.updateProduct);
router.post('/dashboard/:productId/delete?_method=DELETE', authMiddleware, productController.deleteProduct);

module.exports = router;