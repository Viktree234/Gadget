import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();

    res.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      contact
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all contact messages (admin endpoint)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

