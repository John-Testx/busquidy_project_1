import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your pages (using your existing barrel files is great!)
import { Home, BusquidyPage, AboutUsPage } from '@pages/General';
import { User, Unauthorized, PaymentReturn, NotAuthenticated } from '@pages/User';

import { Empresa, FindFreelancer, MyProjects, ViewFreelancer, ViewPerfilEmpresa, } from '@pages/Empresa';
import { FreeLancer, MyPostulations, ViewMoreDetailsFreelancer, ViewPerfilFreeLancer, FreelancerProfileLayout} from '@pages/Freelancer';
import VideoCallPage from "@pages/Video/VideoCallPage";
import MyCallsPage from "@pages/Video/MyCallsPage";

import {
    SoporteHome,
    CrearTicket,
    VerTicket,
    CrearTicketPublico,
    VerTicketPublico,
    BusquidyGuia
} from "@pages/Soporte";

import ProjectList from '../pages/Project/ProjectList';
import EditProjectPage from '../components/Empresa/Projects/ProjectForm/EditProjectPage';

// Import Admin components
import { AdminHome, UserManagement, ProjectManagement, ReviewManagement, SupportManagement, PaymentManagement, NotificationManagement, AuditAndSecurity } from '@pages/Admin';
import { Dashboard, UserTable, SupportTable, SupportChat, AdminRoles, UserEditPage } from '@components/Admin';


// Import your protected route components
import ProtectedRoute from './ProtectedRoute';
import ProtectedAdminRoute from './ProtectedAdminRoute'; // You can keep this or merge logic into the new one
import MyAvailability from '@/pages/Freelancer/MyAvailability';
import EmpresaProfileLayout from '@/pages/Empresa/EmpresaProfileLayout';
import EmpresaInfo from '@/components/Empresa/Perfil/EmpresaInfo';
import RepresentanteInfo from '@/components/Empresa/Perfil/RepresentanteInfo';
import EmpresaAccess from '@/components/Empresa/Perfil/EmpresaAccess';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/busquidypage" element={<BusquidyPage />} />
      <Route path="/sobrenosotrospage" element={<AboutUsPage />} />
      <Route path="/projectlist" element={<ProjectList />} />
      <Route path="/payment/return" element={<PaymentReturn />} />
      <Route path="/notauthenticated" element={<NotAuthenticated />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Soporte Routes (Public and Private) */}
      <Route path="/busquidyGuia" element={<BusquidyGuia />} />
      <Route path="/soportehome" element={<SoporteHome />} />
      <Route path="/soporte/crearticket-publico" element={<CrearTicketPublico />} />
      <Route path="/soporte/ticket-publico/:id_ticket" element={<VerTicketPublico />} />

      <Route path="/video/:roomId" element={<VideoCallPage />} />
      <Route path="/my-calls" element={<MyCallsPage />} />

      {/* Authenticated User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['freelancer', 'empresa', 'administrador']} />}>
          <Route path="/user" element={<User />} />
          <Route path="/soporte/crearticket" element={<CrearTicket />} />
          <Route path="/soporte/ticket/:id_ticket" element={<VerTicket />} />
      </Route>

      {/* Freelancer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
        <Route path="/freelancer" element={<FreeLancer />} />
        <Route path="/mypostulations" element={<MyPostulations />} />
        
        <Route path="/freelancer-profile" element={<FreelancerProfileLayout/>}>
          <Route index element={<ViewPerfilFreeLancer/>} />
          <Route path="view-profile" element={<ViewPerfilFreeLancer />} />
          <Route path="my-postulations" element={<MyPostulations />} />
          <Route path="availability" element={<MyAvailability />} />
        </Route>

        {/* <Route path="/viewperfilfreelancer" element={<FreelancerProfile />} />  */}
        <Route path="/viewperfilfreelancer" element={<ViewPerfilFreeLancer />} />
        <Route path="/viewmoredetailsfreelancer" element={<ViewMoreDetailsFreelancer />} />
      </Route>

      {/* Empresa Routes */}
      <Route element={<ProtectedRoute allowedRoles={['empresa']} />}>
        <Route path="/empresa" element={<Empresa />} />
        <Route path="/myprojects" element={<MyProjects />} />

        {/* <Route path="/viewperfilempresa" element={<ViewPerfilEmpresa />} /> */}

        <Route path="/company-profile" element={<EmpresaProfileLayout />}>
          {/* Redirect the base path to the first section */}
          <Route index element={<EmpresaInfo />} />
          <Route path="info" element={<EmpresaInfo />} />
          <Route path="representante" element={<RepresentanteInfo />} />
          <Route path="acceso" element={<EmpresaAccess />} />
        </Route>

        <Route path="/findfreelancer" element={<FindFreelancer />} />
        <Route path="/viewfreelancer/:id" element={<ViewFreelancer />} />
        <Route path="/projects/edit/:id" element={<EditProjectPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/adminhome" element={<AdminHome />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="usermanagement" element={<UserManagement />}>
                <Route index element={<UserTable />} />
                <Route path="users" element={<UserTable />} />
                <Route path="users/edit/:id" element={<UserEditPage />} />
                <Route path="roles" element={<AdminRoles />} />
            </Route>
            <Route path="projectmanagement" element={<ProjectManagement />} />
            <Route path="reviewmanagement" element={<ReviewManagement />} />
            <Route path="supportmanagement" element={<SupportManagement />} />
            <Route path="paymentmanagement" element={<PaymentManagement />} />
            <Route path="notificationmanagement" element={<NotificationManagement />} />
            <Route path="auditandsecurity" element={<AuditAndSecurity />} />
            <Route path="admin/support" element={<SupportTable />} />
            <Route path="admin/support/:id_ticket" element={<SupportChat />} />
        </Route>
      </Route>

    </Routes>
  );
};

export default AppRoutes;