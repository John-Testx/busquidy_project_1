import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";

export function useAdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const { data } = await apiClient.get("/support");
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  return { tickets, loading, error };
}
