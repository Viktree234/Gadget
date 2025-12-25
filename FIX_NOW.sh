#!/bin/bash
echo "=========================================="
echo "  MongoDB Connection Fix Script"
echo "=========================================="
echo ""
echo "Your MongoDB connection is failing due to missing credentials."
echo ""
echo "Choose an option:"
echo "1) Switch to LOCAL MongoDB (recommended for development)"
echo "2) Show instructions to fix Atlas connection"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "Switching to local MongoDB..."
    
    # Check if mongod is installed
    if ! command -v mongod &> /dev/null; then
        echo "⚠️  MongoDB not found. Install it first:"
        echo "   sudo apt update && sudo apt install -y mongodb"
        exit 1
    fi
    
    # Backup current .env
    cp backend/.env backend/.env.backup
    echo "✅ Backed up .env to .env.backup"
    
    # Update MONGODB_URI
    sed -i 's|^MONGODB_URI=.*|MONGODB_URI=mongodb://localhost:27017/gadget-store|' backend/.env
    echo "✅ Updated MONGODB_URI to use local MongoDB"
    
    # Try to start MongoDB
    echo ""
    echo "Starting MongoDB..."
    sudo systemctl start mongod 2>/dev/null || echo "⚠️  Could not start MongoDB automatically. Try: sudo systemctl start mongod"
    
    echo ""
    echo "✅ Done! Next steps:"
    echo "   1. Restart your backend server (Ctrl+C, then: cd backend && npm run dev)"
    echo "   2. Run: cd backend && npm run seed"
    echo "   3. Refresh your frontend"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "To fix MongoDB Atlas connection:"
    echo ""
    echo "1. Go to: https://cloud.mongodb.com/"
    echo "2. Click 'Connect' on your cluster"
    echo "3. Choose 'Connect your application'"
    echo "4. Copy the connection string"
    echo "5. It should look like:"
    echo "   mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/database"
    echo "6. Edit backend/.env and replace MONGODB_URI with your connection string"
    echo "7. Make sure your IP is whitelisted in Atlas Network Access"
    echo ""
else
    echo "Invalid choice"
fi
