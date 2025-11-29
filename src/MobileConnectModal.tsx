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
      alert('URL kopyalandı! Slush Wallet tarayıcısına yapıştırın.')
    } catch (e) {
      alert('Kopyalama başarısız: ' + currentUrl)
    }
  }

  return (
    <div className="mc-modal-overlay" role="dialog" aria-modal="true">
      <div className="mc-modal">
        <button className="mc-modal-close" onClick={onClose} aria-label="Kapat">×</button>
        <h3>Slush Wallet'a Bağlan</h3>
        <p>
          Slush Wallet'ta giriş yapın ve ardından bu sayfaya geri dönün.
        </p>

        <div className="mc-actions">
          <button onClick={openSlushWallet} className="mc-btn mc-btn-primary">
            🚀 Slush Wallet'ta Aç (Otomatik)
          </button>
          <button onClick={copyUrl} className="mc-btn">
            📋 URL'yi Kopyala
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>Veya QR kodunu Slush uygulamasındaki QR tarayıcı ile tara:</p>
          <img
            src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(currentUrl)}`}
            alt="Open in Slush QR"
            style={{ width: 180, height: 180, borderRadius: 12 }}
          />
        </div>

        <p className="mc-hint">
          Alternatif: Slush Wallet'ın dahili tarayıcısında bu URL'yi açın: <br />
          <code style={{fontSize: '0.85em', wordBreak: 'break-all'}}>{window.location.href}</code>
        </p>
      </div>
    </div>
  )
}

export default MobileConnectModal
