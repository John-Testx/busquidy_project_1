import { useEffect, useState } from "react";
import axios from "axios";

export const useAdminPermissions = (adminId) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/permissions/${adminId}`)
      .then((res) => {
        setPermissions(res.data.permissions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [adminId]);

  return { permissions, loading };
};
