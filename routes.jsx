import AuthGuard from 'app/auth/AuthGuard';
import { authRoles } from "app/auth/authRoles";
import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
//import pageRoutes from './views/pages/PageRoutes';

const AboutPage = Loadable(lazy(() => import('./views/pages/About')));
const Home = Loadable(lazy(() => import('./views/pages/Home')));
const DriverDash = Loadable(lazy(() => import('./views/pages/DriverDash')));
const SponsorDash = Loadable(lazy(() => import('./views/pages/SponsorDash')));
const AdminDash = Loadable(lazy(() => import('./views/pages/AdminDash')));
const Catalog = Loadable(lazy(() => import('./views/pages/Catalog')));
const Reports = Loadable(lazy(() => import('./views/pages/Reports')));
const ResetPassword = Loadable(lazy(() => import('./views/pages/ResetPassword')));
const AdminApps = Loadable(lazy(() => import('./views/pages/AdminApps')));
const SponsorApps = Loadable(lazy(() => import('./views/pages/SponsorApps')));
const Apply = Loadable(lazy(() => import('./views/pages/Apply')));
const AccountInfo = Loadable(lazy(() => import('./views/pages/AccountInfo')));
const AboutEdit = Loadable(lazy(() => import('./views/pages/AboutEdit')));
const Points = Loadable(lazy(() => import('./views/pages/Points')));
const AdminPoints = Loadable(lazy(() => import('./views/pages/AdminPoints')));
const AuditLog = Loadable(lazy(() => import('./views/pages/AuditLog')));
const NewSponUser = Loadable(lazy(() => import('./views/pages/NewSponUser')));
const Verify = Loadable(lazy(() => import('./views/pages/Verify')));
const Cart = Loadable(lazy(() => import('./views/pages/Cart')));
const Orders = Loadable(lazy(() => import('./views/pages/Orders')));
const NewUser = Loadable(lazy(() => import('./views/pages/NewUser')));
const SponReports = Loadable(lazy(() => import('./views/pages/SponReports')));
const DriverApps = Loadable(lazy(() => import('./views/pages/DriverApps')));
const FAQ = Loadable(lazy(() => import('./views/pages/Faq')));
const AccountEdit = Loadable(lazy(() => import('./views/pages/AccountEdit')));
const UserToComp = Loadable(lazy(() => import('./views/pages/UserToComp')));
const AdminPointCon = Loadable(lazy(() => import('./views/pages/AdminPointCon')));


const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [...dashboardRoutes, ...chartsRoute, ...materialRoutes,
    {
      path: '/pages/about',
      element: <AboutPage />,
      // auth: true
    },
    {
      path: '/pages/home',
      element: <Home />,
      //auth: true
    },
    {
      path: '/pages/adminDash',
      element: <AdminDash />,
      auth: authRoles.admin
    },
    {
      path: '/pages/sponsorDash',
      element: <SponsorDash />,
      auth: authRoles.editor
    },
    {
      path: '/pages/DriverDash',
      element: <DriverDash />,
      auth: authRoles.guest
    },
    {
      path: '/pages/catalog',
      element: <Catalog />,
      //auth: true
    },
    {
      path: '/pages/Reports',
      element: <Reports />,
      auth: authRoles.admin
    },
    {
      path: '/pages/resetPassword',
      element: <ResetPassword />,
      //auth: true
    },
    {
      path: 'pages/AuditLog',
      element: <AuditLog />,
      //auth: true
    },
    {
      path: '/pages/accountInfo',
      element: <AccountInfo />,
      //auth: true
    },
    {
      path: '/pages/apply',
      element: <Apply />,
      //auth: true
    },
    {
      path: '/pages/aboutEdit',
      element: <AboutEdit />,
      // auth: true
    },
    {
      path: '/pages/points',
      element: <Points />,
      auth: authRoles.editor,
    },
    {
      path: '/pages/points/admin',
      element: <AdminPoints />,
      // auth: true,
    },
    {
      path: '/pages/AdminApps',
      element: <AdminApps />,
      auth: authRoles.admin,
    },
    {
      path: '/pages/SponsorApps',
      element: <SponsorApps />,
      auth: authRoles.editor
    },
    {
      path: '/pages/NewSponUser',
      element: <NewSponUser />,
      auth: authRoles.editor
    },
    {
      path: '/pages/Verify',
      element: <Verify />,
      //auth: authRoles.editor
    },
    {
      path: '/pages/Cart',
      element: <Cart />,
      auth: authRoles.editor
    },
    {
      path: '/pages/Orders',
      element: <Orders />,
      auth: authRoles.editor
    },
    {
      path: '/pages/NewUser',
      element: <NewUser />,
      auth: authRoles.editor
    },
    {
      path: '/pages/SponReports',
      element: <SponReports />,
      auth: authRoles.editor
    },
    {
      path: '/pages/DriverApps',
      element: <DriverApps />,
      auth: authRoles.guest
    },
    {
      path: '/pages/Faq',
      element: <FAQ />,
    },
    {
      path: '/pages/accountEdit',
      element: <AccountEdit />,
      // auth: true
    },
    {
      path: '/pages/UserToComp',
      element: <UserToComp />,
      auth: authRoles.admin
    },
    {
      path: '/pages/AdminPointCon',
      element: <AdminPointCon />,
      auth: authRoles.admin
    },
    ]
  },

  ...sessionRoutes,
  { path: '/', element: <Navigate to="/pages/about" /> },
  { path: '*', element: <NotFound /> },
];

// Dashboard route: dashboard/default

export default routes;
