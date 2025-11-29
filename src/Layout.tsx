import { Outlet, useNavigate } from 'react-router-dom'
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit'
import SuiConnectButton from './SuiConnectButton'
import { useAdminCap } from './hooks/useIdentity'
import './Dashboard.css'

function Layout() {
  const currentAccount = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
  const { isAdmin } = useAdminCap()
  const navigate = useNavigate()

  const handleLogout = () => {
    disconnect()
    navigate('/')
  }

  return (
    <div className="app-root">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <h2>TeamPro</h2>
          </div>

          <nav className={`dashboard-nav`}>
            <a onClick={() => navigate('/')}>🏠 Home</a>
            <a onClick={() => navigate('/about')}>📖 About</a>
            <a onClick={() => navigate('/services')}>💼 Services</a>
            {currentAccount && (
              <>
                <a onClick={() => navigate('/dashboard')}>📊 Dashboard</a>
                <a onClick={() => navigate('/worker')}>👤 Worker</a>
              </>
            )}
            {isAdmin && (
              <a onClick={() => navigate('/admin')} style={{ color: '#43e97b' }}>🔐 Admin</a>
            )}
          </nav>

          <div className="user-section">
            <div className="sui-connect-wrapper">
              <SuiConnectButton />
            </div>
            {currentAccount && (
              <>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 TeamPro. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout