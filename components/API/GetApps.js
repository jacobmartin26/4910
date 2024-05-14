import React, { useEffect, useState, useContext } from 'react';
import API from "./API";
import AuthContext from 'app/contexts/JWTAuthContext';

const GetUserApps = () => {
    const [userApps, setUserApps] = useState([]);
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);
    useEffect(() => {
        const fetchUserApps = async () => {
            try {
                const response = await API.get('/App/' + id); 
                setUserApps(response.data.applications);
                console.log(response.data.applications)
            } catch (error) {
                console.error('Error fetching user apps:', error);
            }
        };
        fetchUserApps();
    }, [id]);

    return (
        <div>
            <ul>
                {userApps.map((app, index) => (
                    <li key={index}>
                        <p>Company: {app.company_name}</p>  
                        <p>Status: {app.stat}</p>
                        <p>Submitted: {app.submit}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetUserApps;
