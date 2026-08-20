import axios from "axios";
import { API_URL } from "../config/config";

// ========================================
// CREATE CONTACT
// ========================================

export const createContact = async (data) => {
  const response = await axios.post(`${API_URL}/api/contact`, data);

  return response.data;
};

// ========================================
// GET ALL CONTACTS
// ========================================

export const getContacts = async () => {
  const response = await axios.get(`${API_URL}/api/contact`);

  return response.data;
};
