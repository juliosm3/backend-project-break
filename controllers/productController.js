const Product = require('../models/product');

function getNavBar(user) {
    return `
        <nav>
            <a href="/">Inicio</a>
            <a href="/products">Catálogo</a>
            <a href="/dashboard">Dashboard</a>
            ${user ? '<a href="/auth/logout">Cerrar Sesión</a>' : '<a href="/auth/login">Iniciar Sesión</a>'}
        </nav>
    `;
}

function getProductCards(products) {
    return products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>${product.price}€</p>
            <a href="/products/${product._id}">Ver detalle</a>
        </div>
    `).join('');
}

const showProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.send(`
            <html>
                <head>
                    <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                    ${getNavBar(req.session.user)}
                    <div class="container">
                        <h1>Catálogo de Productos</h1>
                        ${getProductCards(products)}
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('<h1>Error al obtener productos</h1>');
    }
};

const showProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).send('<h1>Producto no encontrado</h1>');
        res.send(`
            <html>
                <head>
                    <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                    ${getNavBar(req.session.user)}
                    <div class="container">
                        <h1>${product.name}</h1>
                        <img src="${product.image}" alt="${product.name}" style="width:300px;">
                        <p>${product.description}</p>
                        <p>Precio: ${product.price}€</p>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('<h1>Error al obtener el producto</h1>');
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, image, category, size, price } = req.body;
        if (!name || !description || !image || !category || !size || !price) {
            return res.status(400).send('<h1>Todos los campos son obligatorios</h1>');
        }
        const newProduct = new Product({ name, description, image, category, size, price });
        await newProduct.save();
        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).send('<h1>Error al crear el producto</h1>');
    }
};

const updateProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).send('<h1>Error al actualizar el producto</h1>');
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('<h1>Error al eliminar el producto</h1>');
    }
};

module.exports = { 
    showProducts, 
    showProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct
};
