# Neo Tech Backend API

Backend API server for the Neo Tech e-commerce website.

## Features

- RESTful API for products, categories, search, and cart
- CORS enabled for frontend integration
- Product filtering and search functionality
- Shopping cart management

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Products
- `GET /api/products` - Get all products (supports ?category, ?featured, ?inStock)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/trending/list` - Get trending products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:identifier` - Get category by ID, slug, or name

### Search
- `GET /api/search?q=query` - Search products by name, description, or category
- `GET /api/search?category=GAMING` - Filter by category
- `GET /api/search?minPrice=100&maxPrice=500` - Filter by price range

### Cart
- `GET /api/cart/:sessionId` - Get cart
- `POST /api/cart/:sessionId/items` - Add item to cart (body: { productId, quantity })
- `PUT /api/cart/:sessionId/items/:productId` - Update item quantity (body: { quantity })
- `DELETE /api/cart/:sessionId/items/:productId` - Remove item from cart
- `DELETE /api/cart/:sessionId` - Clear cart

## Environment Variables

Create a `.env` file:
```
PORT=3000
NODE_ENV=development
```

