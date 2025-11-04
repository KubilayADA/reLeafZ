import React from 'react';

const ComingSoon: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '60px 40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '10px',
          color: '#667eea',
          fontWeight: 'bold'
        }}>
          🌿 ReLeafZ
        </h1>
        
        <h2 style={{
          fontSize: '24px',
          marginBottom: '20px',
          color: '#333'
        }}>
          Coming Soon
        </h2>
        
        <p style={{
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.6'
        }}>
          We're working hard to bring you something amazing.
          <br />
          Stay tuned!
        </p>
      </div>
      
      <p style={{
        marginTop: '30px',
        color: 'white',
        fontSize: '14px'
      }}>
        © 2025 ReLeafZ
      </p>
    </div>
  );
};

export default ComingSoon;