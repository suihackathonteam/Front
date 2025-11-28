import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useWorkerCard, useIdentityTransaction, useIdentityEvents } from './hooks/useIdentity'
import { 
  buildRecordDoorAccessTx, 
  buildRecordMachineUsageTx, 
  buildClockInOutTx 
} from './utils/transactions'
import { ACTION_TYPES } from './config/contracts'
import SuiConnectButton from './SuiConnectButton'
import './WorkerPanel.css'

function WorkerPanel() {
  const account = useCurrentAccount()
  const { workerCard, loading: cardLoading } = useWorkerCard()
  const { executeTransaction, isLoading: txLoading } = useIdentityTransaction()
  const { events: doorEvents } = useIdentityEvents('DoorAccessEvent')
  const { events: machineEvents } = useIdentityEvents('MachineUsageEvent')
  const { events: clockEvents } = useIdentityEvents('ClockEvent')
  
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'actions'>('info')

  // Door access form
  const [doorForm, setDoorForm] = useState({
    door_id: '',
    access_type: '2', // 2 = entry
  })

  // Machine usage form
  const [machineForm, setMachineForm] = useState({
    machine_id: '',
    usage_duration_hours: '',
    production_count: '',
    efficiency_percentage: '',
  })

  if (!account) {
    return (
      <div className="worker-container">
        <div className="worker-connect">
          <h2>👤 Çalışan Paneli</h2>
          <p>Panele erişmek için lütfen cüzdanınızı bağlayın</p>
          <SuiConnectButton />
        </div>
      </div>
    )
  }

  if (cardLoading) {
    return (
      <div className="worker-container">
        <div className="worker-loading">
          <div className="spinner"></div>
          <p>Worker Card kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  if (!workerCard) {
    return (
      <div className="worker-container">
        <div className="worker-no-card">
          <h2>⚠️ Worker Card Bulunamadı</h2>
          <p>Bu adres için henüz bir Worker Card oluşturulmamış.</p>
          <p className="address-info">Bağlı adres: <code>{account.address}</code></p>
          <p>Lütfen sistem yöneticisinden bir Worker Card talep edin.</p>
        </div>
      </div>
    )
  }

  // Card inactive ise uyarı göster
  if (!workerCard.is_active) {
    return (
      <div className="worker-container">
        <div className="worker-no-card">
          <h2>🚫 Worker Card Devre Dışı</h2>
          <p>Kartınız sistem yöneticisi tarafından devre dışı bırakılmış.</p>
          <p className="address-info">Bağlı adres: <code>{account.address}</code></p>
          <p>Daha fazla bilgi için sistem yöneticisi ile iletişime geçin.</p>
        </div>
      </div>
    )
  }

  // Clock In
  const handleClockIn = async () => {
    const tx = buildClockInOutTx(workerCard.id, ACTION_TYPES.CLOCK_IN)
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Clock Out
  const handleClockOut = async () => {
    const tx = buildClockInOutTx(workerCard.id, ACTION_TYPES.CLOCK_OUT)
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Door Access
  const handleDoorAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    const tx = buildRecordDoorAccessTx(
      workerCard.id,
      Number(doorForm.door_id),
      Number(doorForm.access_type)
    )
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setDoorForm({ door_id: '', access_type: '2' })
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Machine Usage
  const handleMachineUsage = async (e: React.FormEvent) => {
    e.preventDefault()
    const durationMs = Number(machineForm.usage_duration_hours) * 60 * 60 * 1000
    
    const tx = buildRecordMachineUsageTx(workerCard.id, {
      machine_id: Number(machineForm.machine_id),
      usage_duration_ms: durationMs,
      production_count: Number(machineForm.production_count),
      efficiency_percentage: Number(machineForm.efficiency_percentage),
    })
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setMachineForm({
          machine_id: '',
          usage_duration_hours: '',
          production_count: '',
          efficiency_percentage: '',
        })
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Format work hours
  const formatWorkHours = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}s ${minutes}d`
  }

  return (
    <div className="worker-container">
      <div className="worker-header">
        <div className="worker-title">
          <h1>👤 Çalışan Paneli</h1>
          <p>{workerCard.name} - {workerCard.department}</p>
        </div>
        <div className="quick-actions">
          <button className="clock-btn clock-in" onClick={handleClockIn} disabled={txLoading}>
            🕐 Mesai Başlat
          </button>
          <button className="clock-btn clock-out" onClick={handleClockOut} disabled={txLoading}>
            🕐 Mesai Bitir
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="success-banner">
          ✓ İşlem başarıyla kaydedildi!
        </div>
      )}

      <div className="worker-tabs">
        <button 
          className={activeTab === 'info' ? 'tab-active' : ''}
          onClick={() => setActiveTab('info')}
        >
          📋 Bilgilerim
        </button>
        <button 
          className={activeTab === 'activity' ? 'tab-active' : ''}
          onClick={() => setActiveTab('activity')}
        >
          📊 Aktiviteler
        </button>
        <button 
          className={activeTab === 'actions' ? 'tab-active' : ''}
          onClick={() => setActiveTab('actions')}
        >
          ⚡ İşlemler
        </button>
      </div>

      <div className="worker-content">
        {activeTab === 'info' && (
          <div className="info-grid">
            <div className="info-card">
              <h3>👤 Kişisel Bilgiler</h3>
              <div className="info-row">
                <span className="label">Kart No:</span>
                <span className="value">{workerCard.card_number}</span>
              </div>
              <div className="info-row">
                <span className="label">Ad Soyad:</span>
                <span className="value">{workerCard.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Departman:</span>
                <span className="value">{workerCard.department}</span>
              </div>
              <div className="info-row">
                <span className="label">Adres:</span>
                <span className="value address">
                  {workerCard.worker_address.slice(0, 8)}...{workerCard.worker_address.slice(-6)}
                </span>
              </div>
            </div>

            <div className="info-card">
              <h3>📊 İstatistikler</h3>
              <div className="stat-box">
                <span className="stat-icon">🕐</span>
                <div className="stat-details">
                  <span className="stat-label">Toplam Çalışma Saati</span>
                  <span className="stat-value">{formatWorkHours(workerCard.total_work_hours)}</span>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">📦</span>
                <div className="stat-details">
                  <span className="stat-label">Toplam Üretim</span>
                  <span className="stat-value">{workerCard.total_production} adet</span>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">⚡</span>
                <div className="stat-details">
                  <span className="stat-label">Verimlilik Skoru</span>
                  <span className="stat-value">{workerCard.efficiency_score}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-section">
            <div className="activity-card">
              <h3>🚪 Kapı Geçişleri</h3>
              <div className="activity-list">
                {doorEvents.length === 0 ? (
                  <p className="no-data">Henüz kapı geçişi kaydı yok</p>
                ) : (
                  doorEvents.slice(0, 10).map((event, i) => {
                    const data = event.parsedJson as any
                    return (
                      <div key={i} className="activity-item">
                        <span className="activity-icon">
                          {data.access_type === 2 ? '➡️' : '⬅️'}
                        </span>
                        <div className="activity-details">
                          <span className="activity-title">
                            {new TextDecoder().decode(new Uint8Array(data.door_name))}
                          </span>
                          <span className="activity-time">
                            {new Date(Number(data.timestamp_ms)).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <span className={`activity-badge ${data.access_type === 2 ? 'entry' : 'exit'}`}>
                          {data.access_type === 2 ? 'Giriş' : 'Çıkış'}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="activity-card">
              <h3>⚙️ Makine Kullanımı</h3>
              <div className="activity-list">
                {machineEvents.length === 0 ? (
                  <p className="no-data">Henüz makine kullanım kaydı yok</p>
                ) : (
                  machineEvents.slice(0, 10).map((event, i) => {
                    const data = event.parsedJson as any
                    return (
                      <div key={i} className="activity-item">
                        <span className="activity-icon">⚙️</span>
                        <div className="activity-details">
                          <span className="activity-title">
                            {new TextDecoder().decode(new Uint8Array(data.machine_name))}
                          </span>
                          <span className="activity-subtitle">
                            Üretim: {data.production_count} | Verim: {data.efficiency_percentage}%
                          </span>
                          <span className="activity-time">
                            {new Date(Number(data.timestamp_ms)).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="activity-card">
              <h3>🕐 Mesai Kayıtları</h3>
              <div className="activity-list">
                {clockEvents.length === 0 ? (
                  <p className="no-data">Henüz mesai kaydı yok</p>
                ) : (
                  clockEvents.slice(0, 10).map((event, i) => {
                    const data = event.parsedJson as any
                    return (
                      <div key={i} className="activity-item">
                        <span className="activity-icon">
                          {data.action_type === 0 ? '🕐' : '🏁'}
                        </span>
                        <div className="activity-details">
                          <span className="activity-title">
                            {data.action_type === 0 ? 'Mesai Başlangıcı' : 'Mesai Bitişi'}
                          </span>
                          <span className="activity-time">
                            {new Date(Number(data.timestamp_ms)).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="actions-grid">
            <div className="action-card">
              <h3>🚪 Kapı Geçişi Kaydet</h3>
              <form onSubmit={handleDoorAccess}>
                <div className="form-group">
                  <label>Kapı ID</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={doorForm.door_id}
                    onChange={(e) => setDoorForm({ ...doorForm, door_id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Geçiş Türü</label>
                  <select
                    value={doorForm.access_type}
                    onChange={(e) => setDoorForm({ ...doorForm, access_type: e.target.value })}
                  >
                    <option value="2">Giriş</option>
                    <option value="3">Çıkış</option>
                  </select>
                </div>
                <button type="submit" className="submit-btn" disabled={txLoading}>
                  {txLoading ? 'İşleniyor...' : 'Kaydet'}
                </button>
              </form>
            </div>

            <div className="action-card">
              <h3>⚙️ Makine Kullanımı Kaydet</h3>
              <form onSubmit={handleMachineUsage}>
                <div className="form-group">
                  <label>Makine ID</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={machineForm.machine_id}
                    onChange={(e) => setMachineForm({ ...machineForm, machine_id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kullanım Süresi (saat)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="8.5"
                    value={machineForm.usage_duration_hours}
                    onChange={(e) => setMachineForm({ ...machineForm, usage_duration_hours: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Üretim Miktarı</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={machineForm.production_count}
                    onChange={(e) => setMachineForm({ ...machineForm, production_count: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Verimlilik (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="90"
                    value={machineForm.efficiency_percentage}
                    onChange={(e) => setMachineForm({ ...machineForm, efficiency_percentage: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={txLoading}>
                  {txLoading ? 'İşleniyor...' : 'Kaydet'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkerPanel
