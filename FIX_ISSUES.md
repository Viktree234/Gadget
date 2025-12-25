# Fix Your Issues - Quick Guide

## Problem 1: No Products Showing ✅ FIXED BY SEEDING

Your database is empty. Run this:

```bash
cd backend
npm run seed
```

Wait for the success message, then refresh your browser. Products should appear!

---

## Problem 2: Admin Login "Request Failed" ✅ TROUBLESHOOT

This usually means the backend isn't running or can't connect to MongoDB.

### Quick Fix Steps:

**Step 1: Check if backend is running**
```bash
cd backend
npm run dev
```

Look for these messages:
- ✅ MongoDB Connected: localhost:27017
- 🚀 Server running on http://localhost:3000

If you see errors, continue to Step 2.

**Step 2: Test your setup**
```bash
cd backend
npm run check
```

This will tell you:
- If MongoDB is connected
- If database is empty
- What environment variables are set

**Step 3: If MongoDB connection fails**

For **Local MongoDB**:
```bash
# Start MongoDB:
# Linux:
sudo systemctl start mongod

# macOS:
brew services start mongodb-community
```

For **MongoDB Atlas** (cloud):
- Check your connection string in `backend/.env`
- Make sure your IP is whitelisted in Atlas

**Step 4: Start everything in order**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Seed database (if empty):
```bash
cd backend
npm run seed
```

Terminal 3 - Frontend:
```bash
cd workspace
npm run dev
```

**Step 5: Test backend directly**

Open in browser: http://localhost:3000/api/health

Should show: `{"status":"OK","message":"Server is running"}`

---

## Still Not Working?

1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify `.env` files exist in both `backend/` and `workspace/` folders
4. Make sure MongoDB is actually running
5. Try running `npm run check` in backend folder

