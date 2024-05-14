export const navigations = [
  { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard', auth: [3, 2, 1] },
  { label: 'PAGES', type: 'label' },
  {
    name: 'Home',
    icon: 'home',
    path: 'pages/home',
    // auth: [3, 2, 1]
  },
  {
    name: 'About',
    icon: 'info',
    path: 'pages/about',
    // auth: [3, 2, 1]
  },
  {
    name: 'Driver Dashboard',
    icon: 'dashboard',
    path: 'pages/driverDash',
    // auth: [3, 2, 1]
  },
  {
    name: 'Sponsor Dashboard',
    icon: 'dashboard',
    path: 'pages/sponsorDash',
    auth: [3, 2]
  },
  {
    name: 'Admin Dashboard',
    icon: 'dashboard',
    path: 'pages/adminDash',
    auth: [3]
  },
  {
    name: 'Catalog',
    icon: 'store',
    path: 'pages/catalog',
    // auth: [3, 2, 1]
  },
  {
    name: 'Cart',
    icon: 'shopping_cart',
    path: 'pages/cart'
  },
  {
    name: 'Orders',
    icon: 'shopping_cart',
    path: 'pages/orders'
  },
  {
    name: 'Reports',
    icon: 'dashboard',
    path: 'pages/Reports',
    auth: [3]
  },
  {
    name: 'FAQ',
    icon: 'info',
    path: 'pages/faq',
    // auth: [3, 2, 1]
  },
  {
    name: 'Apply',
    icon: 'person',
    path: 'pages/apply',
    // auth: [3, 2, 1]
  },
  {
    name: 'Account Info',
    icon: 'person',
    path: 'pages/accountInfo',
    // auth: [3, 2, 1]
  },
  {
    name: 'Admin Applications',
    icon: 'person',
    path: 'pages/AdminApps',
    auth: [3]
  },
  {
    name: 'Sponsor Applications',
    icon: 'person',
    path: 'pages/SponsorApps',
    auth: [3, 2]
  },
  {
    name: 'Points',
    icon: 'star',
    path: 'pages/points',
    // auth: [3, 2, 1]
  },
  {
    name: 'Admin Points',
    icon: 'star',
    path: 'pages/points/admin',
    auth: [3]
  },
  {
    name: 'Audit Log',
    icon: 'info',
    path: 'pages/AuditLog',
    auth: [3, 2]
  },
  {
    name: 'Verify',
    icon: 'info',
    path: 'pages/Verify',
    //auth: [3]
  },
  {
    name: 'Sponsor Reports',
    icon: 'info',
    path: 'pages/SponReports',
    auth: [2]
  },
  //{
  //  name: 'Session/Auth',
  //  icon: 'security',
  //  children: [
  //    { name: 'Sign in', iconText: 'SI', path: '/session/signin' },
  //    { name: 'Sign up', iconText: 'SU', path: '/session/signup' },
  //     { name: 'Forgot Password', iconText: 'FP', path: '/session/forgot-password' },
  //     { name: 'Error', iconText: '404', path: '/session/404' },
  //   ],
  // },
  // { label: 'Components', type: 'label' },
  // {
  //   name: 'Components',
  //   icon: 'favorite',
  //   badge: { value: '30+', color: 'secondary' },
  //   children: [
  //     { name: 'Auto Complete', path: '/material/autocomplete', iconText: 'A' },
  //     { name: 'Buttons', path: '/material/buttons', iconText: 'B' },
  //     { name: 'Checkbox', path: '/material/checkbox', iconText: 'C' },
  //     { name: 'Dialog', path: '/material/dialog', iconText: 'D' },
  //     { name: 'Expansion Panel', path: '/material/expansion-panel', iconText: 'E' },
  //     { name: 'Form', path: '/material/form', iconText: 'F' },
  //     { name: 'Icons', path: '/material/icons', iconText: 'I' },
  //     { name: 'Menu', path: '/material/menu', iconText: 'M' },
  //     { name: 'Progress', path: '/material/progress', iconText: 'P' },
  //     { name: 'Radio', path: '/material/radio', iconText: 'R' },
  //     { name: 'Switch', path: '/material/switch', iconText: 'S' },
  //     { name: 'Slider', path: '/material/slider', iconText: 'S' },
  //     { name: 'Snackbar', path: '/material/snackbar', iconText: 'S' },
  //     { name: 'Table', path: '/material/table', iconText: 'T' },
  //   ],
  // },
  // {
  //   name: 'Charts',
  //   icon: 'trending_up',
  //   children: [{ name: 'Echarts', path: '/charts/echarts', iconText: 'E' }],
  // },
  // {
  //   name: 'Documentation',
  //   icon: 'launch',
  //   type: 'extLink',
  //   path: 'http://demos.ui-lib.com/matx-react-doc/',
  // },
];