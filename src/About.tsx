import './Dashboard.css'

function About() {
  return (
    <div className="dashboard-main">
      <div className="dashboard-content">
        <div className="content-header">
          <h1>Hakkımızda</h1>
          <p>TeamPro Personel Takip Sistemi</p>
        </div>

        <div className="info-section">
          <div className="chart-card full-width">
            <h2>🏢 Şirket Hakkında</h2>
            <p style={{ lineHeight: '1.8', fontSize: '1.1em' }}>
              TeamPro, modern işletmelerin personel takibi ve verimlilik yönetimi ihtiyaçlarına 
              blockchain teknolojisi ile güvenli çözümler sunan yenilikçi bir platformdur. 
              2025 yılında kurulan şirketimiz, Sui blockchain altyapısını kullanarak 
              işletmelere güvenilir ve şeffaf bir takip sistemi sağlamaktadır.
            </p>
          </div>
			<br />
          <div className="info-grid">
            <div className="info-card">
              <h3>🎯 Misyonumuz</h3>
              <p>
                İşletmelerin personel yönetimini dijitalleştirerek, verimliliği artırmak 
                ve iş süreçlerini optimize etmek. Blockchain teknolojisi ile güvenli, 
                şeffaf ve değiştirilemez kayıtlar tutmak.
              </p>
            </div>
            <div className="info-card">
              <h3>👁️ Vizyonumuz</h3>
              <p>
                Türkiye'nin en çok tercih edilen personel takip ve verimlilik yönetim 
                platformu olmak. Web3 teknolojileri ile iş dünyasına yenilikçi çözümler 
                sunmak.
              </p>
            </div>

            <div className="info-card">
              <h3>💎 Değerlerimiz</h3>
              <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                <li>Güvenilirlik ve Şeffaflık</li>
                <li>Yenilikçilik ve Teknoloji</li>
                <li>Müşteri Memnuniyeti</li>
                <li>Veri Güvenliği</li>
              </ul>
            </div>
          </div>
			<br />
          <div className="chart-card full-width">
            <h3>🏆 Neden TeamPro?</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🔐</div>
                <div className="stat-info">
                  <h3 className="stat-value">Blockchain</h3>
                  <p className="stat-title">Güvenli Altyapı</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <h3 className="stat-value">Gerçek Zamanlı</h3>
                  <p className="stat-title">Anlık Takip</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3 className="stat-value">Detaylı Analiz</h3>
                  <p className="stat-title">Raporlama</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎨</div>
                <div className="stat-info">
                  <h3 className="stat-value">Modern Arayüz</h3>
                  <p className="stat-title">Kullanıcı Dostu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
