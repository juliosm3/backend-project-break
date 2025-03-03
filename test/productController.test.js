const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Product = require('../models/product');

jest.setTimeout(10000);

beforeAll(async () => {
  const url = process.env.MONGO_URI;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

beforeEach(async () => {
  await Product.deleteMany({});
});

afterEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product API', () => {
  it('should create a new product', async () => {
    const product = {
      name: 'Test Product',
      price: 100,
      description: 'This is a test product',
      image: 'https://example.com/image.jpg',
      category: 'Camisetas',
      size: 'M'
    };

    const res = await request(app).post('/dashboard').send(product);
    expect(res.statusCode).toEqual(302);
  });

  it('should return all products', async () => {
    const product1 = new Product({
      name: 'Test Product 1',
      price: 50,
      description: 'First test product',
      image: 'https://example.com/image.jpg',
      category: 'Camisetas',
      size: 'L'
    });

    const product2 = new Product({
      name: 'Test Product 2',
      price: 75,
      description: 'Second test product',
      image: 'https://example.com/image2.jpg',
      category: 'Zapatos',
      size: 'S'
    });

    await product1.save();
    await product2.save();

    const res = await request(app).get('/products');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Test Product 1');
    expect(res.text).toContain('Test Product 2');
  });

  it('should return the product details', async () => {
    const product = new Product({
      name: 'Test Product',
      price: 100,
      description: 'Test product details',
      image: 'https://example.com/image.jpg',
      category: 'Camisetas',
      size: 'M'
    });

    await product.save();

    const res = await request(app).get(`/products/${product._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Test Product');
  });
});
