import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { HiChat } from 'react-icons/hi';

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // For now, show placeholder
    // In real implementation, fetch from API
    setLoading(false);
    setChats([]);
  }, []);

  if (loading) {
    return (
      <div className="container-sm py-4">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-sm py-4">
      <h2 className="mb-4">Messages</h2>

      {error && (
        <div className="alert alert-error mb-3">
          {error}
        </div>
      )}

      {chats.length === 0 ? (
        <div className="paper p-4 text-center">
          <HiChat size={48} style={{ color: '#6c757d', marginBottom: '16px' }} />
          <p className="text-muted">No messages yet. Start a conversation with other travelers!</p>
          <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '8px' }}>
            Visit traveler profiles to send them a message.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chats.map((chat) => (
            <div key={chat.id} className="paper p-4" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#e63946',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {chat.participantName?.charAt(0) || 'U'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>{chat.participantName || 'User'}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                    {chat.lastMessage || 'No messages yet'}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                  {chat.lastMessageTime || ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;

