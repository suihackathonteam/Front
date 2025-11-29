import { useCurrentAccount as useDappCurrentAccount } from '@mysten/dapp-kit'

// This wrapper returns the dapp-kit account if present, otherwise uses a dev `fakeAddress` from localStorage.
// Use query param `?fakeAddress=0x...&dev=1` to set the fake address (see SuiConnectButton updates).

export function useCurrentAccount() {
  const acct = useDappCurrentAccount()

  if (acct && acct.address) return acct

  try {
    const fake = localStorage.getItem('dev:fakeAddress')
    if (fake) {
      return { address: fake } as any
    }
  } catch (e) {
    // ignore
  }

  return acct
}
