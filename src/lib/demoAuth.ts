// Demo Auth Persistence Layer
// Structures localStorage like a database for wallet-style persistence

export type DemoUser = {
  phone: string;                    // "demo:timestamp" OR "+15551234567"
  username: string;                 // "@handle"
  displayName: string;              // "Full Name"
  avatarUrl?: string;
  role: "activator" | "trustee" | "envoy";
  walletDisplayId: string;          // "0xABCDEF1234567890"
  keyType: "SeedKey" | "BaseKey" | "MissionKey";
  keyDisplayId: string;             // "0x..."
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
  return cleaned.startsWith("+") ? cleaned : `+${cleaned.replace(/[^\\d]/g, "")}`;
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

// Helper to get key type from role
export function getKeyTypeFromRole(role: DemoUser['role']): DemoUser['keyType'] {
  switch (role) {
    case 'activator': return 'SeedKey';
    case 'trustee': return 'BaseKey';
    case 'envoy': return 'MissionKey';
  }
}

// Truncate wallet/key ID for display
export function truncateHexId(hexId: string): string {
  if (hexId.length <= 12) return hexId;
  return `${hexId.slice(0, 6)}...${hexId.slice(-4)}`;
}
