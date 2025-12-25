import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get category by ID, slug, or name
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID, slug, or name
    let category = await Category.findById(identifier);
    
    if (!category) {
      category = await Category.findOne({
        $or: [
          { slug: identifier.toLowerCase() },
          { name: identifier.toUpperCase() }
        ]
      });
    }

    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    // Get products for this category
    const categoryProducts = await Product.find({ 
      category: category.name 
    });

    res.json({ 
      success: true, 
      category: {
        ...category.toObject(),
        productCount: categoryProducts.length
      },
      products: categoryProducts
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
