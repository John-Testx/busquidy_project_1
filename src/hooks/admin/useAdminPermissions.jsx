import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";

export const useAdminPermissions = (adminId) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) return;
    apiClient
      .get(`/admin/permissions/${adminId}`)
      .then((res) => {
        setPermissions(res.data.permissions);
      })
      .finally(() => setLoading(false));
  }, [adminId]);

  return { permissions, loading };
};
