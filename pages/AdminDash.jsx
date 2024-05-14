import React, { useEffect, useState } from 'react';
import API from 'app/components/API/API';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import AllCompanies from '../../components/API/AllCompanies';
import Users from "app/components/API/Users";

const AdminDashboard = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addUserLoading, setAddUserLoading] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = () => {
        setLoading(true);
        try {
            navigate('/pages/NewUser');
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUserToCompany = () => {
        setAddUserLoading(true);
        console.log("Add user to company button clicked!");
        try {
            navigate('/pages/UserToComp');
        } catch (e) {
            console.log(e);
        } finally {
            setAddUserLoading(false);
        }
    };

    const handlePointConversion = () => {
        console.log("Point Conversion");
        setLoading(true);
        try {
            navigate('/pages/AdminPointCon');
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div>
                <LoadingButton
                    type="submit"
                    color="primary"
                    loading={loading}
                    variant="contained"
                    onClick={handleFormSubmit}
                    sx={{ mb: 2, mt: 3, mr: 2 }}
                >
                    Create New User
                </LoadingButton>
                <LoadingButton
                    loading={addUserLoading}
                    variant="contained"
                    onClick={handleAddUserToCompany}
                    sx={{ mb: 2, mt: 3, mr: 2 }}
                >
                    Add Driver to Company
                </LoadingButton>
                {/* New loading button for point conversion */}
                <LoadingButton
                    variant="contained"
                    onClick={handlePointConversion}
                    sx={{ mb: 2, mt: 3 }}
                >
                    Create New Point Conversion
                </LoadingButton>
                <h2>User Management</h2>
                <ul>
                    {userData.map(user => (
                        <li key={user.id}>
                            {user.firstName} {user.lastName} - {user.email}
                        </li>
                    ))}
                </ul>
            </div>
            <Users />
            <div>
                <h2>Companies</h2>
                <AllCompanies />
            </div>
        </div>
    );
};

export default AdminDashboard;
