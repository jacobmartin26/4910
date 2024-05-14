import React, { useEffect, useState, useContext } from 'react';
import API from "./API";
import AuthContext from 'app/contexts/JWTAuthContext';
import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
const { H1 } = require("app/components/Typography");
const { H2 } = require("app/components/Typography");
const { H3 } = require("app/components/Typography");

const GetReasons = () => {
    const [reasons, setReasons] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedReason, setSelectedReason] = useState(""); 
    const [selectedDriver, setSelectedDriver] = useState(""); 
    const [selectedAction, setSelectedAction] = useState("");
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);
    const [points, setPoints] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchReasons = async () => {
            try {
                const response = await API.get('/company/reasons/' + id); 
                setReasons(response.data.reasons);
            } catch (error) {
                console.error('Error fetching reasons:', error);
            }
        };
        const fetchDrivers = async () => {
            try {
                const response = await API.get('/company/users/' + id); 
                setDrivers(response.data.drivers);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };
        fetchReasons();
        fetchDrivers();
    }, [id]);

    // Event handler for when reason is selected
    const handleReasonChange = (event) => {
        const selectedReasonId = event.target.value;
        setSelectedReason(selectedReasonId);
        // Log the selected reason ID
        console.log("Selected Reason ID:", selectedReasonId);
    };

    // Event handler for when driver is selected
    const handleDriverChange = (event) => {
        const selectedDriverId = event.target.value;
        setSelectedDriver(selectedDriverId);
        // Log the selected driver ID
        console.log("ignore: ", selectedDriver)
        console.log("Selected Driver ID:", selectedDriverId);
    };
    const formInputChange = (formField, value) => {
        if (formField === "points") {
          setPoints(value);
        }
        if (formField === "reason"){
            setReason(value);
        }
      };

      const handleActionChange = (event) => {
        const selectedAction = event.target.value;
        setSelectedAction(selectedAction);
        // Log the selected action
        console.log("Selected Action:", selectedAction);
    };
    
      const handleFormSubmit = (values) => {
        setLoading(true);
        if (selectedAction === "add"){
            console.log("add points : " + points)
            console.log(id)
            console.log(selectedDriver)
            console.log(selectedReason)
            console.log(points)
            API.post('add/points/' + id, {
                driver_id : selectedDriver,
                reason : selectedReason,
                points : points
              });
        }
        if (selectedAction === "remove"){
            console.log("remove points :" + points)
            console.log(id)
            console.log(selectedDriver)
            console.log(selectedReason)
            console.log(points)
            API.post('remove/points/' + id, {
                driver_id : selectedDriver,
                reason : selectedReason,
                points : points
              });
        }
        setLoading(false)
        navigate('/pages/points');
      };

      const handleFormSubmit2 = (values) => {
        setLoading(true);
        
            API.post('add/reason/' + id, {
                reason : reason,
              });
       
        setLoading(false)
        navigate('/pages/points');
      };

    return (
        <div>
            <H2>Select a Reason</H2>
            <select value={selectedReason} onChange={handleReasonChange}>
                <option value="">Reasons</option>
                {reasons && reasons.map((app, index) => (
                    <option key={index} value={app.reason_id}>
                        {app.reason}
                    </option>
                ))}
            </select>
            <div>
                {/* Render details of selected reason */}
                {selectedReason && reasons.map((app, index) => (
                    app.reason_id === selectedReason && (
                        <div key={index}>
                            <p>Reason Id: {app.reason_id}</p>  
                            <p>Reason: {app.reason}</p>
                            <p>Company: {app.company_id}</p>
                        </div>
                    )
                ))}
            </div>
            <br/>
            <div>
                {/* Render radio buttons for each driver */}
                <H2>Select a Driver</H2>
                <ul>
                    {drivers.map((driver, index) => (
                        <li key={index}>
                            <input
                                type="radio"
                                id={`driver${driver.user_id}`}
                                name="selectedDriver"
                                value={driver.user_id}
                                checked={driver.selected}
                                onChange={handleDriverChange}
                            />
                            <label htmlFor={`driver${driver.user_id}`}>
                                {driver.fname} {driver.lname} ({driver.points} points)
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
            <H2>Add or Remove</H2>
                <select onChange={handleActionChange}>
                    <option value="">Select an Action</option>
                    <option value="add">Add</option>
                    <option value="remove">Remove</option>
                </select>
            </div>
            <br/>
            <div>
                <H2>Amount</H2>
                <TextField
                    value={points}
                    onChange={(e) => formInputChange("points", e.target.value)}
                    label="Points"
                    //   helperText={pointsErr}
                    sx={{ mb: 3 }}
                />
            </div>
            <div>
                <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      onClick={handleFormSubmit}
                      sx={{ mb: 2, mt: 3 }}
                    >
                      Submit
                </LoadingButton>
            </div>
            <div>
                <H1>Add New Reason</H1>
                <br/>
                <H3>Please enter new reason:</H3>
                <br/>
                    <TextField
                        value={reason}
                        onChange={(e) => formInputChange("reason", e.target.value)}
                        label="Reason"
                        //   helperText={pointsErr}
                        sx={{ mb: 3 }}
                    />
            </div>
            <div>
                <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      onClick={handleFormSubmit2}
                      sx={{ mb: 2, mt: 3 }}
                    >
                      Submit 
                </LoadingButton>
            </div>

        </div>
    );
};

export default GetReasons;
