import AuthContext from 'app/contexts/JWTAuthContext';

const AboutPage = Loadable(lazy(() => import('./About')));
const Home = Loadable(lazy(() => import('./Home')));
const Catalog = Loadable(lazy(() => import('./Catalog')));
const Reports = Loadable(lazy(() => import('./Reports')));
const ResetPassword = Loadable(lazy(() => import('./ResetPassword')));
const AdminApps = Loadable(lazy(() => import('./AdminApps')));
const SponsorApps = Loadable(lazy(() => import('./SponsorApps')));
const Apply = Loadable(lazy(() => import('./Apply')));
const AccountInfo = Loadable(lazy(() => import('./AccountInfo')));

const { user } = useContext(AuthContext);

const pageRoutes = () => {
    const { user } = useAuth();

    // Define role-based route components
    let AdminDash, SponsorDash, DriverDash;
    switch (user.role) {
        case 'admin':
            AdminDash = Loadable(lazy(() => import('./AdminDash')));
            break;
        case 'sponsor':
            SponsorDash = Loadable(lazy(() => import('./SponsorDash')));
            break;
        case 'driver':
            DriverDash = Loadable(lazy(() => import('./DriverDash')));
            break;
        default:
            break;
    }
    return [
        {
            path: '/pages/about',
            element: <AboutPage />,
        },
        {
            path: '/pages/home',
            element: <Home />,
        },
        {
            path: '/pages/catalog',
            element: <Catalog />,
        },
        {
            path: '/pages/reports',
            element: <Reports />,
        },
        {
            path: '/pages/resetPassword',
            element: <ResetPassword />,
        },
        {
            path: '/pages/AdminApps',
            element: <AdminApps />,
            admin: AdminDash, // Render AdminDash only for admin role
        },
        {
            path: '/pages/SponsorApps',
            element: <SponsorApps />,
            sponsor: SponsorDash, // Render SponsorDash only for sponsor role
        },
        {
            path: '/pages/apply',
            element: <Apply />,
            driver: DriverDash, // Render DriverDash only for driver role
        },
        {
            path: '/pages/accountInfo',
            element: <AccountInfo />,
        },
    ];
};

export default pageRoutes;