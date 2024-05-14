import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import userpool from "../userpool";
import API from 'app/components/API/API';

export const getSession = async () => {
    return await new Promise((resolve, reject) => {
        const user = userpool.getCurrentUser();
        if (user) {
            user.getSession(async (err, session) => {
                if (err) {
                    reject(err);
                } else {
                    const attributes = await getUserAttributes(user);
                    resolve({
                        user,
                        ...session,
                        ...attributes
                    });
                }
            });
        } else {
            reject(new Error("User not found"));
        }
    });
};

const getUserAttributes = (user) => {
    return new Promise((resolve, reject) => {
        user.getUserAttributes((err, attributes) => {
            if (err) {
                reject(err);
            } else {
                const results = {};
                for (let attribute of attributes) {
                    const { Name, Value } = attribute;
                    results[Name] = Value;
                }
                resolve(results);
            }
        });
    });
};

export const authenticate = (Email, Password) => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: Email,
            Pool: userpool,
        });

        const authDetails = new AuthenticationDetails({
            Username: Email,
            Password,
        });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                resolve(result);
            },
            onFailure: (err) => {
                // If authentication fails, increment failed login attempts
                incrementFailedAttempts(Email)
                    .then(() => {
                        reject(err); // Reject with the original authentication error
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        });
    });
};

const incrementFailedAttempts = (email) => {
    return new Promise((resolve, reject) => {
        // Call your API endpoint to increment failed login attempts
        API.post('increment_failed_attempts', { email })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const cognitoLogout = () => {
    const user = userpool.getCurrentUser();
    if (user) {
        user.signOut();
    }
    window.location.href = '/';
};
