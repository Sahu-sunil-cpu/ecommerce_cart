
const Product = require('../models/Product');


const productImages = {
    laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
    mouse: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85',
    keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
    headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85'
};

const products = [
    {
        name: 'MacBook Air M3',
        description: 'A lightweight laptop for work, study, and creativity.',
        price: 89999,
        category: 'Laptops',
        image: productImages.laptop,
        stock: 12,
        featured: true
    },
    {
        name: 'Wireless Mouse',
        description: 'An ergonomic wireless mouse for everyday productivity.',
        price: 1499,
        category: 'Accessories',
        image: productImages.mouse,
        stock: 30,
        featured: true
    },
    {
        name: 'Mechanical Keyboard',
        description: 'A tactile keyboard designed for comfortable typing.',
        price: 3499,
        category: 'Accessories',
        image: productImages.keyboard,
        stock: 18,
        featured: true
    },
    {
        name: 'Wireless Headphones',
        description: 'Over-ear headphones for music, calls, and focus.',
        price: 4999,
        category: 'Audio',
        image: productImages.headphones,
        stock: 15,
        featured: false
    },
    {
        name: 'Full HD Monitor',
        description: 'A crisp display for coding, studying, and entertainment.',
        price: 12999,
        category: 'Monitors',
        image: productImages.monitor,
        stock: 8,
        featured: false
    }
];

async function seedProducts() {
    const count = await Product.countDocuments();

    if (count === 0) {
        await Product.insertMany(products);
        console.log('Sample products inserted successfully.');
    } else {
        console.log(`Seeding skipped: ${count} products already exist.`);
    }
}

module.exports = seedProducts;
