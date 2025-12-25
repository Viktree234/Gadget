import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const categories = [
  { 
    name: 'PHONES', 
    icon: '📱',
    description: 'Latest smartphones and mobile devices',
    slug: 'phones'
  },
  { 
    name: 'LAPTOPS', 
    icon: '💻',
    description: 'Premium laptops for work and play',
    slug: 'laptops'
  },
  { 
    name: 'WEARABLES', 
    icon: '⌚',
    description: 'Smartwatches and fitness trackers',
    slug: 'wearables'
  },
  { 
    name: 'GAMING', 
    icon: '🎮',
    description: 'Gaming consoles, accessories, and gear',
    slug: 'gaming'
  }
];

const products = [
  {
    name: 'Advanced Drone',
    price: 1499,
    category: 'GAMING',
    image: 'https://images.unsplash.com/photo-1506634215556-74a5a7a93688?w=300&q=80',
    badge: 'NEW RELEASE',
    description: 'High-performance drone with 4K camera and advanced flight controls',
    inStock: true,
    rating: 4.8,
    stockQuantity: 50
  },
  {
    name: 'Wireless Earbuds',
    price: 199,
    category: 'WEARABLES',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&q=80',
    description: 'Premium wireless earbuds with noise cancellation',
    inStock: true,
    rating: 4.6,
    stockQuantity: 100
  },
  {
    name: 'Gaming Controller',
    price: 149,
    category: 'GAMING',
    image: 'https://images.unsplash.com/photo-1486572788984-e8d56d1481c1?w=300&q=80',
    description: 'Professional gaming controller with customizable buttons',
    inStock: true,
    rating: 4.7,
    stockQuantity: 75
  },
  {
    name: 'iPhone 15 Pro',
    price: 999,
    category: 'PHONES',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&q=80',
    badge: 'NEW RELEASE',
    description: 'Latest iPhone with A17 Pro chip and titanium design',
    inStock: true,
    rating: 4.9,
    stockQuantity: 30
  },
  {
    name: 'MacBook Pro M3',
    price: 2499,
    category: 'LAPTOPS',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&q=80',
    description: 'Powerful laptop with M3 chip for professionals',
    inStock: true,
    rating: 4.9,
    stockQuantity: 25
  },
  {
    name: 'Apple Watch Ultra',
    price: 799,
    category: 'WEARABLES',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300&q=80',
    description: 'Premium smartwatch with advanced fitness tracking',
    inStock: true,
    rating: 4.7,
    stockQuantity: 40
  },
  {
    name: 'Samsung Galaxy S24',
    price: 899,
    category: 'PHONES',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    description: 'Flagship Android phone with AI capabilities',
    inStock: true,
    rating: 4.8,
    stockQuantity: 35
  },
  {
    name: 'Dell XPS 15',
    price: 1899,
    category: 'LAPTOPS',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80',
    description: 'Premium ultrabook with stunning display',
    inStock: true,
    rating: 4.6,
    stockQuantity: 20
  },
  {
    name: 'PlayStation 5',
    price: 499,
    category: 'GAMING',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&q=80',
    badge: 'TRENDING',
    description: 'Next-generation gaming console',
    inStock: false,
    rating: 4.9,
    stockQuantity: 0
  },
  {
    name: 'Xbox Series X',
    price: 499,
    category: 'GAMING',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&q=80',
    description: 'Microsoft gaming console with powerful performance',
    inStock: true,
    rating: 4.8,
    stockQuantity: 45
  }
];

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Seeded ${createdCategories.length} categories`);

    // Seed products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${createdProducts.length} products`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

