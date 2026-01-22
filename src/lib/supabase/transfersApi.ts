// Transfers API - Supabase operations for USDC transfers
import { supabase } from '@/integrations/supabase/client';
import { getWalletByUserId, updateWalletBalance, getUserById, type DemoUser } from './demoApi';

export interface DemoTransfer {
  id: string;
  from_user_id: string | null;
  to_user_id: string | null;
  amount: number;
  purpose: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  responded_at: string | null;
  // Joined data
  from_user?: DemoUser;
  to_user?: DemoUser;
}

// Helper to cast database response to typed DemoTransfer
function castToDemoTransfer(data: any): DemoTransfer {
  return {
    ...data,
    status: data.status as 'pending' | 'accepted' | 'declined',
  };
}

// Create a new transfer (deducts from sender immediately)
export async function createTransfer(
  fromUserId: string,
  toUserId: string,
  amount: number,
  purpose?: string
): Promise<DemoTransfer | null> {
  // Get sender's wallet
  const senderWallet = await getWalletByUserId(fromUserId);
  if (!senderWallet) {
    console.error('Sender wallet not found');
    return null;
  }
  
  // Check balance
  if (senderWallet.balance < amount) {
    console.error('Insufficient balance');
    return null;
  }
  
  // Deduct from sender
  const newBalance = senderWallet.balance - amount;
  await updateWalletBalance(senderWallet.id, newBalance);
  
  // Create transfer
  const { data, error } = await supabase
    .from('demo_transfers')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      amount,
      purpose: purpose || 'USDC Transfer',
      status: 'pending',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transfer:', error);
    // Refund sender if transfer creation fails
    await updateWalletBalance(senderWallet.id, senderWallet.balance);
    return null;
  }
  
  return castToDemoTransfer(data);
}

// Get pending transfers for a user (as recipient)
export async function getPendingTransfers(userId: string): Promise<DemoTransfer[]> {
  const { data, error } = await supabase
    .from('demo_transfers')
    .select('*')
    .eq('to_user_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting pending transfers:', error);
    return [];
  }
  
  // Fetch sender info for each transfer
  const transfers = await Promise.all(
    (data || []).map(async (transfer) => {
      const fromUser = transfer.from_user_id ? await getUserById(transfer.from_user_id) : null;
      return {
        ...castToDemoTransfer(transfer),
        from_user: fromUser || undefined,
      };
    })
  );
  
  return transfers;
}

// Get all transfers for a user (as sender or recipient)
export async function getTransfersForUser(userId: string, limit = 20): Promise<DemoTransfer[]> {
  const { data, error } = await supabase
    .from('demo_transfers')
    .select('*')
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error getting transfers:', error);
    return [];
  }
  
  // Fetch user info for each transfer
  const transfers = await Promise.all(
    (data || []).map(async (transfer) => {
      const [fromUser, toUser] = await Promise.all([
        transfer.from_user_id ? getUserById(transfer.from_user_id) : null,
        transfer.to_user_id ? getUserById(transfer.to_user_id) : null,
      ]);
      return {
        ...castToDemoTransfer(transfer),
        from_user: fromUser || undefined,
        to_user: toUser || undefined,
      };
    })
  );
  
  return transfers;
}

// Accept a transfer (credit recipient wallet)
export async function acceptTransfer(transferId: string): Promise<DemoTransfer | null> {
  // Get the transfer
  const { data: transfer, error: fetchError } = await supabase
    .from('demo_transfers')
    .select('*')
    .eq('id', transferId)
    .single();
  
  if (fetchError || !transfer) {
    console.error('Error fetching transfer:', fetchError);
    return null;
  }
  
  if (transfer.status !== 'pending') {
    console.error('Transfer is not pending');
    return null;
  }
  
  // Get recipient's wallet
  const recipientWallet = await getWalletByUserId(transfer.to_user_id);
  if (!recipientWallet) {
    console.error('Recipient wallet not found');
    return null;
  }
  
  // Credit recipient
  const newBalance = recipientWallet.balance + transfer.amount;
  await updateWalletBalance(recipientWallet.id, newBalance);
  
  // Update transfer status
  const { data: updatedTransfer, error: updateError } = await supabase
    .from('demo_transfers')
    .update({
      status: 'accepted',
      responded_at: new Date().toISOString(),
    })
    .eq('id', transferId)
    .select()
    .single();
  
  if (updateError) {
    console.error('Error updating transfer:', updateError);
    return null;
  }
  
  return castToDemoTransfer(updatedTransfer);
}

