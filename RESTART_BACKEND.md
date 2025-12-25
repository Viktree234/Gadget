# Fix Admin Login "Request Failed"

## Issue
Admin login shows "Request failed" with error "next is not a function"

## Solution: Restart Backend Server

The code is correct, but your backend server needs to be restarted to pick up the latest changes.

### Steps:

1. **Stop the current backend server**
   - Go to the terminal where backend is running
   - Press `Ctrl+C` to stop it

2. **Restart the backend server**
   ```bash
   cd /home/y-thug/Downloads/Gadget/backend
   npm run dev
   ```

3. **Wait for these messages:**
   ```
   ✅ MongoDB Connected: localhost:27017
   🚀 Server running on http://localhost:3000
   ```

4. **Try admin login again**
   - Go to: http://localhost:5000/admin/login
   - Use any username/password (first login creates account)
   - Should work now!

### If still not working:

Check backend terminal for errors, or test directly:
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Should return: `{"success":true,"token":"...","admin":{...}}`
