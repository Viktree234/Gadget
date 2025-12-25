import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, featured, inStock } = req.query;
    const query = {};

    // Filter by category
    if (category) {
      query.category = category.toUpperCase();
    }

    // Filter by featured (has badge)
    if (featured === 'true') {
      query.badge = { $ne: null };
    }

    // Filter by stock status
    if (inStock === 'true') {
      query.inStock = true;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending products (products with badges)
router.get('/trending/list', async (req, res) => {
  try {
    const trendingProducts = await Product.find({ badge: { $ne: null } })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: trendingProducts.length,
      products: trendingProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
