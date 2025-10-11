import { useEffect, useState } from "react";

export function useAdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/api/support", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al cargar tickets");

        setTickets(data);
        // console.log(data);
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
