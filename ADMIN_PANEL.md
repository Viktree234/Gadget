# Admin Panel Documentation

## Overview

The admin panel provides a comprehensive interface for managing products, orders, and viewing sales statistics.

## Access

- **URL**: `http://localhost:5000/admin/login`
- **First Login**: Use any username/password combination - it will create your admin account automatically
- **Subsequent Logins**: Use the username/password you created

## Features

### 1. Dashboard (`/admin/dashboard`)

Overview of your store's key metrics:
- Total Products
- Total Orders
- Total Revenue
- Pending Orders
- Processing Orders
- Categories Count
- Recent Orders List

### 2. Products Management (`/admin/products`)

**View Products:**
- See all products in a table format
- View product images, prices, categories, stock levels
- See in-stock/out-of-stock status

**Add Product:**
- Click "+ Add Product" button
- Fill in product details:
  - Name (required)
  - Price (required)
  - Category (GAMING, PHONES, LAPTOPS, WEARABLES)
  - Image URL (required)
  - Badge (optional: NEW RELEASE, TRENDING, SALE)
  - Description
  - Stock Quantity
  - Rating (0-5)
  - In Stock checkbox

**Edit Product:**
- Click "Edit" button on any product
- Modify any field
- Click "Update" to save changes

**Delete Product:**
- Click "Delete" button
- Confirm deletion
- Product is permanently removed

### 3. Orders Management (`/admin/orders`)

**View Orders:**
- See all orders in a table
- Filter by status (pending, processing, shipped, delivered, cancelled)
- View customer information, items, totals

**Process Orders:**
- Change order status via dropdown:
  - **Pending**: New order, awaiting processing
  - **Processing**: Order is being prepared
  - **Shipped**: Order has been shipped
  - **Delivered**: Order completed
  - **Cancelled**: Order cancelled

**Update Payment Status:**
- Change payment status:
  - **Pending**: Payment not yet received
  - **Paid**: Payment confirmed
  - **Failed**: Payment failed
  - **Refunded**: Payment refunded

**View Order Details:**
- Click "View" button to see:
  - Complete customer information
  - Shipping address
  - All order items with images
  - Order total and status

### 4. Sales & Revenue (`/admin/sales`)

**Sales Statistics:**
- Total Revenue (from paid orders)
- Total Orders count
- Average Order Value

**Orders by Status:**
- Breakdown of orders by status
- Revenue per status category

**Daily Sales:**
- Last 30 days of sales data
- Number of orders per day
- Revenue per day
- Filter by date range

**Filter Sales:**
- Select start and end dates
- View sales data for specific periods

## Order Workflow

1. **Customer Places Order:**
   - Order created with status "pending"
   - Payment status "pending"
   - Stock automatically deducted

2. **Admin Processes Order:**
   - Change status to "processing" when preparing
   - Update payment status to "paid" when payment confirmed

3. **Admin Ships Order:**
   - Change status to "shipped" when sent

4. **Order Complete:**
   - Change status to "delivered" when customer receives
   - Order is complete

## API Authentication

All admin endpoints require authentication:
- Login at `/api/admin/login` with username/password
- Receive JWT token
- Include token in header: `Authorization: Bearer <token>`
- Token expires after 7 days

## Security Notes

- **First Admin**: Automatically created on first login
- **Password**: Stored as bcrypt hash in database
- **JWT Tokens**: Used for authentication (configure JWT_SECRET in .env)
- **Production**: Change default credentials and JWT_SECRET

## Database Models

### Admin
- username (unique)
- password (hashed)
- email
- role (admin/superadmin)

### Order
- orderNumber (auto-generated)
- items[] (product details)
- total
- customerInfo (name, email, phone, address)
- status (pending/processing/shipped/delivered/cancelled)
- paymentStatus (pending/paid/failed/refunded)
- timestamps

## Troubleshooting

**Can't login?**
- Check that backend server is running
- Verify JWT_SECRET is set in backend .env
- Clear browser localStorage and try again

**Orders not showing?**
- Check database connection
- Verify orders exist in database
- Check admin authentication token

**Products not saving?**
- Verify all required fields are filled
- Check image URL is valid
- Check browser console for errors

