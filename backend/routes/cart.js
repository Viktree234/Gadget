import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Helper to get or create cart
async function getCart(sessionId) {
  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = new Cart({ sessionId, items: [], total: 0 });
    await cart.save();
  }
  return cart;
}

// Helper to calculate total
async function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
}

// Get cart
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = await getCart(sessionId);
    
    // Populate product details
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) return null;
        
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity
        };
      })
    );

    const validItems = populatedItems.filter(item => item !== null);
    const total = await calculateTotal(cart.items);
    
    res.json({
      success: true,
      cart: {
        items: validItems,
        total: total,
        itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add item to cart
router.post('/:sessionId/items', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required' 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (!product.inStock || product.stockQuantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product is out of stock' 
      });
    }

    const cart = await getCart(sessionId);
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        quantity: quantity
      });
    }

    await cart.save();
    const total = await calculateTotal(cart.items);
    cart.total = total;
    await cart.save();

    // Get populated items for response
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity
        };
      })
    );

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: populatedItems,
        total: total,
        itemCount: populatedItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update item quantity
router.put('/:sessionId/items/:productId', async (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid quantity is required' 
      });
    }

    const cart = await getCart(sessionId);
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    const total = await calculateTotal(cart.items);
    cart.total = total;
    await cart.save();

    // Get populated items for response
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity
        };
      })
    );

    res.json({
      success: true,
      message: 'Cart updated',
      cart: {
        items: populatedItems,
        total: total,
        itemCount: populatedItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove item from cart
router.delete('/:sessionId/items/:productId', async (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    const cart = await getCart(sessionId);

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId.toString()
    );
    
    await cart.save();
    const total = await calculateTotal(cart.items);
    cart.total = total;
    await cart.save();

    // Get populated items for response
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity
        };
      })
    );

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: populatedItems,
        total: total,
        itemCount: populatedItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear cart
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = await getCart(sessionId);
    
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: { items: [], total: 0, itemCount: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
