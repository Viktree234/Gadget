# Quick Fix: Switch to Local MongoDB

Your MongoDB Atlas connection is failing because of authentication. 

## Easiest Fix: Use Local MongoDB

**Step 1:** Install MongoDB (if not installed)
```bash
# Ubuntu/Debian:
sudo apt update
sudo apt install -y mongodb

# Or use MongoDB Community Edition:
# Follow: https://www.mongodb.com/docs/manual/installation/
```

**Step 2:** Start MongoDB
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Enable on startup
```

**Step 3:** Update backend/.env
```bash
cd backend
# Backup current .env
cp .env .env.atlas-backup

# Edit .env and change this line:
# FROM: MONGODB_URI=mongodb://atlas-sql-...
# TO:   MONGODB_URI=mongodb://localhost:27017/gadget-store
```

Or use this command:
```bash
sed -i 's|MONGODB_URI=.*|MONGODB_URI=mongodb://localhost:27017/gadget-store|' backend/.env
```

**Step 4:** Restart backend server
```bash
# Stop current backend (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

**Step 5:** Seed the database
```bash
cd backend
npm run seed
```

**Step 6:** Refresh frontend - products should appear!

---

## OR: Fix MongoDB Atlas Connection

If you prefer to use Atlas:

1. Check your Atlas connection string has username:password
2. Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
3. Make sure your IP is whitelisted in Atlas Network Access
4. Update backend/.env with correct connection string
