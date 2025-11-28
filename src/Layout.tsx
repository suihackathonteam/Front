import { Outlet, useNavigate } from 'react-router-dom'
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit'
import SuiConnectButton from './SuiConnectButton'
import './Dashboard.css'

function Layout() {
  const currentAccount = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
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
            <a onClick={() => navigate('/')}>🏠 Ana Sayfa</a>
            <a onClick={() => navigate('/about')}>📖 Hakkımızda</a>
            <a onClick={() => navigate('/services')}>💼 Hizmetler</a>
            <a onClick={() => navigate('/contact')}>📧 İletişim</a>
          </nav>

          <div className="user-section">
            <div className="sui-connect-wrapper">
              <SuiConnectButton />
            </div>
            {currentAccount && (
              <>
                <button className="logout-btn" onClick={handleLogout}>
                  Çıkış Yap
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
        <p>&copy; 2025 TeamPro. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}

export default Layout
