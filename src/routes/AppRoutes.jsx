import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import General components
// import {  BusquidyPage, AboutUsPage } from '@pages/General';
// import { User, Unauthorized, PaymentReturn, NotAuthenticated, NotFoundPage } from '@pages/User';

const AboutUsPage = lazy(()=>import('@pages/General/AboutUsPage'));
const Home = lazy(() => import('@pages/General/Home')); 
const BusquidyPage = lazy(() => import('@pages/General/BusquidyPage'));
const User = lazy(() => import('@pages/User/User')); // No @pages/User
const Unauthorized = lazy(() => import('@pages/User/Unauthorized'));
const PaymentReturn = lazy(() => import('@pages/User/PaymentReturn'));
const NotAuthenticated = lazy(() => import('@pages/User/NotAuthenticated'));
const NotFoundPage = lazy(() => import('@pages/User/NotFoundPage'));
const FindFreelancer = lazy(() => import('@pages/Empresa/FindFreelancer'));
const SoporteHome = lazy(() => import('@pages/Soporte/SoporteHome'));
const ProjectList = lazy(() =>import('@/pages/Publications/ProjectList'));
const UserManagement = lazy(()=> import('@pages/Admin/UserManagement'));
const Empresa = lazy(()=> import('@pages/Empresa/Empresa'));
const TakeTest = lazy(() => import('@/pages/Freelancer/TakeTest'));
const CrearTicketPublico = lazy(()=>import('@pages/Soporte/CrearTicketPublico'));
const NotificationsPage = lazy(() => import('@/pages/Notifications/NotificationsPage'));
const PreciosPage = lazy(() => import('@pages/General/PreciosPage'));
const ForgotPasswordPage = lazy(() => import('@pages/User/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@pages/User/ResetPasswordPage'));
const SettingsPage = lazy(() => import('@pages/Shared/SettingsPage'));
const MyTransactionsPage = lazy(() => import('@pages/Shared/MyTransactionsPage'));
const RegisterPage = lazy(() => import('@/pages/User/RegisterPage'));
const LoginPage = lazy(() => import('@/pages/User/LoginPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/General/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/General/TermsOfServicePage'));
const InterviewRequestPage = lazy(() => import('@/pages/InterviewRequestPage'));
const VerificarDocumentosPage = lazy(() => import('@/pages/User/VerificarDocumentosPage'));
const VerificacionManagement = lazy(() => import('@/pages/Admin/VerificacionManagement'));
const VerificacionDetalle = lazy(() => import('@/pages/Admin/VerificacionDetalle'));

import AuthCallback from '@/pages/User/AuthCallback';
import CompleteProfile from '@/pages/User/CompleteProfile';

import LoadingScreen from '@/components/LoadingScreen';
import SubscriptionManagement from '@/components/Payments/SubscriptionManagement';

// Import Empresa components
import { MyProjects, ViewFreelancer, ProjectView } from '@pages/Empresa';

// Import Freelancer components
import { FreeLancer, MyPostulations, ViewPerfilFreeLancer, FreelancerProfileLayout, MyActiveProjects, ActiveProjectDetail} from '@pages/Freelancer';

import VideoCallPage from "@pages/Video/VideoCallPage";
import MyCallsPage from "@pages/Video/MyCallsPage";

// Import Soporte components
import { CrearTicket, VerTicket, VerTicketPublico, BusquidyGuia } from "@pages/Soporte";

import EditProjectPage from '@/components/Empresa/Projects/ProjectForm/EditProjectPage';

import ChatPage from '@/pages/Chat/ChatPage';

// Import Admin components
import {AdminHome, ProjectManagement, ReviewManagement, SupportManagement, PaymentManagement, NotificationManagement, AuditAndSecurity, DisputeManagement } from '@pages/Admin';
import { Dashboard, UserTable, SupportTable, SupportChat, AdminRoles, UserEditPage } from '@components/Admin';


// Import  protected route components
import ProtectedRoute from './ProtectedRoute';
import ProtectedAdminRoute from './ProtectedAdminRoute'; // You can keep this or merge logic into the new one
import MyAvailability from '@/pages/Freelancer/MyAvailability';
import EmpresaProfileLayout from '@/pages/Empresa/EmpresaProfileLayout';
import EmpresaInfo from '@/components/Empresa/Perfil/EmpresaInfo';
import RepresentanteInfo from '@/components/Empresa/Perfil/RepresentanteInfo';
import EmpresaAccess from '@/components/Empresa/Perfil/EmpresaAccess';
import ManageBusquidyTest from '@/pages/Admin/ManageBusquidyTest';


