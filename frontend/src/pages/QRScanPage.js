import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TasteFeedbackModal from '../components/TasteFeedbackModal';

const QRScanPage = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentStamp, setCurrentStamp] = useState(null);

  useEffect(() => {
    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [html5QrCode]);

  const startScanning = async () => {
    try {
      setError('');
      setResult(null);
      const qrCode = new Html5Qrcode('reader');
      setHtml5QrCode(qrCode);

      await qrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          await handleScan(decodedText);
        },
        (errorMessage) => {
          // Ignore scanning errors
        }
      );

      setScanning(true);
    } catch (err) {
      setError('Failed to start camera. Please ensure camera permissions are granted.');
      console.error(err);
    }
  };

  const stopScanning = async () => {
    if (html5QrCode) {
      try {
        await html5QrCode.stop();
        html5QrCode.clear();
      } catch (err) {
        console.error(err);
      }
    }
    setScanning(false);
    setHtml5QrCode(null);
  };

  const handleScan = async (qrCode) => {
    stopScanning();

    try {
      // Get user's current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const response = await api.post('/stamps/scan', {
        qrCode,
        location: {
          coordinates: [position.coords.longitude, position.coords.latitude],
        },
      });

      const scanResult = response.data.data;
      setResult(scanResult);
      
      // Show Taste Memory™ feedback modal if stamp was created
      if (scanResult.stamp && scanResult.stamp.id) {
        setCurrentStamp({
          id: scanResult.stamp.id,
          dishName: scanResult.stamp.dishName || scanResult.stamp.venue?.name,
          venueName: scanResult.stamp.venue?.name
        });
        setShowFeedbackModal(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to process QR code scan'
      );
    }
  };

  return (
    <div className="container-sm py-4">
      <h4 className="text-center mb-3">Scan QR Code</h4>

      {error && (
        <div className="alert alert-error mb-2">
          {error}
        </div>
      )}

      {result && (
        <div className="alert alert-success mb-2">
          <h6>Stamp Collected!</h6>
          <p style={{ margin: '4px 0', fontSize: '0.875rem' }}>
            Venue: {result.stamp.venue.name}
          </p>
          {result.xpGained > 0 && (
            <p style={{ margin: '4px 0', fontSize: '0.875rem' }}>XP Gained: {result.xpGained}</p>
          )}
          {result.rewardsUnlocked.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                Rewards Unlocked:
              </p>
              {result.rewardsUnlocked.map((reward, idx) => (
                <p key={idx} style={{ margin: '4px 0', fontSize: '0.875rem' }}>
                  - {reward.value}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="paper text-center">
        <div
          id="reader"
          style={{
            width: '100%',
            minHeight: '300px',
            display: scanning ? 'block' : 'none',
            marginBottom: '16px',
          }}
        />

        {!scanning && (
          <div>
            <p className="text-secondary mb-2">
              Click the button below to start scanning QR codes at partner venues
            </p>
            <button
              className="btn btn-contained btn-large btn-full"
              onClick={startScanning}
            >
              Start Scanning
            </button>
          </div>
        )}

        {scanning && (
          <button
            className="btn btn-outlined btn-full"
            onClick={stopScanning}
            style={{ borderColor: '#c62828', color: '#c62828' }}
          >
            Stop Scanning
          </button>
        )}
      </div>

      {/* Taste Memory™ Feedback Modal */}
      {showFeedbackModal && currentStamp && (
        <TasteFeedbackModal
          stampId={currentStamp.id}
          dishName={currentStamp.dishName}
          venueName={currentStamp.venueName}
          onClose={() => {
            setShowFeedbackModal(false);
            setCurrentStamp(null);
          }}
          onSuccess={() => {
            console.log('Taste feedback saved successfully');
          }}
        />
      )}
    </div>
  );
};

export default QRScanPage;

