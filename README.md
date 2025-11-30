# TeamPro - Identity & Tracking System (Frontend)

React-based web application for the Sui blockchain worker identity and activity tracking system. Provides admin panel, worker dashboard, and real-time analytics for factory/workplace management.

## 🎯 Features

### 🔐 Blockchain Integration

-   **Sui Wallet Connection**: Seamless wallet integration with @mysten/dapp-kit
-   **Transaction Management**: Sign and execute blockchain transactions
-   **Real-time Updates**: Query on-chain data and events
-   **Multi-role Support**: Admin and worker interfaces

### 📊 User Interfaces

**Admin Panel** (`/admin`)

-   Issue worker cards
-   Register doors and machines
-   Give awards to workers
-   Update entity information
-   Activate/deactivate cards
-   Create new admins

**Worker Dashboard** (`/worker`)

-   Clock in/out
-   Record door access
-   Log machine usage
-   View personal statistics
-   Track awards and points

**Analytics Dashboard** (`/dashboard`)

-   Real-time activity charts
-   Door access statistics
-   Machine usage analytics
-   Worker performance leaderboard
-   Award distribution graphs

### 🎨 Modern UI/UX

-   Responsive design (mobile-friendly)
-   Dark/light theme support
-   Smooth animations and transitions
-   Interactive charts with Recharts
-   Professional styling

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+ installed
-   npm or yarn package manager
-   Sui Wallet browser extension ([Install](https://chrome.google.com/webstore/detail/sui-wallet))
-   Deployed smart contract (see contract/README.md)

### Installation

1. **Navigate to frontend directory:**

```bash
cd Front
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure contract addresses:**

Edit `src/config/contracts.ts`:

```typescript
export const CONTRACT_CONFIG = {
    PACKAGE_ID: "0xYOUR_PACKAGE_ID",
    SYSTEM_REGISTRY_ID: "0xYOUR_REGISTRY_ID",
    ADMIN_CAP_ID: "0xYOUR_ADMIN_CAP_ID",
    MODULE_NAME: "identity",
};
```

4. **Start development server:**

```bash
npm run dev
```

5. **Open browser:**

```
http://localhost:5173
```

## 📁 Project Structure

```
Front/
├── src/
│   ├── components/           # React components
│   │   ├── SuiConnectButton.tsx
│   │   ├── admin/           # Admin panel components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── worker/          # Worker panel components
│   │   └── shared/          # Shared components
│   ├── config/
│   │   └── contracts.ts     # Contract addresses & config
│   ├── hooks/
│   │   ├── useCurrentAccount.tsx
│   │   ├── useIdentity.ts   # Identity system hooks
│   │   └── useTheme.tsx
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── AdminPanel.tsx   # Admin interface
│   │   ├── WorkerPanel.tsx  # Worker interface
│   │   ├── Dashboard.tsx    # Analytics dashboard
│   │   ├── About.tsx        # About page
│   │   └── Layout.tsx       # App layout
│   ├── styles/              # CSS files
│   ├── types/
│   │   ├── identity.ts      # TypeScript types
│   │   └── sui.ts
│   ├── utils/
│   │   └── transactions.ts  # Transaction builders
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html
├── package.json
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript config
```

## 🔧 Tech Stack

### Core Technologies

-   **React 19** - UI library
-   **TypeScript** - Type safety
-   **Vite** - Fast build tool & dev server
-   **React Router DOM 7** - Client-side routing

### Blockchain

-   **@mysten/dapp-kit 0.19.9** - Sui React SDK
-   **@mysten/sui 1.45.0** - Sui TypeScript SDK
-   **@tanstack/react-query** - Data fetching & caching

### UI & Visualization

-   **Recharts 3.5.1** - Charts and graphs
-   **Custom CSS** - Styled components

### Development Tools

-   **ESLint** - Code linting
-   **Vitest** - Unit testing
-   **TypeScript ESLint** - TS linting

## 📖 Usage Guide

### Initial Setup

**1. Connect Wallet:**

-   Click "Connect Wallet" button
-   Select Sui Wallet
-   Approve connection
-   Switch to Testnet if needed

**2. Get Testnet SUI:**

-   Visit [Sui Testnet Faucet](https://faucet.testnet.sui.io/)
-   Enter your wallet address
-   Receive test tokens

**3. Get Admin Access:**

-   Deploy contract (you receive AdminCap automatically)
-   Or ask existing admin to create AdminCap for you

### Admin Operations

**Issue Worker Card:**

```typescript
// Navigate to /admin → Worker Cards tab
1. Enter worker's Sui address
2. Fill card number (e.g., "W001")
3. Enter name and department
4. Click "Create Card"
5. Sign transaction in wallet
```

**Register Door:**

```typescript
// Navigate to /admin → Doors tab
1. Enter door name (e.g., "Main Entrance")
2. Enter location (e.g., "Building A")
3. Click "Register Door"
4. Sign transaction
```

**Register Machine:**

```typescript
// Navigate to /admin → Machines tab
1. Enter machine name (e.g., "CNC-001")
2. Enter machine type (e.g., "CNC Machine")
3. Enter location (e.g., "Floor 2")
4. Click "Register Machine"
```

**Give Award:**

```typescript
// Navigate to /admin → Awards tab
1. Enter worker's card object ID
2. Select award type
3. Enter points (numeric value)
4. Add description
5. Click "Give Award"
```

### Worker Operations

**Clock In/Out:**

```typescript
// Navigate to /worker
1. View current shift status
2. Click "Clock In" to start shift
3. Click "Clock Out" to end shift
4. Sign transaction
```

**Record Door Access:**

```typescript
// Navigate to /worker → Activities tab
1. Enter door ID
2. Select access type (Entry/Exit)
3. Click "Record Access"
4. Sign transaction
```

**Record Machine Usage:**

```typescript
// Navigate to /worker → Machine Usage tab
1. Enter machine ID
2. Enter duration (in minutes)
3. Enter production count
4. Enter efficiency percentage (0-100)
5. Click "Record Usage"
```

### Dashboard Analytics

**View Statistics:**

-   Navigate to `/dashboard`
-   Real-time activity graphs
-   Worker performance metrics
-   Leaderboard rankings
-   Door access patterns
-   Machine utilization rates

## 🔌 API Integration

### Transaction Builders

Located in `src/utils/transactions.ts`:

```typescript
// Issue worker card
buildIssueWorkerCardTx(adminCapId, formData);

// Register door
buildRegisterDoorTx(adminCapId, doorData);

// Register machine
buildRegisterMachineTx(adminCapId, machineData);

// Clock in
buildClockInTx(workerCardId);

// Clock out
buildClockOutTx(workerCardId);

// Record door access
buildRecordDoorAccessTx(workerCardId, doorId, accessType);

// Record machine usage
buildRecordMachineUsageTx(workerCardId, machineId, duration, production, efficiency);

// Give award
buildGiveAwardTx(adminCapId, workerCardId, awardType, points, description);
```

### Custom Hooks

**useIdentity:**

```typescript
import { useIdentity } from './hooks/useIdentity';

const { issueCard, registerDoor, clockIn, ... } = useIdentity();
```

**useCurrentAccount:**

```typescript
import { useCurrentAccount } from "./hooks/useCurrentAccount";

const account = useCurrentAccount();
// Returns current connected wallet account
```

## 🧪 Testing

**Run tests:**

```bash
npm test
```

**Watch mode:**

```bash
npm run test:watch
```

**Test coverage:**

```bash
npm test -- --coverage
```

## 🏗️ Build & Deployment

### Development Build

```bash
npm run dev
```

Runs on `http://localhost:5173`

### Production Build

```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build

```bash
npm run preview
```

### Deploy to Walrus

```bash
# Install Walrus site builder (macOS ARM64)
chmod +x site-builder-testnet-latest-macos-arm64

# Build and publish
npm run build
./site-builder-testnet-latest-macos-arm64 publish dist
```

Configuration in `walrus.yaml`.

### Deploy to Vercel/Netlify

1. Build the project: `npm run build`
2. Upload `dist/` folder
3. Configure environment variables if needed

## ⚙️ Configuration

### Contract Configuration

`src/config/contracts.ts`:

```typescript
export const NETWORK = "testnet";

export const CONTRACT_CONFIG = {
    PACKAGE_ID: "0x143d0098ff19457b...",
    SYSTEM_REGISTRY_ID: "0xeb408decd861de9988...",
    ADMIN_CAP_ID: "0x8c2a237e4ebb4d2ea53...",
    MODULE_NAME: "identity",
};

export const ACTION_TYPES = {
    CLOCK_IN: 0,
    CLOCK_OUT: 1,
    DOOR_ENTRY: 2,
    DOOR_EXIT: 3,
};
```

### Vite Configuration

`vite.config.ts`:

-   TypeScript support
-   React plugin
-   Port configuration
-   Build optimization

## 🎨 Customization

### Theme

Edit `src/styles/Theme.css`:

```css
:root {
    --primary-color: #your-color;
    --background-color: #your-bg;
    --text-color: #your-text;
}
```

### Routes

Edit `src/App.tsx`:

```typescript
<Routes>
    <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="worker" element={<WorkerPanel />} />
        <Route path="dashboard" element={<Dashboard />} />
    </Route>
</Routes>
```

## 🔍 Troubleshooting

### Common Issues

**1. Wallet Not Connecting:**

-   Install Sui Wallet extension
-   Switch to Testnet network
-   Refresh page

**2. Transaction Failures:**

-   Check gas balance
-   Verify contract addresses in config
-   Ensure correct object IDs

**3. "Card Not Found" Error:**

-   Verify worker card object ID
-   Check if card is active
-   Ensure card belongs to current wallet

**4. Build Errors:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable console logging:

```typescript
// In transactions.ts
console.log("Transaction:", tx);
console.log("Arguments:", args);
```

## 📊 Performance Tips

-   **Lazy Loading**: Components are loaded on demand
-   **React Query**: Automatic caching and refetching
-   **Optimized Builds**: Vite tree-shaking and minification
-   **Code Splitting**: Route-based splitting

## 🔐 Security Best Practices

-   Never commit private keys or mnemonics
-   Use environment variables for sensitive data
-   Validate all user inputs
-   Check object ownership before transactions
-   Implement rate limiting for API calls

## 📚 Additional Resources

-   [Sui DApp Kit Docs](https://sdk.mystenlabs.com/dapp-kit)
-   [React Router Docs](https://reactrouter.com)
-   [Recharts Documentation](https://recharts.org)
-   [Vite Guide](https://vitejs.dev/guide/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Scripts

```json
{
    "dev": "vite", // Start dev server
    "build": "tsc -b && vite build", // Production build
    "lint": "eslint .", // Lint code
    "preview": "vite preview", // Preview build
    "test": "vitest run", // Run tests
    "test:watch": "vitest" // Watch mode tests
}
```

## 📄 License

MIT License

---
