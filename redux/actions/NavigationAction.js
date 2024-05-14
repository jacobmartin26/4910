import { AuthContext } from 'app/contexts/JWTAuthContext';
import { navigations } from 'app/navigations';

export const SET_USER_NAVIGATION = 'SET_USER_NAVIGATION';
export const TOGGLE_VIEW = 'TOGGLE_VIEW';

const getfilteredNavigations = (navList = [], role) => {
  return navList.reduce((array, nav) => {
    if (nav.auth) {
      if (nav.auth.includes(role)) {
        array.push(nav);
      }
    } else {
      if (nav.children) {
        nav.children = getfilteredNavigations(nav.children, role);
        array.push(nav);
      } else {
        array.push(nav);
      }
    }
    return array;
  }, []);
};

export const getNavigationByUser = (role) => ({
  type: SET_USER_NAVIGATION,
  payload: role,
});

/** 
  return (dispatch, getState) => {
    let { navigations = [] } = getState();

    console.log('user role: ', role);

    let filteredNavigations = getfilteredNavigations(navigations, role);

    dispatch({
      type: SET_USER_NAVIGATION,
      payload: filteredNavigations,
    });
  };
}
**/

export const toggleView = (newView) => ({
  type: TOGGLE_VIEW,
  payload: newView,
});