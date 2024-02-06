export type QueueStatus = 'waiting' | 'ongoing' | 'accommodated';

export interface QueueCustomer {
  queueId: string;
  name: string;
  email: string;
  contactNumber: string;
  queueStatus: QueueStatus;
  createdAt: Date;
}
