
export interface Payment {
  id: number;
  value: number;
  tax: number;
  createdAt: string;
}

export interface Property {
  id: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  name: string;
  street: string;
  city: string;
  state: string;
  complement: string;
  number: number;
  size: number;
  bathroomQuantity: number;
  suites: number;
  car_space: number;
  roomQuantity: number;
  landlord_id: number;
}

export interface Contract {
  id: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  deposit: number;
  duration: number;
  monthly_value: number;
  payment_day: number;
  tenant_id: number;
  payments: Payment[];
  propertyEntity: Property;
}

export interface Ticket {
  id: number;
  created_at: string;
  updated_at: string;
  urgent: boolean;
  description: string;
  status: string; 
  property: Property;
  tenant_id: number;
}

export interface Maintenance {
  id: number;
  created_at: string;
  updated_at: string;
  finished_at?: string;
  total_value: number;
  ticket: Ticket;
}
