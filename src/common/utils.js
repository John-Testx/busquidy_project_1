// Nueva función para obtener las iniciales del correo
export  const getUserInitials = () => {
        const email = sessionStorage.getItem("correo") || "";
        const namePart = email.split("@")[0];
        return namePart.slice(0, 2).toUpperCase() || "NN";
    };