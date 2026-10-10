
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const seedProducts = require('./seed/product');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200'
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'ShopCart API is running.'
    });
});

app.use('/api/products', productRoutes);

// Centralized error handler
app.use((error, req, res, next) => {
    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        success: false,
        message: 'An unexpected server error occurred.'
    });
});

async function startServer() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing from the .env file.');
    }

    await connectDB();
    await seedProducts();

    app.listen(PORT, () => {
        console.log(`ShopCart API running at http://localhost:${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
});
