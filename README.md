# Gadget Store - Full Stack E-Commerce Application

A fully functional e-commerce store built with React frontend and Node.js/Express backend, using MongoDB for data persistence.

## Features

- ✅ Product catalog with categories
- ✅ Product detail pages with full information
- ✅ Shopping cart functionality with persistent storage
- ✅ Contact form
- ✅ Search functionality
- ✅ Responsive design
- ✅ Database integration with MongoDB
- ✅ Environment variable configuration for sensitive data

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Vite
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (or copy from `.env.example`):
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/gadget-store
# For MongoDB Atlas (cloud): mongodb+srv://username:password@cluster.mongodb.net/gadget-store

# CORS Configuration
CORS_ORIGIN=http://localhost:5000

# Session Configuration (for cart)
SESSION_SECRET=your-secret-key-change-in-production
```

4. Make sure MongoDB is running (if using local MongoDB):
```bash
# For macOS with Homebrew
brew services start mongodb-community

# For Linux
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud) - no local installation needed
```

5. Seed the database with initial data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the workspace directory:
```bash
cd workspace
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (or copy from `.env.example`):
```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=Sergent Gadgets
VITE_CONTACT_EMAIL=support@gadget-store.com
VITE_CONTACT_PHONE=+1 (555) 123-4567
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5000`

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - Allowed CORS origin
- `SESSION_SECRET` - Secret key for sessions

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_CONTACT_EMAIL` - Contact email address
- `VITE_CONTACT_PHONE` - Contact phone number

## API Endpoints

### Products
- `GET /api/products` - Get all products (supports ?category, ?featured, ?inStock)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/trending/list` - Get trending products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:identifier` - Get category by ID, slug, or name

### Search
- `GET /api/search?q=query` - Search products
- `GET /api/search?category=GAMING` - Filter by category
- `GET /api/search?minPrice=100&maxPrice=500` - Filter by price range

### Cart
- `GET /api/cart/:sessionId` - Get cart
- `POST /api/cart/:sessionId/items` - Add item to cart
- `PUT /api/cart/:sessionId/items/:productId` - Update item quantity
- `DELETE /api/cart/:sessionId/items/:productId` - Remove item from cart
- `DELETE /api/cart/:sessionId` - Clear cart

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (admin)

## Project Structure

```
Gadget/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── Product.js           # Product model
│   │   ├── Category.js          # Category model
│   │   ├── Cart.js              # Cart model
│   │   └── Contact.js           # Contact model
│   ├── routes/
│   │   ├── products.js          # Product routes
│   │   ├── categories.js        # Category routes
│   │   ├── search.js            # Search routes
│   │   ├── cart.js              # Cart routes
│   │   └── contact.js           # Contact routes
│   ├── scripts/
│   │   └── seed.js              # Database seeding script
│   ├── data/                    # (Legacy) static data files
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env                     # Environment variables
│
├── workspace/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Navigation header
│   │   │   ├── Hero.jsx         # Hero section
│   │   │   ├── Categories.jsx   # Category display
│   │   │   ├── Trending.jsx     # Trending products
│   │   │   ├── ProductDetail.jsx # Product detail page
│   │   │   ├── Cart.jsx         # Shopping cart page
│   │   │   └── Contact.jsx      # Contact form
│   │   ├── context/
│   │   │   └── CartContext.jsx  # Cart state management
│   │   ├── services/
│   │   │   └── api.js           # API service
│   │   ├── utils/
│   │   │   └── session.js       # Session management
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── .env                     # Environment variables
│
└── README.md
```

## Usage

1. Start MongoDB (local or use Atlas)
2. Start the backend server (`cd backend && npm run dev`)
3. Seed the database (`npm run seed` in backend directory)
4. Start the frontend server (`cd workspace && npm run dev`)
5. Open `http://localhost:5000` in your browser

## Database Models

### Product
- name, price, category, image, badge, description
- inStock, rating, stockQuantity

### Category
- name, icon, description, slug

### Cart
- sessionId, items[], total

### Contact
- name, email, subject, message, read

## Admin Panel

The application includes a full-featured admin panel for managing the store.

### Access Admin Panel

Navigate to: `http://localhost:5000/admin/login`

**First Time Setup:**
- Use any username/password to create your first admin account
- The first login will automatically create an admin user

### Admin Features

1. **Dashboard** (`/admin/dashboard`)
   - Overview statistics (total products, orders, revenue)
   - Recent orders list
   - Quick stats cards

2. **Products Management** (`/admin/products`)
   - View all products
   - Add new products
   - Edit existing products
   - Delete products
   - Manage stock quantities

3. **Orders Management** (`/admin/orders`)
   - View all orders
   - Filter orders by status
   - Update order status (pending, processing, shipped, delivered, cancelled)
   - Update payment status
   - View detailed order information

4. **Sales & Revenue** (`/admin/sales`)
   - Total revenue and statistics
   - Orders breakdown by status
   - Daily sales reports
   - Filter by date range

### Admin API Endpoints

All admin endpoints require authentication token in the header:
```
Authorization: Bearer <token>
```

- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify token
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get order details
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/payment-status` - Update payment status
- `GET /api/admin/sales` - Get sales statistics

## Order Processing

Customers can checkout from the cart page:
1. Fill in shipping information
2. Order is created with status "pending"
3. Order number is generated (e.g., ORD-1234567890-0001)
4. Stock is automatically updated
5. Cart is cleared after successful order

Admin can then process orders from the admin panel:
- Update order status through the workflow
- Update payment status
- View complete order details

## Notes

- Cart uses session-based storage (sessionId stored in localStorage)
- Admin authentication uses JWT tokens (stored in localStorage)
- All sensitive configuration should be in `.env` files
- Make sure to update `.env` files with your actual MongoDB connection string and other sensitive data
- Never commit `.env` files to version control
- Default admin is created on first login - change credentials in production

