import React, { useEffect } from 'react';
//import AuthContext from './AuthContext';
import useAuth from 'app/hooks/useAuth';

const SessionTimeout = ({ timeoutInSeconds }) => {
    const { logout } = useAuth();
    // const timeoutInSeconds = 150;

    useEffect(() => {
        let timeout;

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                //call logout when timer expires
                logout();
            }, timeoutInSeconds * 1000);
        };

        const handleUserActivity = () => {
            resetTimer();
        };

        // Attach event listeners for user activity
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('mousedown', handleUserActivity);
        window.addEventListener('keypress', handleUserActivity);
        window.addEventListener('scroll', handleUserActivity);

        // Start timer on component mount
        resetTimer();

        // Cleanup: remove event listeners and clear timer
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('mousedown', handleUserActivity);
            window.removeEventListener('keypress', handleUserActivity);
            window.removeEventListener('scroll', handleUserActivity);
        };
    }, [timeoutInSeconds]);

    return <div></div>;
};

export default SessionTimeout;