const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/privacidad" element={<PrivacyPolicyPage />} />
      <Route path="/terminos" element={<TermsOfServicePage />} />

      <Route path="/busquidypage" element={<BusquidyPage />} />
      <Route path="/sobrenosotrospage" element={<AboutUsPage />} />
      <Route path="/projectlist" element={<ProjectList />} />
      <Route path="/payment/return" element={<PaymentReturn />} />
      <Route path="/notauthenticated" element={<NotAuthenticated />} />
      <Route path="/precios" element={<PreciosPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verificar-documentos" element={<VerificarDocumentosPage />} />

      {/* Nuevas rutas de Callback de OAuth */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/complete-profile" element={<CompleteProfile />} />

      {/* Chat Routes */}
      <Route element={<ProtectedRoute allowedRoles={['freelancer', 'empresa_juridico', 'empresa_natural']} />}>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
      </Route>

      {/* Soporte Routes (Public and Private) */}
      <Route path="/busquidyGuia" element={<BusquidyGuia />} />
      <Route path="/soportehome" element={<SoporteHome />} />
      <Route path="/soporte/crearticket-publico" element={<CrearTicketPublico />} />
      <Route path="/soporte/ticket-publico/:id_ticket" element={<VerTicketPublico />} />

      <Route path="/video/:roomId" element={<VideoCallPage />} />
      <Route path="/my-calls" element={<MyCallsPage />} />

      {/* Authenticated User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['freelancer', 'empresa_juridico', 'empresa_natural', 'administrador']} />}>
          <Route path="/user" element={<User />} />
          <Route path="/soporte/crearticket" element={<CrearTicket />} />
          <Route path="/soporte/ticket/:id_ticket" element={<VerTicket />} />
      </Route>

      {/* Freelancer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
        <Route path="/freelancer" element={<FreeLancer />} />
        <Route path="/interview/request/:id_solicitud" element={<InterviewRequestPage />} />
        
        <Route path="/freelancer-profile" element={<FreelancerProfileLayout/>}>
          <Route index element={<ViewPerfilFreeLancer/>} />
          <Route path="view-profile" element={<ViewPerfilFreeLancer />} />
          <Route path="my-postulations" element={<MyPostulations />} />
          <Route path="availability" element={<MyAvailability />} />
          <Route path="subscription" element={<SubscriptionManagement />} />
          <Route path="configuracion" element={<SettingsPage />} />
          <Route path="take-test" element={<TakeTest />} />
          <Route path="mis-transacciones" element={<MyTransactionsPage />} />
          <Route path="mis-trabajos" element={<MyActiveProjects />} />
          <Route path="mis-trabajos/:idProyecto" element={<ActiveProjectDetail />} />
          
        </Route>        
      </Route>

      {/* Empresa Routes */}
      <Route element={<ProtectedRoute allowedRoles={['empresa_juridico', 'empresa_natural']} />}>
        <Route path="/empresa" element={<Empresa />} />
        <Route path="/myprojects" element={<MyProjects />} />
        <Route path="/empresa/proyectos/:idProyecto" element={<ProjectView/>}/>
        <Route path="/company-profile" element={<EmpresaProfileLayout />}>
          {/* Redirect the base path to the first section */}
          <Route index element={<EmpresaInfo />} />
          <Route path="info" element={<EmpresaInfo />} />
          <Route path="representante" element={<RepresentanteInfo />} />
          <Route path="acceso" element={<EmpresaAccess />} />
          <Route path="subscription" element={<SubscriptionManagement />} />
          <Route path="configuracion" element={<SettingsPage />} />
          <Route path="mis-transacciones" element={<MyTransactionsPage />} />
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
            <Route path="busquidy-test" element={<ManageBusquidyTest />} />
            <Route path="/adminhome/verificaciones" element={<VerificacionManagement />} />
            <Route path="/adminhome/verificaciones/detalle/:id" element={<VerificacionDetalle />} />
            <Route path="projectmanagement" element={<ProjectManagement />} />
            <Route path="reviewmanagement" element={<ReviewManagement />} />
            <Route path="supportmanagement" element={<SupportManagement />} />
            <Route path="paymentmanagement" element={<PaymentManagement />} />
            <Route path="notificationmanagement" element={<NotificationManagement />} />
            <Route path="auditandsecurity" element={<AuditAndSecurity />} />
            <Route path="admin/support" element={<SupportTable />} />
            <Route path="admin/support/:id_ticket" element={<SupportChat />} />
            <Route path="/adminhome/disputes" element={<DisputeManagement />} />
        </Route>
      </Route>

      {/* Notifications Route */}
      <Route element={<ProtectedRoute allowedRoles={['freelancer', 'empresa_juridico', 'empresa_natural', 'administrador']} />}>
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
    
    <Route path="*" element={<NotFoundPage />} />

    </Routes>
    </Suspense>
  );
};

export default AppRoutes;