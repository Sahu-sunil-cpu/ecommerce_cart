
const Product = require('../models/Product');

// GET /api/products
async function getProducts(req, res, next) {
    try {
        const { category, search, sort } = req.query;

        const filter = {};

        if (category && category !== 'All') {
            filter.category = category;
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: 'i'
            };
        }

        let query = Product.find(filter);

        if (sort === 'price-asc') {
            query = query.sort({ price: 1 });
        } else if (sort === 'price-desc') {
            query = query.sort({ price: -1 });
        } else if (sort === 'newest') {
            query = query.sort({ createdAt: -1 });
        } else {
            query = query.sort({ featured: -1, createdAt: -1 });
        }

        const products = await query;

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
    try {
        if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID.'
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProducts,
    getProductById
};
