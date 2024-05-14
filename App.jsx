import React from 'react';
import { Provider } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { MatxTheme } from './components';
import { AuthProvider } from './contexts/JWTAuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Store } from './redux/Store';
import routes from './routes';
import SessionTimeout from 'app/views/sessions/SessionTimeout'; // Import the SessionTimeout component

const App = () => {
  const content = useRoutes(routes);

  return (
    <Provider store={Store}>
      <SettingsProvider>
        <MatxTheme>
          <AuthProvider>
            {/* Include the SessionTimeout component */}
            <SessionTimeout timeoutInSeconds={1000} /> {/* Set timeoutInSeconds as needed */}
            {content}
          </AuthProvider>
        </MatxTheme>
      </SettingsProvider>
    </Provider>
  );
};

export default App;
