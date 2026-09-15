export type RaffleStatus = "DRAFT" | "ACTIVE" | "FINISHED" | "CANCELLED";

export type RaffleNumberStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export type PaymentStatus = "PENDING" | "CONFIRMED" | "REJECTED";

export type Prize = {
  id: string;
  raffleId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  position: number;
  createdAt: string;
};

export type Buyer = {
  id: string;
  name: string;
  whatsapp: string;
  email?: string | null;
  createdAt: string;
};

export type RaffleNumber = {
  id: string;
  raffleId: string;
  number: number;
  status: RaffleNumberStatus;
  buyerId?: string | null;
  reservedAt?: string | null;
  soldAt?: string | null;
  createdAt: string;
  buyer?: Buyer | null;
};

export type Raffle = {
  id: string;
  title: string;
  description?: string | null;
  ticketPrice: string;
  pixKey: string;
  totalNumbers: number;
  status: RaffleStatus;
  createdAt: string;
  updatedAt: string;
  prizes: Prize[];
  numbers: RaffleNumber[];
};

export type RaffleDetailsResponse = {
  raffle: Raffle;
  summary: {
    total: number;
    sold: number;
    reserved: number;
    available: number;
  };
  result: RaffleResult | null;
};

export type RaffleResult = {
  id: string;
  raffleId: string;
  winningNumberId: string;
  drawnBy?: string | null;
  drawnAt: string;
  createdAt: string;
  winningNumber: RaffleNumber;
};