import React, { useEffect, useState } from "react";
import axios from "axios";
// import { API_URL } from "../config/config";
import { API_URL } from "../../../config/config";
export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const getContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/contact`);

      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error(
        "Get contacts error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message || "Failed to load contact messages",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Contact Messages</h1>
        <p className="mt-4 text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contact Messages</h1>

          <p className="mt-1 text-sm text-gray-500">
            Messages submitted from the contact page
          </p>
        </div>

        <button
          onClick={getContacts}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <p className="text-gray-500">No contact messages found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Message
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {contact.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contact.email}
                    </td>

                    <td className="max-w-md px-6 py-4 text-sm text-gray-600">
                      {contact.message}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}