export type QueueStatus = 'waiting' | 'ongoing' | 'accommodated';
export type TransactionType = 'payment' | 'checkReleasing' | 'inquiry';

export interface QueueCustomer {
  queueId: string;
  name: string;
  email: string;
  contactNumber: string;
  queueStatus: QueueStatus;
  createdAt: Date;
}
