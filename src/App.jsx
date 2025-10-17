import React, { useEffect, useState, useRef } from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import io from "socket.io-client";

import { 
  AdminHome, UserManagement,ProjectManagement, 
  ReviewManagement, SupportManagement, PaymentManagement, 
  NotificationManagement, AuditAndSecurity
} from "@pages/Admin";

import {
  BusquidyGuia, SoporteHome, CrearTicket,
  VerTicket, CrearTicketPublico, VerTicketPublico
} from "@pages/Soporte"

import { 
  Dashboard, UserTable, SupportTable,
  SupportChat, AdminRoles, PermissionManagement, UserEditPage
} from "@components/Admin";

import LoadingScreen from "@components/LoadingScreen";

import {
  Empresa, FindFreelancer, ViewPerfilEmpresa,
  ViewFreelancer,MyProjects
} from "@pages/Empresa"

import {
  FreeLancer, ViewPerfilFreeLancer,
  MyPostulations, ViewMoreDetailsFreelancer
} from "@pages/Freelancer"

import {BusquidyPage, AboutUsPage, Home} from "@pages/General"
import {User, Unauthorized, PaymentReturn} from "@pages/User"

import ProjectList from "./pages/Project/ProjectList";
import EditProjectPage from "./components/Empresa/Projects/ProjectForm/EditProjectPage";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
// ===============================================================
// =====> 1. PEGA LA IMPORTACIÓN AQUÍ <=====
import VideoCallPage from "./pages/Video/VideoCallPage";
import MyCallsPage from "./pages/Video/MyCallsPage"; // <-- Importa la página
// ===============================================================


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
      socketRef.current = io("http://localhost:3001", {
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
            <Route path= "/sobrenosotrospage" element={<AboutUsPage />} />
            
            {/* =============================================================== */}
            {/* =====> 2. PEGA LA RUTA AQUÍ <===== */}
            <Route path="/video/:roomId" element={<VideoCallPage />} />
            <Route path="/my-calls" element={<MyCallsPage />} />
            {/* =============================================================== */}

            {/* soporte */}
            <Route path= "/busquidyGuia" element={<BusquidyGuia />} />
            <Route path= "/soportehome" element={<SoporteHome />} />

              {/* Rutas autenticadas */}
            <Route path="/soporte/crearticket" element={<CrearTicket />} />
            <Route path="/soporte/ticket/:id_ticket" element={<VerTicket />} />
            
              {/* Rutas públicas (sin login) */}
            <Route path="/soporte/crearticket-publico" element={<CrearTicketPublico />} />
            <Route path="/soporte/ticket-publico/:id_ticket" element={<VerTicketPublico />} />

            {/* freelancer */}
            <Route path= "/freelancer" element={<FreeLancer />} />
            <Route path= "/mypostulations" element={<MyPostulations />} />
            <Route path= "/viewperfilfreelancer" element={<ViewPerfilFreeLancer />} />

            {/* empresa */}
            <Route path= "/empresa" element={<Empresa />} />
            <Route path= "/projectlist" element={<ProjectList />} />
            <Route path= "/viewperfilempresa" element={<ViewPerfilEmpresa />} />
            <Route path= "/findfreelancer" element={<FindFreelancer />} />
            <Route path= "/myprojects" element={<MyProjects />} />
            <Route path= "/viewmoredetailsfreelancer" element={<ViewMoreDetailsFreelancer />} />
            <Route path= "/viewfreelancer/:id" element={<ViewFreelancer />} />
            <Route path= "/viewperfilfreelancer" element={<ViewPerfilFreeLancer />} />


            {/* ADMIN PANEL || Rutas protegidas */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/adminhome" element={<AdminHome connectedUsers={connectedUsers} />}>
                <Route index element={<Dashboard />} /> {/* ← default /adminhome */}
                <Route path="dashboard" element={<Dashboard />} /> {/* ← /adminhome/dashboard */}
                <Route path="usermanagement" element={<UserManagement />} />
                <Route path="projectmanagement" element={<ProjectManagement />} />
                <Route path="reviewmanagement" element={<ReviewManagement />} />
                <Route path="supportmanagement" element={<SupportManagement />} />
                
                <Route path="usermanagement" element={<UserManagement />}>
                  <Route index element={<UserTable />} /> {/* default tab */}
                  
                  {/* List all users */}
                  <Route path="users" element={<UserTable />} />
                  
                  
                  {/* Edit a user by ID */}
                  <Route path="users/edit/:id" element={<UserEditPage />} />


                  <Route path="roles" element={<AdminRoles />} />
                  {/* <Route path="permissions" element={<PermissionManagement />} /> */}
                </Route>
                
                <Route path="paymentmanagement" element={<PaymentManagement />} />
                <Route path="notificationmanagement" element={<NotificationManagement />} />
                <Route path="auditandsecurity" element={<AuditAndSecurity />} />
                <Route path="admin/support" element={<SupportTable />} />
                <Route path="admin/support/:id_ticket" element={<SupportChat />} />
              </Route>
            </Route>

          <Route path= "/unauthorized" element={<Unauthorized />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;