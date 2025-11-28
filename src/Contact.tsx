import { useState } from 'react'
import './Dashboard.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="dashboard-main">
      <div className="dashboard-content">
        <div className="content-header">
          <h1>İletişim</h1>
          <p>Bizimle iletişime geçin</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="chart-card">
            <h2>📝 İletişim Formu</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1em'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1em'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1em'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>
                  Konu *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1em'
                  }}
                >
                  <option value="">Seçiniz</option>
                  <option value="demo">Demo Talebi</option>
                  <option value="pricing">Fiyat Bilgisi</option>
                  <option value="support">Teknik Destek</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>
                  Mesajınız *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1em',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1.1em',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Gönder
              </button>
            </form>
          </div>

          <div>
            <div className="chart-card" style={{ marginBottom: '24px' }}>
              <h2>📍 İletişim Bilgileri</h2>
              <div style={{ marginTop: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '1.5em', marginBottom: '8px' }}>📧</div>
                  <strong>E-posta</strong>
                  <p style={{ opacity: 0.8 }}>info@teampro.com</p>
                  <p style={{ opacity: 0.8 }}>destek@teampro.com</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '1.5em', marginBottom: '8px' }}>📞</div>
                  <strong>Telefon</strong>
                  <p style={{ opacity: 0.8 }}>+90 535 525 1632</p>
                  <p style={{ opacity: 0.8 }}>+90 212 555 0000</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '1.5em', marginBottom: '8px' }}>📍</div>
                  <strong>Adres</strong>
                  <p style={{ opacity: 0.8 }}>
                    Maslak Mahallesi<br />
                    Büyükdere Caddesi No: 123<br />
                    Sarıyer / İstanbul
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '1.5em', marginBottom: '8px' }}>⏰</div>
                  <strong>Çalışma Saatleri</strong>
                  <p style={{ opacity: 0.8 }}>
                    Pazartesi - Cuma: 09:00 - 18:00<br />
                    Cumartesi: 10:00 - 16:00<br />
                    Pazar: Kapalı
                  </p>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>🌐 Sosyal Medya</h3>
              <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button style={{
                  padding: '12px 24px',
                  background: 'rgba(102, 126, 234, 0.2)',
                  border: '1px solid #667eea',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}>
                  LinkedIn
                </button>
                <button style={{
                  padding: '12px 24px',
                  background: 'rgba(102, 126, 234, 0.2)',
                  border: '1px solid #667eea',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}>
                  Twitter
                </button>
                <button style={{
                  padding: '12px 24px',
                  background: 'rgba(102, 126, 234, 0.2)',
                  border: '1px solid #667eea',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}>
                  Instagram
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

