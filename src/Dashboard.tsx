import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Dashboard.css'
import { useCurrentAccount } from '@mysten/dapp-kit'
import SuiConnectButton from './SuiConnectButton'

// Örnek veri setleri
const doorAccessData = [
  { time: '08:00', girisler: 12, cikislar: 2 },
  { time: '09:00', girisler: 8, cikislar: 1 },
  { time: '12:00', girisler: 5, cikislar: 8 },
  { time: '13:00', girisler: 7, cikislar: 3 },
  { time: '17:00', girisler: 3, cikislar: 15 },
  { time: '18:00', girisler: 1, cikislar: 12 },
]

const machineUsageData = [
  { makine: 'CNC-001', kullanim: 8.5, urun: 245, verim: 92 },
  { makine: 'CNC-002', kullanim: 7.8, urun: 210, verim: 88 },
  { makine: 'Pres-001', kullanim: 6.5, urun: 180, verim: 85 },
  { makine: 'Kesim-001', kullanim: 8.2, urun: 320, verim: 95 },
  { makine: 'Paket-001', kullanim: 7.5, urun: 450, verim: 90 },
]

const employeeProductivity = [
  { name: 'Ahmet Y.', makine: 'CNC-001', sure: 8.2, urun: 125, verim: 94 },
  { name: 'Ayşe K.', makine: 'Kesim-001', sure: 7.8, urun: 156, verim: 92 },
  { name: 'Mehmet D.', makine: 'CNC-002', sure: 8.5, urun: 118, verim: 88 },
  { name: 'Zeynep A.', makine: 'Paket-001', sure: 7.5, urun: 220, verim: 96 },
  { name: 'Can S.', makine: 'Pres-001', sure: 6.8, urun: 95, verim: 85 },
]

const employeeAwards = [
  { 
    id: 1, 
    calisan: 'Ayşe Kaya', 
    odul: '🏆 Ayın Çalışanı', 
    tarih: '28.11.2025', 
    aciklama: 'En yüksek üretim performansı',
    puan: 100
  },
  { 
    id: 2, 
    calisan: 'Mehmet Demir', 
    odul: '⭐ Verimlilik Yıldızı', 
    tarih: '25.11.2025', 
    aciklama: 'Fire oranı %0.5 altında',
    puan: 75
  },
  { 
    id: 3, 
    calisan: 'Zeynep Aydın', 
    odul: '🎯 Hedef Şampiyonu', 
    tarih: '20.11.2025', 
    aciklama: 'Aylık hedefi %120 tamamlama',
    puan: 85
  },
  { 
    id: 4, 
    calisan: 'Ahmet Yılmaz', 
    odul: '💎 Kalite Ödülü', 
    tarih: '15.11.2025', 
    aciklama: 'Hatasız üretim - 30 gün',
    puan: 90
  },
]

const realtimeStats = [
  { icon: '🚪', title: 'Aktif Personel', value: '47', change: '+3', color: '#667eea' },
  { icon: '⚙️', title: 'Çalışan Makine', value: '12/15', change: '80%', color: '#764ba2' },
  { icon: '📦', title: 'Günlük Üretim', value: '1,245', change: '+125', color: '#f093fb' },
  { icon: '🎯', title: 'Verimlilik', value: '91%', change: '+3%', color: '#4facfe' },
]

