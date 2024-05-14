import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
// import ProtectedRoute from './protectedRoutes';
// import { authRoles } from 'app/auth/authRoles';

const AboutPage = Loadable(lazy(() => import('./About')));
const Home = Loadable(lazy(() => import('./Home')));
//const DriverDash = Loadable(lazy(() => import('./DriverDash')));
const SponsorDash = Loadable(lazy(() => import('./SponsorDash')));
const AdminDash = Loadable(lazy(() => import('./AdminDash')));
const Catalog = Loadable(lazy(() => import('./Catalog')));
const Reports = Loadable(lazy(() => import('./Reports')));
const ResetPassword = Loadable(lazy(() => import('./ResetPassword')));
const AdminApps = Loadable(lazy(() => import('./AdminApps')));
const SponsorApps = Loadable(lazy(() => import('./SponsorApps')));
const Apply = Loadable(lazy(() => import('./Apply')));
const AccountInfo = Loadable(lazy(() => import('./AccountInfo')));
const AboutEdit = Loadable(lazy(() => import('./AboutEdit')));
const Points = Loadable(lazy(() => import('./Points')));
const AdminPoints = Loadable(lazy(() => import('./AdminPoints')));
const AuditLog = Loadable(lazy(() => import('./AuditLog')));
const NewSponUser = Loadable(lazy(() => import('./NewSponUser')));
const Verify = Loadable(lazy(() => import('./Verify')));
const NewUser = Loadable(lazy(() => import('./NewUser')));
const Cart = Loadable(lazy(() => import('./Cart')));
const Orders = Loadable(lazy(() => import('./Orders')));
const SponReports = Loadable(lazy(() => import('./SponReports')));

const pageRoutes = [
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
        //element: <ProtectedRoute role={authRoles.admin}><AdminDash /></ProtectedRoute>,
        element: <AdminDash />,
        //auth: authRoles.admin
    },
    {
        path: '/pages/sponsorDash',
        //element: <ProtectedRoute><SponsorDash /></ProtectedRoute>,
        element: <SponsorDash />,
        //auth: authRoles.admin
    },
    {
        path: '/pages/driverDash',
        // element: <ProtectedRoute role={authRoles.guest}><DriverDash /></ProtectedRoute>,
        element: <DriverDash />,
        //auth: authRoles.guest
    },
    {
        path: '/pages/catalog',
        element: <Catalog />,
        //auth: true
    },
    {
        path: '/pages/Reports',
        element: <Reports />,
        //auth: true
    },
    {
        path: '/pages/resetPassword',
        element: <ResetPassword />,
        //auth: true
    },
    {
        path: '/pages/AdminApps',
        element: <AdminApps />,
    },
    {
        path: '/pages/SponsorApps',
        element: <SponsorApps />,
    },
    {
        path: '/pages/apply',
        element: <Apply />,
    },
    {
        path: '/pages/accountInfo',
        element: <AccountInfo />,
    },
    {
        path: '/pages/aboutEdit',
        element: <AboutEdit />,
        // auth: true
    },
    {
        path: '/pages/points',
        element: <Points />,
    },
    {
        path: '/pages/points/admin',
        element: <AdminPoints />,
    },
    {
        path: '/pages/AuditLog',
        element: <AuditLog />,
    },
    {
        path: 'pages/Reports',
        element: <Reports/>
    },
    {
        path: 'pages/NewSponUser',
        element: <NewSponUser/>
    },
    {
        path: 'pages/Verify',
        element: <Verify/>
    },
    {
        path: '/pages/cart',
        element: <Cart />,
    },
    {
        path: '/pages/orders',
        element: <Orders />,
    },
    {
        path: '/pages/NewUser',
        element: <NewUser />,
    },
    {
        path: '/pages/SponReports',
        element: <SponReports />,
    },
];
export default pageRoutes;