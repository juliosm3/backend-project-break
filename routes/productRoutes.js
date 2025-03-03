const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', productController.showProducts);
router.get('/:productId', productController.showProductById);

router.get('/dashboard', authMiddleware, productController.showProducts);
router.get('/dashboard/new', authMiddleware, (req, res) => {
    res.send(`
        <html>
            <head><link rel="stylesheet" href="/styles.css"></head>
            <body>
                <h1>Nuevo Producto</h1>
                <form action="/dashboard" method="POST">
                    <input type="text" name="name" placeholder="Nombre" required>
                    <input type="text" name="description" placeholder="Descripción" required>
                    <input type="text" name="image" placeholder="URL de la imagen" required>
                    <input type="text" name="category" placeholder="Categoría" required>
                    <input type="text" name="size" placeholder="Tamaño" required>
                    <input type="number" name="price" placeholder="Precio" required>
                    <button type="submit">Crear Producto</button>
                </form>
            </body>
        </html>
    `);
});
router.post('/dashboard', authMiddleware, productController.createProduct);
router.get('/dashboard/:productId/edit', authMiddleware, async (req, res) => {
    try {
        const product = await require('../models/product').findById(req.params.productId);
        if (!product) return res.status(404).send('<h1>Producto no encontrado</h1>');

        res.send(`
            <html>
                <head><link rel="stylesheet" href="/styles.css"></head>
                <body>
                    <h1>Editar Producto</h1>
                    <form action="/dashboard/${product._id}?_method=PUT" method="POST">
                        <input type="text" name="name" value="${product.name}" required>
                        <input type="text" name="description" value="${product.description}" required>
                        <input type="text" name="image" value="${product.image}" required>
                        <input type="text" name="category" value="${product.category}" required>
                        <input type="text" name="size" value="${product.size}" required>
                        <input type="number" name="price" value="${product.price}" required>
                        <button type="submit">Actualizar Producto</button>
                    </form>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('<h1>Error al obtener el producto para editar</h1>');
    }
});
router.post('/dashboard/:productId?_method=PUT', authMiddleware, productController.updateProduct);
router.post('/dashboard/:productId/delete?_method=DELETE', authMiddleware, productController.deleteProduct);

module.exports = router;