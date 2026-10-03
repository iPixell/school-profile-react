import { apiFetch } from "./api";

export interface Contact {
  id: number;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  location: string;
  googleMaps: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactResponse {
  message: string;
  data: Contact[];
}

interface ContactSingleResponse {
  message: string;
  data: Contact;
}

export interface ContactFormData {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  location: string;
  googleMaps: string;
}

export async function getContacts() {
  return apiFetch<ContactResponse>("/contacts");
}

export async function createContact(data: ContactFormData) {
  return apiFetch<ContactSingleResponse>("/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateContact(
  id: number,
  data: ContactFormData
) {
  return apiFetch<ContactSingleResponse>(`/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}