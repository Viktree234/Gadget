#!/bin/bash

echo "🔧 Quick Fix for MongoDB Connection"
echo ""
echo "Current MongoDB URI in .env:"
grep MONGODB_URI backend/.env
echo ""
echo ""
echo "📋 Options:"
echo "1. If using MongoDB Atlas, your connection string needs username:password"
echo "   Format: mongodb+srv://username:password@cluster.mongodb.net/database"
echo ""
echo "2. To use LOCAL MongoDB instead, edit backend/.env and change to:"
echo "   MONGODB_URI=mongodb://localhost:27017/gadget-store"
echo ""
echo "3. Then start local MongoDB:"
echo "   sudo systemctl start mongod"
echo ""
echo "Would you like to switch to local MongoDB? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Updating .env to use local MongoDB..."
    # Create backup
    cp backend/.env backend/.env.backup
    # Update MONGODB_URI
    sed -i 's|MONGODB_URI=.*|MONGODB_URI=mongodb://localhost:27017/gadget-store|' backend/.env
    echo "✅ Updated! Now start MongoDB: sudo systemctl start mongod"
    echo "Then restart your backend server"
fi
