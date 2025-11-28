import './Home.css'
import SuiConnectButton from './SuiConnectButton'

function Home() {

	

  return (
    <div className="home-container">
      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <h1>Personel Takip Sistemi</h1>
          <p className="hero-subtitle">Kartlı giriş sistemi ile çalışan aktivitelerini izleyin, verimlilik analizleri yapın</p>
          
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">🔐</div>
              <h3>Kartlı Giriş</h3>
              <p>RFID kart okuyucu ile hızlı ve güvenli personel giriş-çıkış takibi</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">⏱️</div>
              <h3>Zaman Takibi</h3>
              <p>Detaylı çalışma saatleri, mesai ve aktif süre analizi</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📊</div>
              <h3>Gerçek Zamanlı Raporlar</h3>
              <p>Anlık personel durumu, departman bazlı istatistikler ve grafikler</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📈</div>
              <h3>Verimlilik Analizi</h3>
              <p>Bireysel ve takım performans metrikleri, hedef takibi</p>
            </div>
          </div>

          <div className="cta-section">
            <p className="cta-text">Sisteme erişmek için Sui cüzdanınızı bağlayın</p>
            <div className="cta-button">
              <SuiConnectButton />
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Sistem Özellikleri</h2>
          <div className="info-grid">
            <div className="info-card">
              <h4>🎯 Kapsamlı Takip</h4>
              <ul>
                <li>Kart basma ile otomatik giriş kaydı</li>
                <li>Gerçek zamanlı lokasyon bilgisi</li>
                <li>Departman bazlı aktivite izleme</li>
                <li>Haftalık ve aylık çalışma raporları</li>
              </ul>
            </div>
            <div className="info-card">
              <h4>📱 Kolay Yönetim</h4>
              <ul>
                <li>Web tabanlı yönetim paneli</li>
                <li>Mobil uyumlu arayüz</li>
                <li>Otomatik bildirimler</li>
                <li>Esnek rapor çıktıları</li>
              </ul>
            </div>
            <div className="info-card">
              <h4>🔒 Güvenlik</h4>
              <ul>
                <li>Blockchain tabanlı veri güvenliği</li>
                <li>Sui ağı entegrasyonu</li>
                <li>Şifreli veri aktarımı</li>
                <li>Yetkilendirme sistemi</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
