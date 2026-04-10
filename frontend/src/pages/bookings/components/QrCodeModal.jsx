import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QrCodeModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  // Data for the QR code: a JSON string with essential verification info
  const qrData = JSON.stringify({
    bookingId: booking.id,
    resource: booking.resourceName,
    user: booking.userName,
    date: new Date(booking.startTime).toLocaleDateString(),
    type: 'SMART_CAMPUS_CHECKIN'
  });

  return (
    <div className="qr-modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="qr-modal-content" onClick={e => e.stopPropagation()} style={{
        background: 'white', padding: '32px', borderRadius: '24px',
        maxWidth: '400px', width: '90%', textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'modalSlideUp 0.3s ease-out'
      }}>
        <h2 style={{ marginBottom: '8px', color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>Check-in QR Code</h2>
        <p style={{ marginBottom: '24px', color: '#64748b', fontSize: '0.925rem', lineHeight: 1.5 }}>
          Present this code to the facility administrator for arrival verification.
        </p>
        
        <div style={{ 
          background: '#ffffff', padding: '20px', borderRadius: '20px', 
          display: 'inline-block', marginBottom: '24px',
          border: '2px solid #f1f5f9',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <QRCodeSVG 
            value={qrData}
            size={220}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "https://vignette.wikia.nocookie.net/logopedia/images/d/d7/Placeholder_logo.png",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        <div style={{ textAlign: 'left', marginBottom: '24px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking Reference</p>
            <p style={{ margin: '0', fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>#BK-{booking.id.toString().padStart(5, '0')}</p>
          </div>
          
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduled Resource</p>
            <p style={{ margin: '0', fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>{booking.resourceName}</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '100%', padding: '14px', borderRadius: '14px',
            background: '#0f172a', color: 'white', border: 'none',
            fontSize: '1rem', fontWeight: 700, cursor: 'pointer', 
            transition: 'all 0.2s',
            boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)'
          }}
          onMouseOver={(e) => e.target.style.background = '#1e293b'}
          onMouseOut={(e) => e.target.style.background = '#0f172a'}
        >
          Close
        </button>

        <style>{`
          @keyframes modalSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default QrCodeModal;
