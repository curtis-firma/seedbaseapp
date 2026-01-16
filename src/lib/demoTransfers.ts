// Demo Transfer System
// Manages USDC transfers between demo users via localStorage

import { loadUserByPhone, saveUser, type DemoUser } from './demoAuth';

export type Transfer = {
  id: string;
  fromPhone: string;
  fromUsername: string;
  toPhone: string;
  toUsername: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
};

const TRANSFERS_KEY = 'seedbase:transfers';

function safeJsonParse<T>(v: string | null): T | null {
  if (!v) return null;
  try { return JSON.parse(v) as T; } catch { return null; }
}

function getAllTransfers(): Transfer[] {
  return safeJsonParse<Transfer[]>(localStorage.getItem(TRANSFERS_KEY)) ?? [];
}

function saveAllTransfers(transfers: Transfer[]): void {
  localStorage.setItem(TRANSFERS_KEY, JSON.stringify(transfers));
}

function generateId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Create a new transfer and deduct from sender
export function createTransfer(
  fromUser: DemoUser,
  toUser: DemoUser,
  amount: number,
  purpose: string
): Transfer | null {
  // Validate sender has enough balance
  if (fromUser.wallet.balance < amount) {
    return null;
  }

  // Deduct from sender
  fromUser.wallet.balance -= amount;
  saveUser(fromUser);

  // Create transfer
  const transfer: Transfer = {
    id: generateId(),
    fromPhone: fromUser.phone,
    fromUsername: fromUser.username,
    toPhone: toUser.phone,
    toUsername: toUser.username,
    amount,
    purpose,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const transfers = getAllTransfers();
  transfers.push(transfer);
  saveAllTransfers(transfers);

  return transfer;
}

// Get pending transfers for a user (as recipient)
export function getPendingTransfersForUser(phone: string): Transfer[] {
  return getAllTransfers().filter(
    t => t.toPhone === phone && t.status === 'pending'
  );
}

// Get all transfers involving a user
export function getTransfersForUser(phone: string): Transfer[] {
  return getAllTransfers().filter(
    t => t.toPhone === phone || t.fromPhone === phone
  );
}

// Accept a transfer
export function acceptTransfer(transferId: string): Transfer | null {
  const transfers = getAllTransfers();
  const index = transfers.findIndex(t => t.id === transferId);
  
  if (index === -1) return null;
  
  const transfer = transfers[index];
  if (transfer.status !== 'pending') return null;

  // Add to recipient balance
  const recipient = loadUserByPhone(transfer.toPhone);
  if (recipient) {
    recipient.wallet.balance += transfer.amount;
    saveUser(recipient);
  }

  // Update transfer status
  transfer.status = 'accepted';
  transfer.updatedAt = new Date().toISOString();
  transfers[index] = transfer;
  saveAllTransfers(transfers);

  return transfer;
}

// Decline a transfer
export function declineTransfer(transferId: string): Transfer | null {
  const transfers = getAllTransfers();
  const index = transfers.findIndex(t => t.id === transferId);
  
  if (index === -1) return null;
  
  const transfer = transfers[index];
  if (transfer.status !== 'pending') return null;

  // Refund sender
  const sender = loadUserByPhone(transfer.fromPhone);
  if (sender) {
    sender.wallet.balance += transfer.amount;
    saveUser(sender);
  }

  // Update transfer status
  transfer.status = 'declined';
  transfer.updatedAt = new Date().toISOString();
  transfers[index] = transfer;
  saveAllTransfers(transfers);

  return transfer;
}

// Get recent transfers (for activity feed)
export function getRecentTransfers(phone: string, limit: number = 10): Transfer[] {
  return getTransfersForUser(phone)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
