import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotFound = Loadable(lazy(() => import('./NotFound')));
const ForgotPassword = Loadable(lazy(() => import('./ForgotPassword')));
const JwtLogin = Loadable(lazy(() => import('./JwtLogin')));
const JwtRegister = Loadable(lazy(() => import('./JwtRegister')));
const VerifyCode = Loadable(lazy(() => import('./VerifyCode')));
//const DriverApp = Loadable(lazy(() => import('./DriverApp')));
const ChangePassword = Loadable(lazy(() => import('./changePassword')));
const ChangeEmail = Loadable(lazy(() => import('./changeEmail')));

// const CognitoLogin = Loadable(lazy(() => import('./CognitoLogin')));

const sessionRoutes = [
  { path: '/session/signup', element: <JwtRegister /> },
  { path: '/session/signin', element: <JwtLogin /> },
  { path: '/session/forgot-password', element: <ForgotPassword /> },
  { path: '/session/verify', element: <VerifyCode /> },
  { path: '/session/404', element: <NotFound /> },
  // { path: '/session/driverapp', element: <DriverApp /> },
  { path: '/session/changeEmail', element: <ChangeEmail /> },
  { path: '/session/changePassword', element: <ChangePassword /> },
];

export default sessionRoutes;
