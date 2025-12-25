import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Search products
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;

    if (!q && !category && !minPrice && !maxPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide search query, category, or price range' 
      });
    }

    const query = {};

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category.toUpperCase();
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const results = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: results.length,
      query: q || 'all',
      products: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
