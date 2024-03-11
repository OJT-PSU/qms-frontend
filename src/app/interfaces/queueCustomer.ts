export type QueueStatus = 'waiting' | 'ongoing' | 'accommodated';
export type TransactionType = 'payment' | 'checkReleasing' | 'inquiry';
export type TransactionLabels = 'Payment' | 'Check Releasing' | 'Inquiry';

export interface QueueCustomer {
  queueId: string;
  name: string;
  email: string;
  contactNumber: string;
  queueStatus: QueueStatus;
  createdAt: Date;
}

export type PriorityType = 'senior' | 'pwd' | 'pregnant' | 'normal';
