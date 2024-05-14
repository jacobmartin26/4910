import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from 'app/contexts/JWTAuthContext';
import API from "./API";

const { H2 } = require("app/components/Typography");

const GetReasons = () => {
    const [drivers, setDrivers] = useState([]);
    const { user } = useContext(AuthContext);
    const id = user ? user.id : null;

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await API.get(`/company/users/` + id);
                const { drivers } = response.data;
                setDrivers(drivers);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };
        if (id) {
            fetchDrivers();
        }
    }, [id]);

    const handleChangeStatus = async (driverId, driverStatus) => {
        try {
            const response = await API.post('/disable/user', {
                userid: driverId,
                stat: driverStatus,
            });
            if (response.status === 200) {
                setDrivers(drivers.map(driver => driver.user_id === driverId ? { ...driver, status: driverStatus === 'active' ? 'disabled' : 'active' } : driver));
                console.log('Driver status changed successfully');
            } else {
                console.error('Failed to change driver status:', response.statusText);
            }
        } catch (error) {
            console.error('Error changing driver status:', error);
        }
    };

    return (
        <div>
            <H2>Your Drivers</H2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center', backgroundColor: '#f2f2f2', padding: '8px' }}>ID</th>
                        <th style={{ textAlign: 'center', backgroundColor: '#f2f2f2', padding: '8px' }}>Name</th>
                        <th style={{ textAlign: 'center', backgroundColor: '#f2f2f2', padding: '8px' }}>Points</th>
                        <th style={{ textAlign: 'center', backgroundColor: '#f2f2f2', padding: '8px' }}>Status</th>
                        <th style={{ textAlign: 'center', backgroundColor: '#f2f2f2', padding: '8px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((driver, index) => (
                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#e6f7ff' : '#ffffff' }}>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{driver.user_id}</td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{driver.fname} {driver.lname}</td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{driver.points}</td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{driver.accountStatus}</td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>
                                <button onClick={() => handleChangeStatus(driver.user_id, driver.accountStatus)}>
                                    {driver.accountStatus === '1' ? 'Enable' : 'Disable'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetReasons;
