import { apiFetch } from "./api";

type CreatePaymentPayload = {
  raffleId: string;
  buyer: {
    name: string;
    whatsapp: string;
    email?: string;
  };
  numbers: number[];
  receiptUrl?: string;
};

type CreatePaymentResponse = {
  message: string;
  payment: {
    id: string;
    status: string;
    amount: string;
  };
};

export function createPayment(payload: CreatePaymentPayload) {

  return apiFetch<CreatePaymentResponse>("/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  
}