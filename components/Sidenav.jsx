import { styled } from '@mui/system';
import { MatxVerticalNav } from 'app/components';
import useSettings from 'app/hooks/useSettings';
// eslint-disable-next-line
import { navigations } from 'app/navigations';
import { Fragment, useEffect } from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import { useSelector, useDispatch } from 'react-redux';
import { getNavigationByUser } from 'app/redux/actions/NavigationAction';
import useAuth from 'app/hooks/useAuth';

const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingLeft: '1rem',
  paddingRight: '1rem',
  position: 'relative',
}));

const SideNavMobile = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100vw',
  background: 'rgba(0, 0, 0, 0.54)',
  zIndex: -1,
  [theme.breakpoints.up('lg')]: { display: 'none' },
}));
const Sidenav = ({ children }) => {
  const { settings, updateSettings } = useSettings();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const filteredNavigations = useSelector(state => state.navigations.filteredNavigations);

  useEffect(() => {
    if (user && user.role) {
      console.log('user role: ', user.role);
      dispatch(getNavigationByUser(user.role)); // Dispatch action to filter navigations based on user's role
    }
  }, [dispatch, user]);

  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + 'Settings';
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  return (
    <Fragment>
      <StyledScrollBar options={{ suppressScrollX: true }}>
        {children}
        <MatxVerticalNav items={filteredNavigations} />
      </StyledScrollBar>

      <SideNavMobile onClick={() => updateSidebarMode({ mode: 'close' })} />
    </Fragment>
  );
};

export default Sidenav;