function Dashboard() {
  const [selectedView, setSelectedView] = useState('overview')
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

    const currentAccount = useCurrentAccount()

	  if(!currentAccount){

		return (
			<div className="home-container">
				<div className="cta-section">
					<p className="cta-text">Sisteme erişmek için Sui cüzdanınızı bağlayın</p>
					<div className="cta-button">
						<SuiConnectButton />
					</div>
				</div>
			</div>
		)
	}

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Sistem Takip Paneli</h1>
              <p>Personel giriş-çıkış ve aktivite takibi</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className={selectedView === 'overview' ? 'nav-active' : ''} onClick={() => setSelectedView('overview')}>📊 Genel</button>
              <button className={selectedView === 'doors' ? 'nav-active' : ''} onClick={() => setSelectedView('doors')}>🚪 Kapılar</button>
              <button className={selectedView === 'machines' ? 'nav-active' : ''} onClick={() => setSelectedView('machines')}>⚙️ Makineler</button>
              <button className={selectedView === 'employees' ? 'nav-active' : ''} onClick={() => setSelectedView('employees')}>👥 Çalışanlar</button>
              <button className={selectedView === 'awards' ? 'nav-active' : ''} onClick={() => setSelectedView('awards')}>🏆 Ödüller</button>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="stats-grid">
            {realtimeStats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {stat.change} bugün
                  </span>
                </div>
              </div>
            ))}
          </div>

          {selectedView === 'overview' && (
            <>
              {/* Charts Section */}
              <div className="charts-section">
                <div className="chart-card">
                  <h3>Saatlik Kapı Geçiş Analizi</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={doorAccessData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                      <XAxis dataKey="time" stroke="#b8b8b8" />
                      <YAxis stroke="#b8b8b8" />
                      <Tooltip 
                        contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="girisler" stroke="#667eea" strokeWidth={2} name="Giriş" />
                      <Line type="monotone" dataKey="cikislar" stroke="#764ba2" strokeWidth={2} name="Çıkış" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Makine Kullanım Verimliliği</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={machineUsageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                      <XAxis dataKey="makine" stroke="#b8b8b8" />
                      <YAxis stroke="#b8b8b8" />
                      <Tooltip 
                        contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="verim" fill="#667eea" name="Verimlilik %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card full-width">
                <h3>Çalışan Üretim Performansı</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={employeeProductivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis dataKey="name" stroke="#b8b8b8" />
                    <YAxis stroke="#b8b8b8" />
                    <Tooltip 
                      contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="urun" fill="#667eea" name="Üretilen Ürün" />
                    <Bar dataKey="verim" fill="#764ba2" name="Verimlilik %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {selectedView === 'doors' && (
            <div className="doors-section">
              <div className="section-header">
                <h2>Kapı Geçiş Takibi</h2>
                <button className="add-btn">+ Yeni Kayıt</button>
              </div>
              
              <div className="chart-card">
                <h3>Bugünkü Geçiş Hareketleri</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={doorAccessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis dataKey="time" stroke="#b8b8b8" />
                    <YAxis stroke="#b8b8b8" />
                    <Tooltip 
                      contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="girisler" stroke="#43e97b" strokeWidth={2} name="Giriş" />
                    <Line type="monotone" dataKey="cikislar" stroke="#ff6b6b" strokeWidth={2} name="Çıkış" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="door-table">
                <h3>Son Kapı Geçişleri</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Çalışan</th>
                      <th>Kapı</th>
                      <th>Zaman</th>
                      <th>Tür</th>
                      <th>Kart No</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ahmet Yılmaz</td>
                      <td>Ana Giriş</td>
                      <td>08:15:23</td>
                      <td><span className="badge giris">Giriş</span></td>
                      <td>KART-1001</td>
                    </tr>
                    <tr>
                      <td>Ayşe Kaya</td>
                      <td>Üretim Kapısı</td>
                      <td>08:22:45</td>
                      <td><span className="badge giris">Giriş</span></td>
                      <td>KART-1002</td>
                    </tr>
                    <tr>
                      <td>Mehmet Demir</td>
                      <td>Depo Kapısı</td>
                      <td>12:05:12</td>
                      <td><span className="badge cikis">Çıkış</span></td>
                      <td>KART-1003</td>
                    </tr>
                    <tr>
                      <td>Zeynep Aydın</td>
                      <td>Ana Giriş</td>
                      <td>12:58:34</td>
                      <td><span className="badge giris">Giriş</span></td>
                      <td>KART-1004</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedView === 'machines' && (
            <div className="machines-section">
              <div className="section-header">
                <h2>Makine/Kaynak Kullanım Takibi</h2>
                <button className="add-btn">+ Yeni Makine/Kaynak</button>
              </div>

              <div className="machine-stats-grid">
                {machineUsageData.map((machine, index) => (
                  <div key={index} className="machine-card">
                    <div className="machine-header">
                      <h3>{machine.makine}</h3>
                      <span className={`machine-status ${machine.kullanim > 7 ? 'active' : 'idle'}`}>
                        {machine.kullanim > 7 ? '● Aktif' : '○ Boşta'}
                      </span>
                    </div>
                    <div className="machine-stats">
                      <div className="stat">
                        <span className="label">Kullanım Süresi</span>
                        <span className="value">{machine.kullanim}h</span>
                      </div>
                      <div className="stat">
                        <span className="label">Üretilen</span>
                        <span className="value">{machine.urun} adet</span>
                      </div>
                      <div className="stat">
                        <span className="label">Verimlilik</span>
                        <span className="value">{machine.verim}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${machine.verim}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chart-card full-width">
                <h3>Makine Bazlı Detaylı Analiz</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={machineUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis dataKey="makine" stroke="#b8b8b8" />
                    <YAxis stroke="#b8b8b8" />
                    <Tooltip 
                      contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="kullanim" fill="#667eea" name="Kullanım (saat)" />
                    <Bar dataKey="urun" fill="#764ba2" name="Üretim (adet)" />
                    <Bar dataKey="verim" fill="#f093fb" name="Verimlilik %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedView === 'employees' && (
            <div className="employees-section">
              <div className="section-header">
                <h2>Çalışan Detaylı Takip</h2>
                <button className="add-btn">+ Yeni Çalışan</button>
              </div>
              
              <div className="employee-table">
                <table>
                  <thead>
                    <tr>
                      <th>Çalışan</th>
                      <th>Makine/Kaynak</th>
                      <th>Giriş</th>
                      <th>Çıkış</th>
                      <th>Kullanım Süresi</th>
                      <th>Üretim</th>
                      <th>Verimlilik</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeProductivity.map((emp, index) => (
                      <tr key={index} onClick={() => setSelectedEmployee(emp.name)} style={{ cursor: 'pointer' }}>
                        <td><span className="employee-name">👤 {emp.name}</span></td>
                        <td>{emp.makine}</td>
                        <td>08:15</td>
                        <td>16:30</td>
                        <td>{emp.sure}h</td>
                        <td>{emp.urun} adet</td>
                        <td>
                          <span className={`verimlilik-badge ${emp.verim >= 90 ? 'high' : 'medium'}`}>
                            {emp.verim}%
                          </span>
                        </td>
                        <td><span className="status active">Aktif</span></td>
                      </tr>
                    ))}
                    <tr>
                      <td><span className="employee-name">👤 Ali Veli</span></td>
                      <td>Manuel İş</td>
                      <td>09:00</td>
                      <td>17:30</td>
                      <td>7.2h</td>
                      <td>-</td>
                      <td><span className="verimlilik-badge medium">82%</span></td>
                      <td><span className="status offline">Çıktı</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {selectedEmployee && (
                <div className="employee-detail">
                  <h3>📊 {selectedEmployee} - Detaylı Rapor</h3>
                  <div className="detail-grid">
                    <div className="detail-card">
                      <h4>Kapı Geçişleri</h4>
                      <ul>
                        <li>Ana Giriş: 08:15:23</li>
                        <li>Üretim Alanı: 08:22:15</li>
                        <li>Yemekhane: 12:30:45</li>
                        <li>Üretim Alanı: 13:15:20</li>
                      </ul>
                    </div>
                    <div className="detail-card">
                      <h4>Kullanılan Kaynaklar</h4>
                      <ul>
                        <li>CNC Makinesi: 6.5 saat</li>
                        <li>Ölçüm Aleti: 45 dakika</li>
                        <li>Paketleme: 1.2 saat</li>
                      </ul>
                    </div>
                    <div className="detail-card">
                      <h4>Üretim Detayı</h4>
                      <ul>
                        <li>Toplam Üretim: 125 adet</li>
                        <li>Hatalı: 3 adet (%2.4)</li>
                        <li>Kalite Skoru: 97.6/100</li>
                      </ul>
                    </div>
                  </div>
                  <button className="close-detail" onClick={() => setSelectedEmployee(null)}>Kapat</button>
                </div>
              )}
            </div>
          )}

          {selectedView === 'awards' && (
            <div className="awards-section">
              <div className="section-header">
                <h2>Ödüller ve Başarılar</h2>
                <button className="add-btn">+ Yeni Ödül Ver</button>
              </div>

              <div className="awards-grid">
                {employeeAwards.map((award) => (
                  <div key={award.id} className="award-card">
                    <div className="award-badge">
                      <span className="award-icon">{award.odul.split(' ')[0]}</span>
                      <span className="award-points">+{award.puan} puan</span>
                    </div>
                    <h3>{award.odul.split(' ').slice(1).join(' ')}</h3>
                    <p className="award-employee">🎖️ {award.calisan}</p>
                    <p className="award-description">{award.aciklama}</p>
                    <p className="award-date">📅 {award.tarih}</p>
                  </div>
                ))}
              </div>

              <div className="leaderboard">
                <h3>🏆 Puan Sıralaması</h3>
                <div className="leaderboard-list">
                  <div className="leaderboard-item gold">
                    <span className="rank">1</span>
                    <span className="name">Ayşe Kaya</span>
                    <span className="score">275 puan</span>
                  </div>
                  <div className="leaderboard-item silver">
                    <span className="rank">2</span>
                    <span className="name">Ahmet Yılmaz</span>
                    <span className="score">240 puan</span>
                  </div>
                  <div className="leaderboard-item bronze">
                    <span className="rank">3</span>
                    <span className="name">Zeynep Aydın</span>
                    <span className="score">210 puan</span>
                  </div>
                  <div className="leaderboard-item">
                    <span className="rank">4</span>
                    <span className="name">Mehmet Demir</span>
                    <span className="score">185 puan</span>
                  </div>
                  <div className="leaderboard-item">
                    <span className="rank">5</span>
                    <span className="name">Can Söz</span>
                    <span className="score">150 puan</span>
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>
      </main>

      {/* Dashboard Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2025 TeamPro. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}

export default Dashboard
