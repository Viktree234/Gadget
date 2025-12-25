# Quick Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
# Make sure MongoDB is running (local or Atlas)
npm run seed  # Seed the database with initial data
npm run dev   # Start backend server (runs on port 3000)
```

**Important:** Update `backend/.env` with your MongoDB connection string:
- Local MongoDB: `mongodb://localhost:27017/gadget-store`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/gadget-store`

### 2. Frontend Setup

```bash
cd workspace
npm install
npm run dev   # Start frontend server (runs on port 5000)
```

**Optional:** Update `workspace/.env` if you need to change:
- API URL (default: http://localhost:3000/api)
- Contact email/phone
- App name

### 3. Access the Application

Open your browser and navigate to: `http://localhost:5000`

## Environment Variables

All sensitive configuration is stored in `.env` files:

### Backend `.env`
- `MONGODB_URI` - Your MongoDB connection string (REQUIRED)
- `PORT` - Backend server port (default: 3000)
- `CORS_ORIGIN` - Frontend URL (default: http://localhost:5000)
- `SESSION_SECRET` - Secret for sessions

### Frontend `.env`
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000/api)
- `VITE_CONTACT_EMAIL` - Contact email
- `VITE_CONTACT_PHONE` - Contact phone

## Features Implemented

✅ Database integration (MongoDB)
✅ Product catalog with categories
✅ Product detail pages
✅ Shopping cart with persistent storage
✅ Contact form
✅ Search functionality
✅ Responsive design
✅ Environment variable configuration

## Troubleshooting

1. **Database connection error**: Make sure MongoDB is running and the connection string in `.env` is correct
2. **CORS errors**: Check that `CORS_ORIGIN` in backend `.env` matches your frontend URL
3. **API errors**: Verify backend is running on port 3000 and frontend can reach it

