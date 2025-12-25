# Quick Start Guide

Follow these steps in order to get everything running:

## 1. Start MongoDB

**Local MongoDB:**
```bash
# Linux:
sudo systemctl start mongod

# macOS:
brew services start mongodb-community

# Windows:
# Start MongoDB service from Services panel
```

**OR use MongoDB Atlas (cloud) - no local installation needed**

## 2. Setup Backend

```bash
cd backend

# Install dependencies (if not done)
npm install

# Create .env file (if not exists)
# Copy the example or create with:
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gadget-store
CORS_ORIGIN=http://localhost:5000
SESSION_SECRET=your-secret-key-change-in-production
JWT_SECRET=your-admin-jwt-secret-key-change-in-production
EOF

# Start backend server
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost:27017
🚀 Server running on http://localhost:3000
```

## 3. Seed the Database

In a NEW terminal window (keep backend running):

```bash
cd backend
npm run seed
```

You should see:
```
✅ MongoDB Connected: localhost:27017
🗑️  Cleared existing data
✅ Seeded 4 categories
✅ Seeded 10 products
🎉 Database seeded successfully!
```

## 4. Setup Frontend

In a NEW terminal window:

```bash
cd workspace

# Install dependencies (if not done)
npm install

# Create .env file (if not exists)
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Sergent Gadgets
VITE_CONTACT_EMAIL=support@gadget-store.com
VITE_CONTACT_PHONE=+1 (555) 123-4567
EOF

# Start frontend server
npm run dev
```

You should see something like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5000/
  ➜  Network: use --host to expose
```

## 5. Access the Application

- **Store Frontend**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin/login

## 6. First Admin Login

When you first visit the admin panel:
- Use any username (e.g., "admin")
- Use any password (e.g., "admin123")
- Click Login
- This will automatically create your admin account

## Summary

You should have 3 terminal windows/tabs:
1. **Backend server** (running `npm run dev` in backend folder)
2. **Frontend server** (running `npm run dev` in workspace folder)  
3. **Optional**: One for running seed/other commands

If products aren't showing, make sure you ran the seed script!

