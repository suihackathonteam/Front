import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useAdminCap, useIdentityTransaction } from './hooks/useIdentity'
import { 
  buildIssueWorkerCardTx, 
  buildRegisterDoorTx, 
  buildRegisterMachineTx,
  buildIssueAwardTx,
  buildUpdateWorkerCardTx,
  buildDeactivateWorkerCardTx,
  buildActivateWorkerCardTx,
  buildAddNewAdminTx,
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

  const [workerForm, setWorkerForm] = useState({
    worker_address: '',
    card_number: '',
    name: '',
    department: '',
  })

  const [updateWorkerForm, setUpdateWorkerForm] = useState({
    worker_card_id: '',
    name: '',
    department: '',
  })

  const [cardManagementForm, setCardManagementForm] = useState({
    worker_card_id: '',
  })

  const [transferAdminForm, setTransferAdminForm] = useState({
    new_admin_address: '',
  })

  const [doorForm, setDoorForm] = useState({
    name: '',
    location: '',
  })

  const [machineForm, setMachineForm] = useState({
    name: '',
    machine_type: '',
  })

  const [awardForm, setAwardForm] = useState({
    worker_card_id: '',
    award_type: '',
    points: '',
    description: '',
  })

  if (!account) {
    return (
      <div className="admin-container">
        <div className="admin-connect">
          <h2>🔐 Admin Panel</h2>
          <p>Please connect your wallet to access the admin panel</p>
          <SuiConnectButton />
        </div>
      </div>
    )
  }

  if (!isContractConfigured()) {
    return (
      <div className="admin-container">
        <div className="admin-warning">
          <h2>⚠️ Contract Configuration Required</h2>
          <p>Smart contract has not been deployed or configured yet.</p>
          <div className="config-steps">
            <h3>Steps Required:</h3>
            <ol>
              <li>Deploy the smart contract to Sui network</li>
              <li>Open <code>src/config/contracts.ts</code> file</li>
              <li>Update PACKAGE_ID and SYSTEM_REGISTRY_ID values</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  if (adminLoading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="admin-unauthorized">
          <h2>🚫 Unauthorized Access</h2>
          <p>You must have AdminCap permission to access this page.</p>
          <p className="address-info">Connected address: <code>{account.address}</code></p>
        </div>
      </div>
    )
  }

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

  const handleRegisterDoor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminCapId) return

    const tx = buildRegisterDoorTx(adminCapId, doorForm)
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setDoorForm({ name: '', location: '' })
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  const handleRegisterMachine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminCapId) return

    const tx = buildRegisterMachineTx(adminCapId, machineForm)
    
    executeTransaction(tx, {
      onSuccess: () => {
        setShowSuccess(true)
        setMachineForm({ name: '', machine_type: '' })
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

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

  const handleCardStatusChange = (e: React.FormEvent) => {
    e.preventDefault()
  }

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

  const handleTransferAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminCapId) return

    const confirmation = window.confirm(
      '⚠️ DİKKAT: Bu adres için yeni bir AdminCap oluşturulacak. Devam etmek istiyor musunuz?'
    )
    
    if (!confirmation) return

    const tx = buildAddNewAdminTx(adminCapId, transferAdminForm.new_admin_address)
    
    executeTransaction(tx, {
      onSuccess: () => {
        alert('✓ Yeni admin yetkisi başarıyla oluşturuldu!')
        setTransferAdminForm({ new_admin_address: '' })
      },
    })
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔐 Admin Panel</h1>
        <div className="admin-info">
          <span className="admin-badge">✓ Admin</span>
          <span className="admin-address">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
        </div>
      </div>

      {showSuccess && (
        <div className="success-banner">
          ✓ Transaction completed successfully!
        </div>
      )}

      {txError && (
        <div className="error-banner">
          ✗ Error: {txError}
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={activeTab === 'workers' ? 'tab-active' : ''}
          onClick={() => setActiveTab('workers')}
        >
          👥 Worker Cards
        </button>
        <button 
          className={activeTab === 'doors' ? 'tab-active' : ''}
          onClick={() => setActiveTab('doors')}
        >
          🚪 Doors
        </button>
        <button 
          className={activeTab === 'machines' ? 'tab-active' : ''}
          onClick={() => setActiveTab('machines')}
        >
          ⚙️ Machines
        </button>
        <button 
          className={activeTab === 'awards' ? 'tab-active' : ''}
          onClick={() => setActiveTab('awards')}
        >
          🏆 Give Award
        </button>
        <button 
          className={activeTab === 'manage' ? 'tab-active' : ''}
          onClick={() => setActiveTab('manage')}
        >
          🔧 Management
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'workers' && (
          <div className="admin-form-card">
            <h2>Create New Worker Card</h2>
            <form onSubmit={handleIssueWorkerCard}>
              <div className="form-group">
                <label>Worker Address (Sui Address)</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={workerForm.worker_address}
                  onChange={(e) => setWorkerForm({ ...workerForm, worker_address: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="CARD-1001"
                  value={workerForm.card_number}
                  onChange={(e) => setWorkerForm({ ...workerForm, card_number: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={workerForm.name}
                  onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  placeholder="Production"
                  value={workerForm.department}
                  onChange={(e) => setWorkerForm({ ...workerForm, department: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={txLoading}>
                {txLoading ? 'Processing...' : 'Create Card'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'doors' && (
          <div className="admin-form-card">
            <h2>Add New Door</h2>
            <form onSubmit={handleRegisterDoor}>
              <div className="form-group">
                <label>Door Name</label>
                <input
                  type="text"
                  placeholder="Main Entrance Door"
                  value={doorForm.name}
                  onChange={(e) => setDoorForm({ ...doorForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Ground Floor - Entrance"
                  value={doorForm.location}
                  onChange={(e) => setDoorForm({ ...doorForm, location: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={txLoading}>
                {txLoading ? 'Processing...' : 'Add Door'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="admin-form-card">
            <h2>Add New Machine/Resource</h2>
            <form onSubmit={handleRegisterMachine}>
              <div className="form-group">
                <label>Machine Name</label>
                <input
                  type="text"
                  placeholder="CNC-001"
                  value={machineForm.name}
                  onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Machine Type</label>
                <input
                  type="text"
                  placeholder="CNC Lathe"
                  value={machineForm.machine_type}
                  onChange={(e) => setMachineForm({ ...machineForm, machine_type: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={txLoading}>
                {txLoading ? 'Processing...' : 'Add Machine'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="admin-form-card">
            <h2>Give Award to Employee</h2>
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
                <small>Employee's WorkerCard object ID</small>
              </div>
              <div className="form-group">
                <label>Award Type</label>
                <input
                  type="text"
                  placeholder="Employee of the Month"
                  value={awardForm.award_type}
                  onChange={(e) => setAwardForm({ ...awardForm, award_type: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Points</label>
                <input
                  type="number"
                  placeholder="100"
                  value={awardForm.points}
                  onChange={(e) => setAwardForm({ ...awardForm, points: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Highest productivity performance"
                  value={awardForm.description}
                  onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={txLoading}>
                {txLoading ? 'Processing...' : 'Give Award'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="manage-section">
            <div className="admin-form-card">
              <h2>Update Worker Card</h2>
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
                  <label>New Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={updateWorkerForm.name}
                    onChange={(e) => setUpdateWorkerForm({ ...updateWorkerForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Department</label>
                  <input
                    type="text"
                    placeholder="Production"
                    value={updateWorkerForm.department}
                    onChange={(e) => setUpdateWorkerForm({ ...updateWorkerForm, department: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={txLoading}>
                  {txLoading ? 'Processing...' : 'Update'}
                </button>
              </form>
            </div>

            <div className="admin-form-card">
              <h2>Worker Card Status</h2>
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
                    🚫 Deactivate
                  </button>
                  <button 
                    type="button" 
                    className="submit-btn activate-btn" 
                    onClick={() => handleActivateCard()}
                    disabled={txLoading}
                  >
                    ✅ Activate
                  </button>
                </div>
              </form>
            </div>

            <div className="admin-form-card">
              <h2>Create New Admin</h2>
              <form onSubmit={handleTransferAdmin}>
                <div className="form-group">
                  <label>New Admin Address</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={transferAdminForm.new_admin_address}
                    onChange={(e) => setTransferAdminForm({ ...transferAdminForm, new_admin_address: e.target.value })}
                    required
                  />
                  <small>✓ A new AdminCap will be created for this address. Your admin permissions will remain intact.</small>
                </div>
                <button type="submit" className="submit-btn" disabled={txLoading}>
                  {txLoading ? 'Processing...' : 'Create New Admin'}
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