import { apiFetch } from "./api";

export interface Contact {
  id: number;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  location: string | null;
  googleMaps: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ContactResponse {
  message: string;
  data: Contact[];
}

export async function getContacts() {
  return apiFetch<ContactResponse>("/contacts");
}