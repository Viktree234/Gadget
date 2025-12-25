# Troubleshooting Guide

## Issue 1: No Products Showing

**Problem**: Your database is empty. You need to seed it with initial data.

**Solution**:
```bash
# Make sure MongoDB is running first
# Then run the seed script:

cd backend
npm run seed
```

You should see output like:
```
✅ MongoDB Connected: localhost:27017
🗑️  Cleared existing data
✅ Seeded 4 categories
✅ Seeded 10 products
🎉 Database seeded successfully!
```

After seeding, refresh your frontend page and products should appear.

---

## Issue 2: Admin Login "Request Failed"

This usually means the backend server isn't running or can't connect to the database. Check:

### Step 1: Check if Backend is Running
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost:27017
🚀 Server running on http://localhost:3000
```

### Step 2: Check MongoDB Connection

**For Local MongoDB:**
```bash
# Check if MongoDB is running
# Linux:
sudo systemctl status mongod

# macOS:
brew services list | grep mongodb

# Start MongoDB if not running:
# Linux:
sudo systemctl start mongod

# macOS:
brew services start mongodb-community
```

**For MongoDB Atlas (Cloud):**
- Check your connection string in `backend/.env`
- Make sure `MONGODB_URI` is correct
- Verify network access is allowed in Atlas

### Step 3: Verify .env File

Make sure `backend/.env` exists and has:
```env
MONGODB_URI=mongodb://localhost:27017/gadget-store
PORT=3000
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5000
```

### Step 4: Check Browser Console

Open browser DevTools (F12) → Console tab, and look for errors. Common issues:

- **Network Error**: Backend server not running
- **CORS Error**: Check CORS_ORIGIN in backend .env matches frontend URL
- **404 Error**: Check API URL in frontend .env is correct

### Step 5: Test Backend Directly

Test if backend is responding:
```bash
# In terminal:
curl http://localhost:3000/api/health
```

Should return: `{"status":"OK","message":"Server is running"}`

### Step 6: Check Frontend .env

Make sure `workspace/.env` has:
```env
VITE_API_URL=http://localhost:3000/api
```

---

## Quick Setup Checklist

1. ✅ MongoDB is running (local or Atlas)
2. ✅ Backend `.env` file exists with correct values
3. ✅ Frontend `.env` file exists with correct API URL
4. ✅ Backend server is running (`npm run dev` in backend folder)
5. ✅ Frontend server is running (`npm run dev` in workspace folder)
6. ✅ Database is seeded (`npm run seed` in backend folder)

---

## Common Errors

### "MongoServerError: connect ECONNREFUSED"
- MongoDB is not running
- MongoDB connection string is wrong

### "Request failed" in admin login
- Backend server not running
- Database connection failed
- CORS configuration issue

### Products not showing after seeding
- Browser cache - try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Frontend not connected to backend - check API URL
- Check browser console for errors

---

## Still Having Issues?

1. Check both terminal windows (backend and frontend) for error messages
2. Check browser console (F12 → Console) for errors
3. Verify all environment variables are set correctly
4. Make sure you're running both servers from the correct directories

