import { navigations } from 'app/navigations';
import { SET_USER_NAVIGATION, TOGGLE_VIEW } from '../actions/NavigationAction';

const initialState = {
  allNavigations: [...navigations], // Original navigation items
  filteredNavigations: [...navigations], // Initially, both filtered and original navigations are the same
};

const NavigationReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_NAVIGATION: {
      const role = action.payload;
      console.log('role', role);

      // Filter the navigation items based on the new view
      const filteredNavigation = state.allNavigations.filter(item => {
        if (role === 1) {
          // For driver's view (newView === 1), exclude navigation items meant for sponsors and admins
          return !['pages/sponsorDash', 'pages/adminDash', 'pages/Reports', 'pages/points/admin', 'pages/AuditLog', 'pages/AdminApps', 'pages/AuditLog','pages/SponsorApps','pages/SponReports','pages/points','pages/Verify'].includes(item.path);        }
        if (role === 2) {
          return !['pages/adminDash', 'pages/points/admin', 'pages/Reports', 'pages/AdminApps', 'pages/apply','pages/driverDash'].includes(item.path);
        } else {
          // For admin view, include all items
          return !['pages/sponsorDash', 'pages/SponsorApps','pages/points','pages/SponReports','pages/apply','pages/driverDash'].includes(item.path);
        }
      });
      return {
        ...state,
        filteredNavigations: filteredNavigation,
      };
    }
    case TOGGLE_VIEW: {
      const newView = action.payload;
      console.log("newView: ", newView);

      // Filter the navigation items based on the new view
      const filteredNavigation = state.allNavigations.filter(item => {
        if (newView === 1) {
          // For driver's view (newView === 1), exclude navigation items meant for sponsors and admins
          return !['pages/sponsorDash', 'pages/adminDash', 'pages/Reports', 'pages/points/admin', 'pages/AuditLog', 'pages/AdminApps', 'pages/AuditLog','pages/SponsorApps','pages/SponReports','pages/points','pages/Verify'].includes(item.path);
        }
        if (newView === 2) {
          return !['pages/adminDash', 'pages/points/admin', 'pages/Reports', 'pages/AdminApps', 'pages/apply','pages/driverDash'].includes(item.path);
        } else {
          // For sponsor/admin view, include all items
          return !['pages/sponsorDash', 'pages/SponsorApps','pages/points','pages/SponReports','pages/apply','pages/driverDash'].includes(item.path);
        }
      });

      // Return the new state object with the filtered navigation items
      return {
        ...state,
        filteredNavigations: filteredNavigation,
      };
    }
    default: {
      return state;
    }
  }
};

export default NavigationReducer;