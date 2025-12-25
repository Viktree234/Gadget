import express from 'express';
import './routes/admin.js';

const app = express();
app.use(express.json());

// Import admin routes
import('./routes/admin.js').then(module => {
  const adminRouter = module.default;
  app.use('/api/admin', adminRouter);
  
  app.listen(3999, () => {
    console.log('Test server on port 3999');
    console.log('Test with: curl -X POST http://localhost:3999/api/admin/login -H "Content-Type: application/json" -d \'{"username":"test","password":"test"}\'');
  });
}).catch(e => {
  console.error('Error:', e);
});