// Decline a transfer (refund sender wallet)
export async function declineTransfer(transferId: string): Promise<DemoTransfer | null> {
  // Get the transfer
  const { data: transfer, error: fetchError } = await supabase
    .from('demo_transfers')
    .select('*')
    .eq('id', transferId)
    .single();
  
  if (fetchError || !transfer) {
    console.error('Error fetching transfer:', fetchError);
    return null;
  }
  
  if (transfer.status !== 'pending') {
    console.error('Transfer is not pending');
    return null;
  }
  
  // Get sender's wallet
  const senderWallet = await getWalletByUserId(transfer.from_user_id);
  if (!senderWallet) {
    console.error('Sender wallet not found');
    return null;
  }
  
  // Refund sender
  const newBalance = senderWallet.balance + transfer.amount;
  await updateWalletBalance(senderWallet.id, newBalance);
  
  // Update transfer status
  const { data: updatedTransfer, error: updateError } = await supabase
    .from('demo_transfers')
    .update({
      status: 'declined',
      responded_at: new Date().toISOString(),
    })
    .eq('id', transferId)
    .select()
    .single();
  
  if (updateError) {
    console.error('Error updating transfer:', updateError);
    return null;
  }
  
  return castToDemoTransfer(updatedTransfer);
}

// Get transfer by ID
export async function getTransferById(transferId: string): Promise<DemoTransfer | null> {
  const { data, error } = await supabase
    .from('demo_transfers')
    .select('*')
    .eq('id', transferId)
    .single();
  
  if (error) {
    console.error('Error getting transfer:', error);
    return null;
  }
  
  const [fromUser, toUser] = await Promise.all([
    data.from_user_id ? getUserById(data.from_user_id) : null,
    data.to_user_id ? getUserById(data.to_user_id) : null,
  ]);
  
  return {
    ...castToDemoTransfer(data),
    from_user: fromUser || undefined,
    to_user: toUser || undefined,
  };
}

// Record a deposit (add funds from external source)
export async function recordDeposit(
  userId: string,
  amount: number,
  method: string
): Promise<DemoTransfer | null> {
  const { data, error } = await supabase
    .from('demo_transfers')
    .insert({
      from_user_id: null, // External deposit
      to_user_id: userId,
      amount,
      purpose: `Deposit via ${method}`,
      status: 'accepted',
      responded_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error recording deposit:', error);
    return null;
  }
  
  return castToDemoTransfer(data);
}

// Record a withdrawal (send to external bank)
export async function recordWithdrawal(
  userId: string,
  amount: number,
  bankName: string
): Promise<DemoTransfer | null> {
  const { data, error } = await supabase
    .from('demo_transfers')
    .insert({
      from_user_id: userId,
      to_user_id: null, // External withdrawal
      amount,
      purpose: `Withdrawal to ${bankName}`,
      status: 'accepted',
      responded_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error recording withdrawal:', error);
    return null;
  }
  
  return castToDemoTransfer(data);
}

// Get conversation history between two users (all transfers between them)
export async function getConversationHistory(
  userId1: string,
  userId2: string,
  limit = 50
): Promise<DemoTransfer[]> {
  const { data, error } = await supabase
    .from('demo_transfers')
    .select('*')
    .or(
      `and(from_user_id.eq.${userId1},to_user_id.eq.${userId2}),and(from_user_id.eq.${userId2},to_user_id.eq.${userId1})`
    )
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error getting conversation history:', error);
    return [];
  }

  // Fetch user info for each transfer
  const transfers = await Promise.all(
    (data || []).map(async (transfer) => {
      const [fromUser, toUser] = await Promise.all([
        transfer.from_user_id ? getUserById(transfer.from_user_id) : null,
        transfer.to_user_id ? getUserById(transfer.to_user_id) : null,
      ]);
      return {
        ...castToDemoTransfer(transfer),
        from_user: fromUser || undefined,
        to_user: toUser || undefined,
      };
    })
  );

  return transfers;
}

// Create a payment request (does NOT deduct from sender - just records pending request)
export async function createPaymentRequest(
  fromUserId: string,  // Person being requested (will pay)
  toUserId: string,    // Person making request (will receive)
  amount: number,
  message?: string
): Promise<DemoTransfer | null> {
  // Create transfer in pending state without deducting funds
  const { data, error } = await supabase
    .from('demo_transfers')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      amount,
      purpose: message || 'Payment Request',
      status: 'pending',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating payment request:', error);
    return null;
  }
  
  return castToDemoTransfer(data);
}
