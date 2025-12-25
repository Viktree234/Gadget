import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Create order from cart
router.post('/', async (req, res) => {
  try {
    const { sessionId, customerInfo } = req.body;

    if (!sessionId || !customerInfo) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and customer info are required'
      });
    }

    // Get cart
    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate total and prepare order items
    const orderItems = [];
    let total = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      // Check stock
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity
      });

      total += product.price * item.quantity;

      // Update stock
      product.stockQuantity -= item.quantity;
      if (product.stockQuantity === 0) {
        product.inStock = false;
      }
      await product.save();
    }

    // Create order
    const order = new Order({
      items: orderItems,
      total,
      customerInfo,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Clear cart
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by order number (for customers)
router.get('/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.productId', 'name image');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

