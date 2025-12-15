import React, { useState } from 'react';
import { 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiClock 
} from 'react-icons/hi';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaFacebook 
} from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: HiMail,
      title: 'Email',
      value: 'info@travelpass.com',
      link: 'mailto:info@travelpass.com',
      color: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)'
    },
    {
      icon: HiPhone,
      title: 'Phone',
      value: '+995 32 2 XX XX XX',
      link: 'tel:+995322XXXXXX',
      color: 'linear-gradient(135deg, #457b9d 0%, #1d3557 100%)'
    },
    {
      icon: HiLocationMarker,
      title: 'Address',
      value: 'Tbilisi, Georgia',
      link: null,
      color: 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)'
    },
    {
      icon: HiClock,
      title: 'Business Hours',
      value: 'Mon - Fri: 9:00 AM - 6:00 PM',
      link: null,
      color: 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)'
    }
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="hero-section-mobile" style={{ 
        padding: '120px 24px 80px',
        background: 'linear-gradient(135deg, #e63946 0%, #457b9d 50%, #06d6a0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0
        }}></div>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            lineHeight: '1.2', 
            marginBottom: '24px',
            color: 'white',
            letterSpacing: '-1px',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)'
          }}>
            Get In Touch
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'white', 
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px',
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'
          }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="contact-form-grid-mobile" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'start'
          }}>
            {/* Contact Form */}
            <div>
              <h2 style={{
                fontSize: '2.25rem',
                fontWeight: '800',
                marginBottom: '32px',
                color: '#1d3557'
              }}>
                Send us a Message
              </h2>
              {submitted ? (
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.1) 0%, rgba(17, 138, 178, 0.1) 100%)',
                  border: '2px solid #06d6a0',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '1.125rem',
                    color: '#06d6a0',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    ✓ Thank you! Your message has been sent successfully.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="What is this regarding?"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="form-input"
                      placeholder="Your message..."
                      style={{
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-contained btn-large"
                    style={{
                      background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                      color: 'white',
                      width: '100%'
                    }}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 style={{
                fontSize: '2.25rem',
                fontWeight: '800',
                marginBottom: '32px',
                color: '#1d3557'
              }}>
                Contact Information
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                marginBottom: '48px'
              }}>
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      padding: '24px',
                      borderRadius: '16px',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(29, 53, 87, 0.08)',
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(29, 53, 87, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.08)';
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      background: info.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      flexShrink: 0,
                      color: 'white'
                    }}>
                      {React.createElement(info.icon, { size: 28 })}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        marginBottom: '8px',
                        color: '#1d3557'
                      }}>
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          style={{
                            fontSize: '1rem',
                            color: '#457b9d',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#e63946';
                            e.target.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#457b9d';
                            e.target.style.textDecoration = 'none';
                          }}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p style={{
                          fontSize: '1rem',
                          color: '#457b9d',
                          margin: 0
                        }}>
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  color: '#1d3557'
                }}>
                  Follow Us
                </h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {[
                    { Icon: FaTwitter, name: 'Twitter' },
                    { Icon: FaLinkedin, name: 'LinkedIn' },
                    { Icon: FaInstagram, name: 'Instagram' },
                    { Icon: FaFacebook, name: 'Facebook' }
                  ].map(({ Icon, name }, idx) => (
                    <button
                      key={idx}
                      type="button"
                      title={name}
                      onClick={(e) => {
                        e.preventDefault();
                        // Social media links would go here
                      }}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(230, 57, 70, 0.2)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(230, 57, 70, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 57, 70, 0.2)';
                      }}
                    >
                      <Icon size={24} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{
        padding: '0 24px 80px'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(29, 53, 87, 0.12)',
            height: '400px',
            background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(69, 123, 157, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: '#457b9d'
          }}>
            🗺️ Map Placeholder
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

