import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useAdminCap, useIdentityTransaction, useWorkerCard } from './hooks/useIdentity'
import { 
  buildIssueWorkerCardTx, 
  buildRegisterDoorTx, 
  buildRegisterMachineTx,
  buildIssueAwardTx,
  buildUpdateWorkerCardTx,
  buildDeactivateWorkerCardTx,
  buildActivateWorkerCardTx,
  buildBatchIssueWorkerCardsTx,
  buildTransferAdminCapTx,
} from './utils/transactions'
import { isContractConfigured } from './config/contracts'
import SuiConnectButton from './SuiConnectButton'
import './AdminPanel.css'

function AdminPanel() {
  const account = useCurrentAccount()
  const { isAdmin, adminCapId, loading: adminLoading } = useAdminCap()
  const { executeTransaction, isLoading: txLoading, error: txError } = useIdentityTransaction()
  
  const [activeTab, setActiveTab] = useState<'workers' | 'doors' | 'machines' | 'awards' | 'manage'>('workers')
  const [showSuccess, setShowSuccess] = useState(false)

  // Worker Card Form
  const [workerForm, setWorkerForm] = useState({
    worker_address: '',
    card_number: '',
    name: '',
    department: '',
  })

  // Update Worker Card Form
  const [updateWorkerForm, setUpdateWorkerForm] = useState({
    worker_card_id: '',
    name: '',
    department: '',
  })

  // Card Management Form
  const [cardManagementForm, setCardManagementForm] = useState({
    worker_card_id: '',
  })

  // Transfer Admin Form
  const [transferAdminForm, setTransferAdminForm] = useState({
    new_admin_address: '',
  })

  // Door Form
  const [doorForm, setDoorForm] = useState({
    name: '',
    location: '',
  })

  // Machine Form
  const [machineForm, setMachineForm] = useState({
    name: '',
    machine_type: '',
  })

  // Award Form
  const [awardForm, setAwardForm] = useState({
    worker_card_id: '',
    award_type: '',
    points: '',
    description: '',
  })

  // Wallet bağlı değil
  if (!account) {
    return (
      <div className="admin-container">
        <div className="admin-connect">
          <h2>🔐 Admin Paneli</h2>
          <p>Admin paneline erişmek için lütfen cüzdanınızı bağlayın</p>
          <SuiConnectButton />
        </div>
      </div>
    )
  }

  // Contract yapılandırılmamış
  if (!isContractConfigured()) {
    return (
      <div className="admin-container">
        <div className="admin-warning">
          <h2>⚠️ Contract Yapılandırma Gerekli</h2>
          <p>Smart contract henüz deploy edilmemiş veya yapılandırılmamış.</p>
          <div className="config-steps">
            <h3>Yapılması Gerekenler:</h3>
            <ol>
              <li>Smart contract'ı Sui network'e deploy edin</li>
              <li><code>src/config/contracts.ts</code> dosyasını açın</li>
              <li>PACKAGE_ID ve SYSTEM_REGISTRY_ID değerlerini güncelleyin</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  // Admin yetkisi yok
  if (adminLoading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Yetki kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="admin-unauthorized">
          <h2>🚫 Yetkisiz Erişim</h2>
          <p>Bu sayfaya erişmek için AdminCap yetkisine sahip olmalısınız.</p>
          <p className="address-info">Bağlı adres: <code>{account.address}</code></p>
        </div>
      </div>
    )
  }

  // Worker Card kaydet
  const handleIssueWorkerCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminCapId) return

    const tx = buildIssueWorkerCardTx(adminCapId, workerForm)
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setWorkerForm({ worker_address: '', card_number: '', name: '', department: '' })
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Kapı kaydet
  const handleRegisterDoor = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const tx = buildRegisterDoorTx(doorForm)
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setDoorForm({ name: '', location: '' })
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Makine kaydet
  const handleRegisterMachine = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const tx = buildRegisterMachineTx(machineForm)
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setMachineForm({ name: '', machine_type: '' })
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Ödül ver
  const handleIssueAward = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminCapId) return

    const tx = buildIssueAwardTx(adminCapId, awardForm.worker_card_id, {
      award_type: awardForm.award_type,
      points: Number(awardForm.points),
      description: awardForm.description,
    })
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setAwardForm({ worker_card_id: '', award_type: '', points: '', description: '' })
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Worker Card güncelle
  const handleUpdateWorkerCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminCapId) return

    const tx = buildUpdateWorkerCardTx(adminCapId, updateWorkerForm.worker_card_id, {
      name: updateWorkerForm.name,
      department: updateWorkerForm.department,
    })
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setUpdateWorkerForm({ worker_card_id: '', name: '', department: '' })
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Card status değiştirme (dummy handler)
  const handleCardStatusChange = (e: React.FormEvent) => {
    e.preventDefault()
  }

  // Worker Card devre dışı bırak
  const handleDeactivateCard = async () => {
    if (!adminCapId || !cardManagementForm.worker_card_id) return

    const tx = buildDeactivateWorkerCardTx(adminCapId, cardManagementForm.worker_card_id)
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Worker Card aktif et
  const handleActivateCard = async () => {
    if (!adminCapId || !cardManagementForm.worker_card_id) return

    const tx = buildActivateWorkerCardTx(adminCapId, cardManagementForm.worker_card_id)
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  // Admin yetkisi transfer et
  const handleTransferAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminCapId) return

    const confirmation = window.confirm(
      '⚠️ DİKKAT: AdminCap transfer edilecek! Bu işlem geri alınamaz. Devam etmek istiyor musunuz?'
    )
    
    if (!confirmation) return

    const tx = buildTransferAdminCapTx(adminCapId, transferAdminForm.new_admin_address)
    
    executeTransaction(tx, {
      onSuccess: () => {
        alert('✓ Admin yetkisi başarıyla transfer edildi!')
        setTransferAdminForm({ new_admin_address: '' })
        // Sayfayı yenile çünkü artık admin değiliz
        setTimeout(() => window.location.reload(), 2000)
      },
    })
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔐 Admin Paneli</h1>
        <div className="admin-info">
          <span className="admin-badge">✓ Admin</span>
          <span className="admin-address">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
        </div>
      </div>

      {showSuccess && (
        <div className="success-banner">
          ✓ İşlem başarıyla tamamlandı!
        </div>
      )}

      {txError && (
        <div className="error-banner">
          ✗ Hata: {txError}
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={activeTab === 'workers' ? 'tab-active' : ''}
          onClick={() => setActiveTab('workers')}
        >
          👥 Çalışan Kartları
        </button>
        <button 
          className={activeTab === 'doors' ? 'tab-active' : ''}
          onClick={() => setActiveTab('doors')}
        >
          🚪 Kapılar
        </button>
        <button 
          className={activeTab === 'machines' ? 'tab-active' : ''}
          onClick={() => setActiveTab('machines')}
        >
          ⚙️ Makineler
        </button>
        <button 
          className={activeTab === 'awards' ? 'tab-active' : ''}
          onClick={() => setActiveTab('awards')}
        >
          🏆 Ödül Ver
        </button>
        <button 
          className={activeTab === 'manage' ? 'tab-active' : ''}
          onClick={() => setActiveTab('manage')}
        >
          🔧 Yönetim
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'workers' && (
          <div className="admin-form-card">
            <h2>Yeni Çalışan Kartı Oluştur</h2>
            <form onSubmit={handleIssueWorkerCard}>
              <div className="form-group">
                <label>Çalışan Adresi (Sui Address)</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={workerForm.worker_address}
                  onChange={(e) => setWorkerForm({ ...workerForm, worker_address: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Kart Numarası</label>
                <input
                  type="text"
                  placeholder="KART-1001"
                  value={workerForm.card_number}
                  onChange={(e) => setWorkerForm({ ...workerForm, card_number: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ad Soyad</label>
                <input
                  type="text"
                  placeholder="Ahmet Yılmaz"
                  value={workerForm.name}
                  onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Departman</label>
                <input
                  type="text"
                  placeholder="Üretim"
                  value={workerForm.department}
                  onChange={(e) => setWorkerForm({ ...workerForm, department: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={txLoading}>
                {txLoading ? 'İşleniyor...' : 'Kart Oluştur'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'doors' && (
          <div className="admin-form-card">
            <h2>Yeni Kapı Ekle</h2>
            <form onSubmit={handleRegisterDoor}>
              <div className="form-group">
                <label>Kapı Adı</label>
                <input
                  type="text"
                  placeholder="Ana Giriş Kapısı"
                  value={doorForm.name}
                  onChange={(e) => setDoorForm({ ...doorForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Konum</label>
                <input
                  type="text"
                  placeholder="Zemin Kat - Giriş"
                  value={doorForm.location}
                  onChange={(e) => setDoorForm({ ...doorForm, location: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={txLoading}>
                {txLoading ? 'İşleniyor...' : 'Kapı Ekle'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="admin-form-card">
            <h2>Yeni Makine/Kaynak Ekle</h2>
            <form onSubmit={handleRegisterMachine}>
              <div className="form-group">
                <label>Makine Adı</label>
                <input
                  type="text"
                  placeholder="CNC-001"
                  value={machineForm.name}
                  onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Makine Tipi</label>
                <input
                  type="text"
                  placeholder="CNC Torna"
                  value={machineForm.machine_type}
                  onChange={(e) => setMachineForm({ ...machineForm, machine_type: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={txLoading}>
                {txLoading ? 'İşleniyor...' : 'Makine Ekle'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="admin-form-card">
            <h2>Çalışana Ödül Ver</h2>
            <form onSubmit={handleIssueAward}>
              <div className="form-group">
                <label>Worker Card ID</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={awardForm.worker_card_id}
                  onChange={(e) => setAwardForm({ ...awardForm, worker_card_id: e.target.value })}
                  required
                />
                <small>Çalışanın WorkerCard object ID'si</small>
              </div>
              <div className="form-group">
                <label>Ödül Tipi</label>
                <input
                  type="text"
                  placeholder="Ayın Çalışanı"
                  value={awardForm.award_type}
                  onChange={(e) => setAwardForm({ ...awardForm, award_type: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Puan</label>
                <input
                  type="number"
                  placeholder="100"
                  value={awardForm.points}
                  onChange={(e) => setAwardForm({ ...awardForm, points: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Açıklama</label>
                <textarea
                  placeholder="En yüksek verimlilik performansı"
                  value={awardForm.description}
                  onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={txLoading}>
                {txLoading ? 'İşleniyor...' : 'Ödül Ver'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="manage-section">
            <div className="admin-form-card">
              <h2>Worker Card Güncelle</h2>
              <form onSubmit={handleUpdateWorkerCard}>
                <div className="form-group">
                  <label>Worker Card ID</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={updateWorkerForm.worker_card_id}
                    onChange={(e) => setUpdateWorkerForm({ ...updateWorkerForm, worker_card_id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Yeni Ad Soyad</label>
                  <input
                    type="text"
                    placeholder="Ahmet Yılmaz"
                    value={updateWorkerForm.name}
                    onChange={(e) => setUpdateWorkerForm({ ...updateWorkerForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Yeni Departman</label>
                  <input
                    type="text"
                    placeholder="Üretim"
                    value={updateWorkerForm.department}
                    onChange={(e) => setUpdateWorkerForm({ ...updateWorkerForm, department: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={txLoading}>
                  {txLoading ? 'İşleniyor...' : 'Güncelle'}
                </button>
              </form>
            </div>

            <div className="admin-form-card">
              <h2>Worker Card Durumu</h2>
              <form onSubmit={handleCardStatusChange}>
                <div className="form-group">
                  <label>Worker Card ID</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={cardManagementForm.worker_card_id}
                    onChange={(e) => setCardManagementForm({ ...cardManagementForm, worker_card_id: e.target.value })}
                    required
                  />
                </div>
                <div className="button-group">
                  <button 
                    type="button" 
                    className="submit-btn deactivate-btn" 
                    onClick={() => handleDeactivateCard()}
                    disabled={txLoading}
                  >
                    🚫 Devre Dışı Bırak
                  </button>
                  <button 
                    type="button" 
                    className="submit-btn activate-btn" 
                    onClick={() => handleActivateCard()}
                    disabled={txLoading}
                  >
                    ✅ Aktif Et
                  </button>
                </div>
              </form>
            </div>

            <div className="admin-form-card">
              <h2>Yeni Admin Oluştur</h2>
              <form onSubmit={handleTransferAdmin}>
                <div className="form-group">
                  <label>Yeni Admin Adresi</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={transferAdminForm.new_admin_address}
                    onChange={(e) => setTransferAdminForm({ ...transferAdminForm, new_admin_address: e.target.value })}
                    required
                  />
                  <small>⚠️ Dikkat: AdminCap transfer edilecek, yeni bir admin oluşturulacak</small>
                </div>
                <button type="submit" className="submit-btn" disabled={txLoading}>
                  {txLoading ? 'İşleniyor...' : 'Admin Yetkisi Ver'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
