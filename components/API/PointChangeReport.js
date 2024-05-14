import React, { useEffect, useState, useContext } from 'react';
import API from "./API";
import AuthContext from 'app/contexts/JWTAuthContext';
import { LoadingButton } from '@mui/lab';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box } from '@mui/system';
import { Card, Grid, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { Fragment } from "react";
import { styled } from '@mui/material';

const { H3 } = require("app/components/Typography");

const GetUserApps = () => {
    const [pointChange, setPointChange] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState('');
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);
    const [loading] = useState(false);
    let totalPoints = 0;
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));

    useEffect(() => {
        const fetchUserApps = async () => {
            try {
                const response = await API.get('/pointchange'); 
                setPointChange(response.data.changes);
            } catch (error) {
                console.error('Error fetching point changes:', error);
            }
        };
        fetchUserApps();
    }, [id]);

    const handleDriverChange = (event) => {
        setSelectedDriver(event.target.value);
    };

    const driverList = [...new Set(pointChange.map(change => change.driver))];

    const filteredPointChanges = pointChange.filter(change => {
        const changeDate = new Date(change.pointTime);
        const withinDateRange = (!startDate || !endDate || (changeDate >= startDate && changeDate <= endDate));
        const matchesSelectedDriver = (!selectedDriver || change.driver === selectedDriver);
        return withinDateRange && matchesSelectedDriver;
    });

    const groupedPointChanges = filteredPointChanges.reduce((acc, change) => {
        if (!acc[change.driver]) {
            acc[change.driver] = [];
        }
        acc[change.driver].push(change);
        return acc;
    }, {});

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p>{`Date: ${label}`}</p>
                    {payload.map((point, index) => (
                        <p key={index}>
                            {`${point.payload.sponsor} ${point.payload.action} ${point.payload.numPoints} points to ${point.payload.driver} because ${point.payload.reason}`}
                        </p>
                    ))}
                </div>
            );
        }
    
        return null;
    };
    
    const chartData = Object.entries(groupedPointChanges).map(([driver, changes]) => ({
        driver,
        changes: changes.map(change => ({
            pointTime: change.pointTime,
            numPoints: change.numPoints,
            sponsor: change.sponsor,
            action: change.actions,
            driver: change.driver,
            reason: change.reason
        }))
    }));

    filteredPointChanges.forEach(change => {
        if (change.actions === "added") {
            totalPoints += change.numPoints;
        } else if (change.actions === "removed") {
            totalPoints -= change.numPoints;
        }
    });

    const convertToCSV = () => {
        const header = ['Driver', 'Point Time', 'Num Points', 'Sponsor', 'Action', 'Reason'];
        const rows = filteredPointChanges.map(change => [
            change.driver,
            change.pointTime,
            change.numPoints,
            change.sponsor,
            change.actions,
            change.reason
        ]);
        const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'point_changes.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="card">
          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
                    <Fragment>
                        <ContentBox className="companies">
                        <div>
                            <H3>Point Change Report</H3>
                            <br/>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Start Date: </label>
                                <input type="date" value={startDate ? startDate.toISOString().split('T')[0] : ''} onChange={e => setStartDate(new Date(e.target.value))} />
                                <label style={{ marginLeft: '20px' }}>End Date: </label>
                                <input type="date" value={endDate ? endDate.toISOString().split('T')[0] : ''} onChange={e => setEndDate(new Date(e.target.value))} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="driver-select-label">Driver</InputLabel>
                                    <Select
                                        labelId="driver-select-label"
                                        id="driver-select"
                                        value={selectedDriver}
                                        onChange={handleDriverChange}
                                        label="Driver"
                                        style={{ width: 200 }} // Adjust the width here
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        {driverList.map(driver => (
                                            <MenuItem key={driver} value={driver}>{driver}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <LineChart width={800} height={400} data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="pointTime" />
                                    <YAxis />
                                    <Tooltip content={CustomTooltip} />
                                    <Legend />
                                    {chartData.map((entry, index) => (
                                        <Line
                                            key={index}
                                            dataKey="numPoints"
                                            name={entry.driver}
                                            data={entry.changes}
                                        />
                                    ))}
                                </LineChart>
                            </div>
                            <div>
                                <p>Total Points: {totalPoints}</p>
                            </div>
                            <div>
                                <LoadingButton
                                    type="submit"
                                    color="primary"
                                    loading={loading}
                                    variant="contained"
                                    onClick={convertToCSV}
                                    sx={{ mb: 2, mt: 3 }}
                                    >
                                    Download as CSV
                                </LoadingButton>
                            </div>
                        </div>
                        </ContentBox>
                    </Fragment>
            </Box>
          </Grid>
      </Card>
    );
};

export default GetUserApps;
