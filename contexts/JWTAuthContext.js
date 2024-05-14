import React, { createContext, useEffect, useReducer, useState } from 'react'
import jwtDecode from 'jwt-decode'
import axios from 'axios.js'
import { MatxLoading } from 'app/components'
import { authenticate, cognitoLogout } from 'app/auth/services/authenticate'
import userpool from '../auth/userpool'
import API from '../components/API/API'
import { getNavigationByUser } from 'app/redux/actions/NavigationAction';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user: {
                    ...user,
                    role: user.role // Assuming the user object already contains the role
                },
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'UPDATE': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
    changeEmail: () => Promise.resolve(),
    changePassword: () => Promise.resolve()
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [users, setUsers] = useState([])
    const [role, setRole] = useState(null); // State for user's role
    const [stat, setStat] = useState(null);
    const [loading, setLoading] = useState(false)

    const login = async (email, password) => {
        setLoading(true);
    
        try {
            const result = await authenticate(email, password);
    
            console.log(result);
            let accessToken = result.getAccessToken().getJwtToken();
            setSession(accessToken);
    
            const userRes = await API.get('Users/email/' + email);
            const userData = userRes.data;
    
            console.log(userData);
            let user = {
                id: userData.user_id[0],
                avatar: 'some_avi',
                email: userData.user_id[4],
                name: userData.user_id[1] + " " + userData.user_id[2],
                role: userData.user_id[3],
                stat: userData.user_id[6],
            };
    
            setRole(user.role);
            setStat(user.stat);
            console.log('stat: ' + user.stat)
    
            if (user.stat === 1) {
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        user,
                    },
                });
    
                dispatch(getNavigationByUser(user.role));
                console.log('user role: ', user.role);
                setLoading(false);
            }
    
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };
    

    // const [users, setUsers] = useState([]);

    // API.get('/Users/' + user.email)
    //  .then(res => {
    //     const data = res.data;
    //     this.setUsers({ data });
    //     console.log(data);
    // })

    const register = async (email, username, password) => {
        const response = await axios.post('/api/auth/register', {
            email,
            username,
            password,
        })

        const { accessToken, user } = response.data

        setSession(accessToken)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const logout = () => {
        setSession(null)
        cognitoLogout();
        dispatch({ type: 'LOGOUT' })
    }

    const getUserSession = (currentUser) => {
        return new Promise((resolve, reject) => {
            currentUser.getSession((err, session) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(session);
                }
            });
        });
    };

    const changeEmail = async (currentEmail, password, newEmail) => {
        try {
            // Update user email in database via API call
            const response = await API.post('/Users/email/update', {
                currentEmail: currentEmail,
                newEmail: newEmail
            })
            //});

            // Check if the response is successful (status code 200)
            if (response.status !== 200) {
                throw new Error('Failed to update user email');
            }
            const currentUser = userpool.getCurrentUser();

            if (!currentUser) {
                throw new Error('User is not authenticated');
            }

            // Retrieve the current user session using a Promise
            const session = await getUserSession(currentUser);

            // Retrieve the access token from the session
            const accessToken = session.getAccessToken().getJwtToken();

            // Update the email in Cognito
            currentUser.updateAttributes([
                {
                    Name: 'email',
                    Value: newEmail
                }
            ], (updateErr, result) => {
                if (updateErr) {
                    console.error('Error updating email:', updateErr);
                    throw updateErr; // Rethrow the error to the outer try-catch block
                }

                // If the update is successful, update the user's email in the state
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        user: {
                            ...state.user,
                            email: newEmail
                        }
                    }
                });

                console.log('Email changed successfully');
            }, null); // Pass accessToken as the third argument

        } catch (error) {
            console.error('Error changing email:', error);
            return Promise.reject(error);
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            const currentUser = userpool.getCurrentUser();

            if (!currentUser) {
                throw new Error('User is not authenticated');
            }

            // Retrieve the current user session using a Promise
            const session = await getUserSession(currentUser);

            // Retrieve the access token from the session
            const accessToken = session.getAccessToken().getJwtToken();

            // Change the password using Cognito's changePassword method
            return new Promise((resolve, reject) => {
                currentUser.changePassword(oldPassword, newPassword, (changePasswordErr, result) => {
                    if (changePasswordErr) {
                        console.error('Error changing password:', changePasswordErr);
                        reject(changePasswordErr);
                    } else {
                        console.log('Password changed successfully');
                        resolve(result);
                    }
                });
            });

        } catch (error) {
            console.error('Error changing password:', error);
            return Promise.reject(error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken')

                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken)
                    //const response = await axios.get('/api/auth/profile')
                    //const { user } = response.data

                    let thisUser = userpool.getCurrentUser();

                    await API.get('Users/email/' + thisUser.username)
                        .then(res => {
                            const data = res.data;
                            setUsers({ data });
                        });

                    console.log(users);


                    let user = {
                        id: users.data.user_id[0],
                        avatar: 'some_avi',
                        email: users.data.user_id[4],
                        name: users.data.user_id[1] + " " + users.data.user_id[2],
                        role: users.data.user_id[3],
                        stat: users.data.user_id[6],
                    };

                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
        // eslint-disable-next-line
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
                changeEmail,
                changePassword
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
