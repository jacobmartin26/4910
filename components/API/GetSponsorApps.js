import React, { useEffect, useState, useContext } from 'react';
import API from "./API";
import AuthContext from 'app/contexts/JWTAuthContext';
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
const { H3 } = require("app/components/Typography");

//const { H4 } = require("app/components/Typography");

const GetSponsorApps = () => {
    const [userApps, setUserApps] = useState([]);
    const [pendingApps, setPendingApps] = useState([]);
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState(""); 
    const [loading] = useState(false);

    useEffect(() => {
        const fetchUserApps = async () => {
            try {
                let endpoint = 'Sponsor/app/' + id;
                if (startDate && endDate) {
                    endpoint += `?start_date=${startDate}&end_date=${endDate}`; // Add filter by date range if both start and end dates are set
                }
                const response = await API.get(endpoint); 
                //change to use id once done testing and import useContext
                //const response = await API.get('/Sponsor/app/1'); 
                setUserApps(response.data.applications);
            } catch (error) {
                console.error('Error fetching user apps:', error);
            }
        };
        const fetchPendingApps = async () => {
            try {
                //change to use id once done testing and import useContext
                const response = await API.get('/Sponsor/app/pending/' + id); 
                setPendingApps(response.data.applications);
            } catch (error) {
                console.error('Error fetching user apps:', error);
            }
        };

        fetchUserApps();
        fetchPendingApps();
    }, [startDate, endDate,id]);

    const handleFilter = () => {
        setStartDate(document.getElementById('startDate').value);
        setEndDate(document.getElementById('endDate').value);
    };
    const filteredUserApps = userApps.filter(app => {
        if (!startDate || !endDate) {
            return true; // If start or end date is not set, don't apply filtering
        }
        const submittedDate = new Date(app.submit); // Parse submitted date into a Date object
        const start = new Date(startDate); // Parse start date into a Date object
        const end = new Date(endDate); // Parse end date into a Date object
        return submittedDate >= start && submittedDate <= end; // Check if submitted date falls within the date range
    });

    const handleAccept = (appId,userId) => {
        const reason = window.prompt("Reason: ");
        console.log("reason: ", reason)
        console.log("Accepted app:", appId);
        console.log(id);
        console.log(userId)
        API.post('update_appstat', {
            sponsor : id,
            driverapp_id : appId,
            stat : 3, //mark app as accepted
            reason : reason,
          });
          API.post('add_driver', {
            sponsor : id,
            user_id : userId,
          });
        alert("Application was accepted!")
    };

    const handleReject = (appId) => {
        const reason = window.prompt("Reason: ");
        console.log("reason: ", reason)
        console.log("Rejected app:", appId);
        console.log(id);
        API.post('update_appstat', {
            sponsor : id,
            driverapp_id : appId,
            stat : 4, //mark app as denied
            reason : reason,
          });
        console.log("Rejected app:", appId);
        alert("Application was rejected.");
    };

    const handleRevoke = (appId) => {
        const reason = window.prompt("Reason: ");
        console.log("reason: ", reason)
        console.log("Revoked app:", appId);
        console.log(id);
        API.post('update_appstat', {
            sponsor : id,
            driverapp_id : appId,
            stat : 5, //mark app as revoked 
            reason : reason,
          });
        console.log("Revoked app:", appId);
        alert("Application was revoked.");
    };

    return (
        <div>
            <ul>
                <H3>Pending Applications </H3>

                {pendingApps.map((app, index) => (
                    <li key={index}>
                        <p>Name: {app.fname} {app.lname}</p> 
                        <p>Status: {app.stat}</p>
                        <p>Submitted: {app.submit}</p>
                        <LoadingButton
                            type="submit"
                            color="primary"
                            loading={loading}
                            variant="contained"
                            onClick={() => handleAccept(app.driverapp_id,app.user_id)}
                            sx={{ mb: 2, mt: 3 }}
                            >
                            Accept
                        </LoadingButton>
                        <LoadingButton
                            type="submit"
                            color="primary"
                            loading={loading}
                            variant="contained"
                            onClick={handleReject}
                            sx={{ mb: 2, mt: 3 }}
                            >
                            Reject
                        </LoadingButton>
                        <LoadingButton
                            type="submit"
                            color="primary"
                            loading={loading}
                            variant="contained"
                            onClick={handleRevoke}
                            sx={{ mb: 2, mt: 3 }}
                            >
                            Revoke
                        </LoadingButton>
                    </li>
                ))}
                <br/>
                <br/>
                <H3>All Applications </H3>
                <div>
                <br/>
                <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    id="startDate"
                    sx={{ mr: 1 }}
                />
                <br/>
                <br/>
                <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    id="endDate"
                    sx={{ mr: 1 }}
                />
                <LoadingButton
                    type="submit"
                    color="primary"
                    loading={loading}
                    variant="contained"
                    onClick={handleFilter}
                    sx={{ mb: 2, mt: 3 }}
                    >
                    Filter
                </LoadingButton>
                
                </div>
                {filteredUserApps.map((apps, indexs) => (
                    <li key={indexs}>
                        <p>Name: {apps.fname} {apps.lname}</p> 
                        <p>Status: {apps.stat}</p>
                        <p>Submitted: {apps.submit}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetSponsorApps;
