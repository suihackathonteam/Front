import React from 'react'
import './MobileConnectModal.css'

interface Props {
  open: boolean
  onClose: () => void
}

const MobileConnectModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null

  const currentUrl = window.location.href
  const encodedUrl = encodeURIComponent(currentUrl)
  // Include dapp URL explicitly to allow Slush to open the URL in its in-app browser and trigger connect
  const slushWalletUrl = `https://my.slush.app/Welcome?dapp=${encodedUrl}&connect=true&from=mobil`

  const openSlushWallet = () => {
    window.location.href = slushWalletUrl
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      alert('URL copied! Paste into Slush Wallet browser.')
    } catch (e) {
      alert('Copy failed: ' + currentUrl)
    }
  }

  return (
    <div className="mc-modal-overlay" role="dialog" aria-modal="true">
      <div className="mc-modal">
        <button className="mc-modal-close" onClick={onClose} aria-label="Close">×</button>
        <h3>Connect with Slush Wallet</h3>
        <p>Open Slush Wallet and connect; then return to this page.</p>

        <div className="mc-actions">
          <button onClick={openSlushWallet} className="mc-btn mc-btn-primary">
            🚀 Open in Slush Wallet (Auto)
          </button>
          <button onClick={copyUrl} className="mc-btn">
            📋 Copy URL
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>Or scan the QR code with the Slush app's QR scanner:</p>
          <img
            src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(currentUrl)}`}
            alt="Open in Slush QR"
            style={{ width: 180, height: 180, borderRadius: 12 }}
          />
        </div>

        <p className="mc-hint">
          Alternative: open this URL in Slush Wallet's internal browser: <br />
          <code style={{fontSize: '0.85em', wordBreak: 'break-all'}}>{window.location.href}</code>
        </p>
      </div>
    </div>
  )
}

export default MobileConnectModal
