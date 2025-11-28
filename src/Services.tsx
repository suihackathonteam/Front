import './Dashboard.css'

function Services() {
  const services = [
    { icon: '🔐', title: 'Kartlı Giriş Sistemi', description: 'RFID kart okuyucu ile hızlı ve güvenli personel giriş-çıkış takibi', features: ['Otomatik kayıt', 'Hızlı geçiş', 'Güvenli doğrulama', 'Çoklu kapı desteği'] },
    { icon: '⏱️', title: 'Zaman Yönetimi', description: 'Detaylı çalışma saatleri, mesai ve aktif süre analizi', features: ['Mesai takibi', 'Fazla mesai hesabı', 'İzin yönetimi', 'Vardiya planlama'] },
    { icon: '📊', title: 'Raporlama ve Analiz', description: 'Anlık personel durumu, departman bazlı istatistikler ve grafikler', features: ['Günlük raporlar', 'Haftalık analizler', 'Aylık özetler', 'Excel çıktıları'] },
    { icon: '📈', title: 'Verimlilik Takibi', description: 'Bireysel ve takım performans metrikleri, hedef takibi', features: ['KPI takibi', 'Hedef belirleme', 'Performans analizi', 'Karşılaştırmalar'] },
    { icon: '⚙️', title: 'Makine Yönetimi', description: 'Makine ve kaynak kullanım takibi, verimlilik analizi', features: ['Kullanım süreleri', 'Üretim takibi', 'Bakım planları', 'Verimlilik oranları'] },
    { icon: '🏆', title: 'Ödül Sistemi', description: 'Gamification ile çalışan motivasyonu artırma', features: ['Puan sistemi', 'Başarı rozetleri', 'Sıralama tablosu', 'Teşvik programı'] },
    { icon: '🔔', title: 'Bildirim Sistemi', description: 'Önemli olaylar için anında bildirimler', features: ['Giriş/Çıkış bildirimleri', 'Mesai uyarıları', 'Hedef bildirimleri', 'Sistem uyarıları'] },
    { icon: '🌐', title: 'Web3 Entegrasyonu', description: 'Blockchain tabanlı güvenli veri yönetimi', features: ['Sui blockchain', 'Kripto cüzdan', 'Değiştirilemez kayıtlar', 'Akıllı sözleşmeler'] }
  ]

  return (
    <div className="dashboard-main">
      <div className="dashboard-content">
        <div className="content-header">
          <h1>Hizmetlerimiz</h1>
          <p>TeamPro ile sunduğumuz kapsamlı çözümler</p>
        </div>

        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
          {services.map((service, index) => (
            <div key={index} className="chart-card" style={{ padding: '24px', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '3em', marginBottom: '16px' }}>{service.icon}</div>
              <h3 style={{ marginBottom: '12px', color: '#667eea' }}>{service.title}</h3>
              <p style={{ marginBottom: '16px', lineHeight: '1.6', opacity: 0.8 }}>{service.description}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {service.features.map((feature, idx) => (
                  <li key={idx} style={{ padding: '8px 0', borderBottom: idx < service.features.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="chart-card full-width" style={{ marginTop: '32px' }}>
          <h2>📋 Paket Seçenekleri</h2>
          <div className="stats-grid">
            <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
              <h3 style={{ color: '#667eea' }}>Basic</h3>
              <div style={{ fontSize: '2em', margin: '16px 0' }}>₺999<span style={{ fontSize: '0.5em', opacity: 0.7 }}>/ay</span></div>
              <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                <li>✓ 50 Personel</li>
                <li>✓ Temel Raporlar</li>
                <li>✓ 3 Kapı Girişi</li>
                <li>✓ Email Destek</li>
              </ul>
            </div>

            <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px', border: '2px solid #667eea' }}>
              <h3 style={{ color: '#667eea' }}>Pro ⭐</h3>
              <div style={{ fontSize: '2em', margin: '16px 0' }}>₺1999<span style={{ fontSize: '0.5em', opacity: 0.7 }}>/ay</span></div>
              <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                <li>✓ 200 Personel</li>
                <li>✓ Tüm Raporlar</li>
                <li>✓ Sınırsız Kapı</li>
                <li>✓ Öncelikli Destek</li>
                <li>✓ Ödül Sistemi</li>
              </ul>
            </div>

            <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
              <h3 style={{ color: '#667eea' }}>Enterprise</h3>
              <div style={{ fontSize: '2em', margin: '16px 0' }}>Özel Fiyat</div>
              <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                <li>✓ Sınırsız Personel</li>
                <li>✓ Özel Entegrasyonlar</li>
                <li>✓ Özel Geliştirme</li>
                <li>✓ 7/24 Destek</li>
                <li>✓ Eğitim & Danışmanlık</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
