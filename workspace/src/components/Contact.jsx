import { useState } from 'react';
import api from '../services/api';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setMessage('Please fill in all fields');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setLoading(true);
      const response = await api.submitContact(formData);
      if (response.success) {
        setMessage('Thank you! Your message has been sent. We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      setMessage('Failed to send message. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'support@gadget-store.com';
  const contactPhone = import.meta.env.VITE_CONTACT_PHONE || '+1 (555) 123-4567';

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            
            <div className="contact-details">
              <div className="contact-detail-item">
                <strong>Email:</strong>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
              
              <div className="contact-detail-item">
                <strong>Phone:</strong>
                <a href={`tel:${contactPhone}`}>{contactPhone}</a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {message && (
              <div className={`form-message ${message.includes('Thank you') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;

