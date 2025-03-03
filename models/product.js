const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    category: { 
        type: String, 
        enum: ["Camisetas", "Pantalones", "Zapatos", "Accesorios"], 
        required: true 
    },
    size: { 
        type: String, 
        enum: ["XS", "S", "M", "L", "XL"], 
        required: true 
    },
    price: { type: Number, required: true, min: 0 }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
