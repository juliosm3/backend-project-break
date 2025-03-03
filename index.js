require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => {
  console.error('Error de conexión:', err);
  process.exit(1);
});

app.use(session({
  secret: 'secretoSeguro',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use('/products', productRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <nav>
          <a href="/">Inicio</a>
          <a href="/products">Catálogo</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
        <h1>Bienvenido a la Tienda</h1>
        <a href="/products">Ver productos</a>
        <a href="/dashboard">Ir al Dashboard</a>
      </body>
    </html>
  `);
});

app.get('/dashboard', authMiddleware, (req, res) => {
  res.send('<h1>Dashboard</h1><a href="/dashboard/new">Nuevo Producto</a>');
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

module.exports = app;
