import React, { useEffect, useState, useContext } from 'react';
import API from "./API";
import AuthContext from 'app/contexts/JWTAuthContext';
import { LoadingButton } from '@mui/lab';
const { H3 } = require("app/components/Typography");


const GetUserApps = () => {
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(null); // State to hold the selected filter value
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUserData, setEditedUserData] = useState({});
    const [statusChangeMessage, setStatusChangeMessage] = useState(''); // State to hold status change message


    useEffect(() => {
        fetchUserApps();
    }, []);


    const fetchUserApps = async () => {
        try {
            const response = await API.get('/Users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching point changes:', error);
        }
    };

    // Function to get user type string
    const userTypeString = (type) => {
        switch (type) {
            case 1:
                return 'Driver';
            case 2:
                return 'Sponsor';
            case 3:
                return 'Admin';
            default:
                return '';
        }
    };

    // Function to filter users by user type
    const filterUsers = () => {
        if (filter === null) {
            return users; // Return all users if no filter is selected
        } else {
            return users.filter(user => user.userType === filter); // Filter users by selected user type
        }
    };

    const handleChangeStatus = async (userId, appstat) => {
        try {
            const response = await API.post('disable/user', {
                userid: userId,
                stat: appstat,
            });
            if (response.status === 200) {
                // Update the user status locally
                setUsers(users.map(user => user.user_id === userId ? { ...user, accountStatus: appstat } : user));
                setStatusChangeMessage(`User status changed successfully for user ID ${userId}.`);
                console.log('User status changed successfully');
            } else {
                console.error('Failed to change user status:', response.statusText);
            }
        } catch (error) {
            console.error('Error changing user status:', error);
        }
    };


    const handleEditUser = (userId) => {
        setEditingUserId(userId);
        const userToEdit = users.find(user => user.user_id === userId);
        setEditedUserData(userToEdit);
    };


    const handleSaveUser = async () => {
        try {
            const response = await API.post('/edited/user', editedUserData);
            if (response.status === 200) {
                // Update the user data with the edited user data
                setUsers(users.map(user => user.user_id === editedUserData.user_id ? editedUserData : user));
                // Reset editingUserId to exit edit mode
                setEditingUserId(null);
                // Clear the editedUserData state
                setEditedUserData({});
                console.log('User data updated successfully');
            } else {
                console.error('Failed to update user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    return (
        <div>
            {/* Filter dropdown */}
            <label htmlFor="filter">Filter by User Type:</label>
            <select id="filter" onChange={(e) => setFilter(e.target.value === 'all' ? null : parseInt(e.target.value))}>
                <option value="all">All</option>
                <option value="1">Drivers</option>
                <option value="2">Sponsors</option>
                <option value="3">Admins</option>
            </select>


            {statusChangeMessage && <p>{statusChangeMessage}</p>}


            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>User ID</th>
                        <th style={{ textAlign: 'center' }}>First Name</th>
                        <th style={{ textAlign: 'center' }}>Last Name</th>
                        <th style={{ textAlign: 'center' }}>User Type</th>
                        <th style={{ textAlign: 'center' }}>Email Address</th>
                        <th style={{ textAlign: 'center' }}>Account Status</th>
                        <th style={{ textAlign: 'center' }}>Action</th> {/* Added Action column header */}
                        <th style={{ textAlign: 'center' }}>Edit User</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map over filtered users */}
                    {filterUsers().map((user, index) => (
                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#e6f7ff' : '#ffffff' }}>
                            <td style={{ textAlign: 'center' }}>{user.user_id}</td>
                            <td style={{ textAlign: 'center' }}>
                                {editingUserId === user.user_id ? (
                                    <input type="text" name="fname" value={editedUserData.fname} onChange={handleInputChange} />
                                ) : (
                                    user.fname
                                )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                {editingUserId === user.user_id ? (
                                    <input type="text" name="lname" value={editedUserData.lname} onChange={handleInputChange} />
                                ) : (
                                    user.lname
                                )}
                            </td>
                            <td style={{ textAlign: 'center' }}>{userTypeString(user.userType)}</td>
                            <td style={{ textAlign: 'center' }}>
                                {editingUserId === user.user_id ? (
                                    <input type="email" name="email" value={editedUserData.email} onChange={handleInputChange} />
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td style={{ textAlign: 'center' }}>{user.accountStatus}</td>
                            <td style={{ textAlign: 'center' }}>


                                <a href="#" onClick={() => handleChangeStatus(user.user_id, user.accountStatus)}>Change Status</a>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                {editingUserId === user.user_id ? (
                                    <React.Fragment>
                                        <button onClick={handleSaveUser}>Save</button>
                                        <button onClick={() => setEditingUserId(null)}>Cancel</button>
                                    </React.Fragment>
                                ) : (
                                    <button onClick={() => handleEditUser(user.user_id)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};




export default GetUserApps;


