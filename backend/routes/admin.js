import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Admin Login
router.post('/login', async (req, res, next) => {
  try {
    console.log('🔐 Admin login attempt:', { username: req.body?.username, hasPassword: !!req.body?.password });
    console.log('📦 Request body:', req.body);
    console.log('📋 Request headers:', req.headers);

    const { username, password } = req.body;

    if (!username || !password) {
      console.log('❌ Missing username or password');
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    console.log('🔍 Looking for admin with username:', username);
    
    // Check if admin exists
    let admin = await Admin.findOne({ username });
    console.log('👤 Admin found:', !!admin);
    
    // If no admin exists, create default admin (first time setup)
    if (!admin) {
      console.log('➕ Creating new admin account');
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = new Admin({
        username,
        password: hashedPassword,
        email: username + '@admin.com',
        role: 'superadmin'
      });
      await admin.save();
      console.log('✅ Admin account created:', admin._id);
    } else {
      console.log('🔐 Verifying password for existing admin');
      // Verify password
      const isValidPassword = await admin.comparePassword(password);
      if (!isValidPassword) {
        console.log('❌ Invalid password');
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      console.log('✅ Password verified');
    }

    console.log('🎫 Generating JWT token');
    // Generate token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for:', username);
    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('❌ ERROR in admin login:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Verify token
router.get('/verify', verifyAdmin, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

// Get dashboard stats
router.get('/dashboard/stats', verifyAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    const orders = await Order.find();
    const totalRevenue = orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);
    
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('items.productId', 'name');

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalCategories,
        totalRevenue,
        pendingOrders,
        processingOrders,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Products Management
router.get('/products', verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Orders Management
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const query = status ? { status } : {};
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('items.productId', 'name image');
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name image description');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/orders/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(notes && { notes })
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/orders/:id/payment-status', verifyAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sales/Revenue Stats
router.get('/sales', verifyAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { paymentStatus: 'paid' };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query);
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Group by status
    const ordersByStatus = await Order.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$total' } } }
    ]);
    
    // Group by date (daily sales)
    const dailySales = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    
    res.json({
      success: true,
      sales: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        ordersByStatus,
        dailySales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

