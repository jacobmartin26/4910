import React, { useState } from 'react';
//import API from 'app/components/API/API';

const PasswordChange = () => {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [resetResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        else if (name === 'currentPassword') setCurrentPassword(value);
        else if (name === 'newPassword') setNewPassword(value);
        else if (name === 'confirmPassword') setConfirmPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const apiUrl = 'http://http://tigertruckerstest.us-east-1.elasticbeanstalk.com/api/proxy/resetPassword';
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, currentPassword, newPassword })
            });
            console.log('Response:', response); // Log the response

            //if (!response.ok) {
            //    throw new Error('Network response was not ok');
            // }
            if (response.ok) {
                console.log('Password changed successfully!');
                // Handle success case here if needed
            } else {
                console.log('Failed to change password:', response.statusText);
                setError('Failed to change password. Please try again later.');
            }

            // const responseData = await response.json();
            //setResetResponse(responseData);
        } catch (error) {
            console.error('Error while changing password:', error);
            setError('Failed to change password. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Current Password:</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                {error && <div>{error}</div>}
                {resetResponse && <div>{resetResponse.message}</div>}
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default PasswordChange;

