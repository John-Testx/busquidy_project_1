import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDetails, updateUserDetails } from '@/api/userApi';

const useUserEditor = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userDetails = await getUserDetails(Number(userId));
        setUser(userDetails);
        setError(null);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("No se pudo cargar la información del usuario");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Update user field
  const updateField = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  // Save user changes
  const saveUser = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateUserDetails(user.id_usuario, user);
      navigate("/adminhome/usermanagement/users");
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Error al guardar los cambios");
      setSaving(false);
    }
  };

  // Cancel and go back
  const cancelEdit = () => {
    navigate("/adminhome/usermanagement/users");
  };

  return {
    user,
    loading,
    saving,
    error,
    updateField,
    saveUser,
    cancelEdit
  };
};

export default useUserEditor;