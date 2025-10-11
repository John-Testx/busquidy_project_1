import React, { useEffect, useState, useRef } from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import io from "socket.io-client";
import Home from "./pages/General/Home";
import AdminHome from "./pages/Admin/AdminHome";
import LoginAdmin from "./pages/Admin/LoginAdmin";
import FreeLancer from "./pages/Freelancer/FreeLancer";
import Empresa from "./pages/Empresa/Empresa";
import ProjectList from "./pages/Freelancer/ProjectList";
import ViewPerfilFreeLancer from "./pages/Freelancer/ViewPerfilFreeLancer";
import ViewPerfilEmpresa from "./pages/Empresa/ViewPerfilEmpresa";
import FindFreelancer from "./pages/Empresa/FindFreelancer";
import MyProjects from "./pages/Empresa/MyProjects";
import UserManagement from "./pages/Admin/UserManagement";
import ProjectManagement from "./pages/Admin/ProjectManagement";
import ReviewManagement from "./pages/Admin/ReviewManagement";
import SupportManagement from "./pages/Admin/SupportManagement";
import PaymentManagement from "./pages/Admin/PaymentManagement";
import NotificationManegement from "./pages/Admin/NotificationManegement";
import AuditAndSecurity from "./pages/Admin/AuditAndSecurity";
import MyPostulations from "./pages/Freelancer/MyPostulations";
import ViewCV from "./pages/Freelancer/ViewCV";
import LoadingScreen from "./components/LoadingScreen"; 
import BusquidyPage from "./pages/General/BusquidyPage";
import SobreNosotrosPage from "./pages/General/SobreNostrosPage";
import User from "./pages/User/user";
import ViewMoreDetailsFreelancer from "./pages/Freelancer/ViewMoreDetailsFreelancer";
import ViewFreelancer from "./pages/Empresa/ViewFreelancer";
import PaymentReturn from "./pages/User/PaymentReturn";
import BusquidyGuia from "./pages/Soporte/BusquidyGuia";
import SoporteHome from "./pages/Soporte/SoporteHome";
import CrearTicket from "./pages/Soporte/CrearTicket";
import VerTicket from "./pages/Soporte/VerTicket";
import EditProjectPage from "./components/Empresa/Projects/ProjectForm/EditProjectPage";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import Unauthorized from "./pages/User/Unauthorized";
import SupportTable from "./components/Admin/SupportTable";
import SupportChat from "./components/Admin/SupportChat";

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decoded = jwtDecode(token);

          // Verificar si el token ha expirado
          if (decoded.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
          } else {
            // Eliminar el token si está expirado
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setTimeout(() => setLoading(false), 500); // Retraso antes de ocultar la pantalla de carga
    };

    
    checkAuth();

    // Create socket only once
    if (!socketRef.current) {
      socketRef.current = io("http://192.168.1.81:3001", {
        transports: ["websocket"],
        withCredentials: true
      });

      socketRef.current.on("usersCount", (count) => {
        setConnectedUsers(count);
      });
    }

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
      
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full">
        {/* Contenido principal */}
        <main className="flex-1">
          <Routes>
            <Route path="/payment/return" element={<PaymentReturn />} />
            {/* general */}
            <Route path="/projects/edit/:id" element={<EditProjectPage />} />
            <Route path= "/" element={<Home />} />
            <Route path= "/user" element={<User/>} />
            <Route path= "/busquidypage" element={<BusquidyPage />} />
            <Route path= "/sobrenosotrospage" element={<SobreNosotrosPage />} />

            {/* soporte */}
            <Route path= "/busquidyGuia" element={<BusquidyGuia />} />
            <Route path= "/soportehome" element={<SoporteHome />} />
            <Route path= "/soporte/crearticket" element={<CrearTicket />} />
            <Route path= "/soporte/ticket/:id_ticket" element={<VerTicket />} />

            {/* freelancer */}
            <Route path= "/freelancer" element={<FreeLancer />} />
            <Route path= "/mypostulations" element={<MyPostulations />} />
            <Route path= "/viewcv" element={<ViewCV />} />

            {/* empresa */}
            <Route path= "/empresa" element={<Empresa />} />
            <Route path= "/projectlist" element={<ProjectList />} />
            <Route path= "/viewperfilempresa" element={<ViewPerfilEmpresa />} />
            <Route path= "/findfreelancer" element={<FindFreelancer />} />
            <Route path= "/myprojects" element={<MyProjects />} />
            <Route path= "/viewmoredetailsfreelancer" element={<ViewMoreDetailsFreelancer />} />
            <Route path= "/viewfreelancer/:id" element={<ViewFreelancer />} />

            {/* admin */}
            <Route path= "/loginadmin" element={<LoginAdmin />} />
            <Route element={<ProtectedAdminRoute />}>
              <Route path= "/adminhome" element={<AdminHome  connectedUsers={connectedUsers}/>} />
              <Route path= "/viewperfilfreelancer" element={<ViewPerfilFreeLancer />} />
              <Route path= "/usermanagement" element={<UserManagement />} />
              <Route path= "/projectmanagement" element={<ProjectManagement />} />
              <Route path= "/reviewmanagement" element={<ReviewManagement />} />
              <Route path= "/supportmanagement" element={<SupportManagement />} />
              <Route path= "/paymentmanagement" element={<PaymentManagement />} />
              <Route path= "/notificationmanagement" element={<NotificationManegement />} />
              <Route path= "/auditandsecurity" element={<AuditAndSecurity />} />
              <Route path="/admin/support" element={<SupportTable />} />
              <Route path="/admin/support/:id_ticket" element={<SupportChat />} />

            </Route>


          <Route path= "/unauthorized" element={<Unauthorized />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;