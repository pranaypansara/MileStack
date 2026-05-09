export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Contract {
  _id: string;
  title: string;
  description: string;
  clientId: string | User;
  freelancerId: string | User;
  status: 'pending_freelancer_approval' | 'active' | 'completed' | 'disputed' | 'rejected';
  freelancerApproved: boolean;
  clientApproved: boolean;
  totalAmount: number;
  paymentStatus: 'pending' | 'deposited';
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  _id: string;
  contractId: string | Contract;
  title: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'approved' | 'disputed';
  createdAt: string;
  updatedAt: string;
}
