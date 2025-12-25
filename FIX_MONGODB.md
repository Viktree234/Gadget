# Fix MongoDB Connection Issue

## Problem Found
Your MongoDB Atlas connection string is missing username and password, or the credentials are incorrect.

## Current Connection String (INCOMPLETE):
```
mongodb://atlas-sql-68af55b522e24a150dd3f8c8-urwccd.a.query.mongodb.net/test?ssl=true&authSource=admin
```

## Solution

You need to update your `backend/.env` file with the correct MongoDB Atlas connection string.

### Option 1: Use MongoDB Atlas Connection String (Recommended)

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string - it should look like:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/gadget-store?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your actual credentials
6. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/gadget-store?retryWrites=true&w=majority
   ```

### Option 2: Use Local MongoDB (Easier for development)

If you have MongoDB installed locally:

1. Start MongoDB:
   ```bash
   sudo systemctl start mongod
   ```

2. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gadget-store
   ```

3. Restart backend server

### Option 3: Create a New MongoDB Atlas User

If you don't have credentials:

1. Go to MongoDB Atlas → Database Access
2. Click "Add New Database User"
3. Create username and password (remember them!)
4. Set privileges to "Read and write to any database"
5. Click "Add User"
6. Update your connection string with these credentials

## After Fixing Connection String

1. Restart your backend server
2. Run the seed script:
   ```bash
   cd backend
   npm run seed
   ```
3. Refresh your frontend - products should appear!

