// Demo Auth Persistence Layer
// Structures localStorage like a database for wallet-style persistence

export type DemoUser = {
  phone: string;                    // "demo:timestamp" OR "+15551234567"
  username: string;                 // "@handle"
  displayName: string;              // "Full Name"
  avatarUrl?: string;
  role: "activator" | "trustee" | "envoy" | null;
  walletDisplayId: string;          // "0xABCDEF1234567890"
  keyType: "SeedKey" | "BaseKey" | "MissionKey" | null;
  keyDisplayId: string | null;      // "0x..."
  wallet: {
    balance: number;                // Default 25.00 USDC
    distributionsBalance: number;   // Default 0
  };
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
};

const USERS_INDEX_KEY = "seedbase:users:index"; // string[]
const USER_KEY_PREFIX = "seedbase:user:"; // + phone
const SESSION_KEY = "seedbase:session:phone";

function safeJsonParse<T>(v: string | null): T | null {
  if (!v) return null;
  try { return JSON.parse(v) as T; } catch { return null; }
}

export function makeHexId(len = 16): string {
  // len = number of hex chars AFTER "0x"
  const chars = "0123456789ABCDEF";
  let out = "0x";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function normalizePhone(raw: string): string {
  // demo-friendly: keep digits and +
  const cleaned = raw.trim();
  if (!cleaned) throw new Error("Phone required");
  // Strip non-digits except +
  const digits = cleaned.replace(/[^\d+]/g, "");
  // Add +1 if no country code
  if (!digits.startsWith("+")) {
    return `+1${digits}`;
  }
  return digits;
}

export function formatPhoneDisplay(phone: string): string {
  // Format phone for display: +15551234567 -> (555) 123-4567
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    const area = digits.slice(1, 4);
    const prefix = digits.slice(4, 7);
    const line = digits.slice(7);
    return `(${area}) ${prefix}-${line}`;
  }
  return phone;
}

export function getUserStorageKey(phone: string): string {
  return `${USER_KEY_PREFIX}${phone}`;
}

export function listUsers(): string[] {
  return safeJsonParse<string[]>(localStorage.getItem(USERS_INDEX_KEY)) ?? [];
}

function upsertIndex(phone: string): void {
  const idx = new Set(listUsers());
  idx.add(phone);
  localStorage.setItem(USERS_INDEX_KEY, JSON.stringify([...idx]));
}

export function loadUserByPhone(phone: string): DemoUser | null {
  const key = getUserStorageKey(phone);
  return safeJsonParse<DemoUser>(localStorage.getItem(key));
}

export function saveUser(user: DemoUser): DemoUser {
  const now = new Date().toISOString();
  const toSave: DemoUser = {
    ...user,
    updatedAt: now,
    createdAt: user.createdAt ?? now,
  };
  localStorage.setItem(getUserStorageKey(user.phone), JSON.stringify(toSave));
  upsertIndex(user.phone);
  return toSave;
}

export function deleteUserByPhone(phone: string): void {
  localStorage.removeItem(getUserStorageKey(phone));
  const idx = listUsers().filter(p => p !== phone);
  localStorage.setItem(USERS_INDEX_KEY, JSON.stringify(idx));
}

export function isUsernameTaken(username: string, excludePhone?: string): boolean {
  const users = listUsers();
  for (const phone of users) {
    if (phone === excludePhone) continue;
    const user = loadUserByPhone(phone);
    if (user?.username?.toLowerCase() === username.toLowerCase()) {
      return true;
    }
  }
  return false;
}

// Get all users (for @username search)
export function getAllUsers(): DemoUser[] {
  return listUsers()
    .map(phone => loadUserByPhone(phone))
    .filter((u): u is DemoUser => u !== null && u.onboardingComplete);
}

// Find user by username
export function findUserByUsername(username: string): DemoUser | null {
  const normalized = username.toLowerCase().replace(/^@/, '');
  return getAllUsers().find(u => u.username?.toLowerCase() === normalized) ?? null;
}

// Update user balance
export function updateUserBalance(phone: string, amount: number): DemoUser | null {
  const user = loadUserByPhone(phone);
  if (!user) return null;
  user.wallet.balance = Math.max(0, user.wallet.balance + amount);
  return saveUser(user);
}

// Session management
export function setSessionPhone(phone: string): void {
  localStorage.setItem(SESSION_KEY, phone);
}

export function getSessionPhone(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Clear all demo data (for Settings reset)
export function clearAllDemoData(): void {
  const users = listUsers();
  for (const phone of users) {
    localStorage.removeItem(getUserStorageKey(phone));
  }
  localStorage.removeItem(USERS_INDEX_KEY);
  localStorage.removeItem(SESSION_KEY);
  // Also clear transfers
  localStorage.removeItem("seedbase:transfers");
}

// Helper to get key type from role
export function getKeyTypeFromRole(role: DemoUser['role']): DemoUser['keyType'] {
  switch (role) {
    case 'activator': return 'SeedKey';
    case 'trustee': return 'BaseKey';
    case 'envoy': return 'MissionKey';
    default: return null;
  }
}

// Truncate wallet/key ID for display
export function truncateHexId(hexId: string): string {
  if (hexId.length <= 12) return hexId;
  return `${hexId.slice(0, 6)}...${hexId.slice(-4)}`;
}

// Create a new demo user with defaults
export function createDemoUser(phone: string, isDemo: boolean = false): DemoUser {
  const normalizedPhone = isDemo ? `demo:${phone}` : normalizePhone(phone);
  return {
    phone: normalizedPhone,
    username: '',
    displayName: '',
    role: null,
    walletDisplayId: makeHexId(16),
    keyType: null,
    keyDisplayId: null,
    wallet: {
      balance: 25.00,
      distributionsBalance: 0,
    },
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
