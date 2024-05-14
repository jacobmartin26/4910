import React, { useEffect, useState } from 'react';
import API from "./API";
import { Card, Grid, Box, TextField } from '@mui/material';
import { Fragment } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import LoadingButton from '@mui/lab/LoadingButton';
import useAuth from 'app/hooks/useAuth';

const GetUserApps = () => {
    const [newUsersData, setNewUsersData] = useState([]);
    const [logonsData, setLogonsData] = useState([]);
    const [badLoginsData, setBadLoginsData] = useState([]);
    const [appStatData, setAppStatData] = useState([]);
    const [passChangesData, setPassChangesData] = useState([]);
    const [selectedChart, setSelectedChart] = useState('newUsers');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useAuth();
    let user_role = user.role;
    let user_id = user.id;

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]); // Refetch data when date range changes

    const fetchData = async () => {
        try {
            const response = await API.get(`/audit_log/charts/${user_role}/${user_id}`, {
                params: {
                    startDate,
                    endDate
                }
            }); 
            const { new_users, logons, bad_logins, app_stat, pass_changes } = response.data;
            setNewUsersData(new_users);
            setLogonsData(logons);
            setBadLoginsData(bad_logins);
            console.log(bad_logins)
            setAppStatData(app_stat);
            setPassChangesData(pass_changes);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const stamp = payload[0].payload.stamp.toLocaleString(); // Convert Date to string
            return (
                <div className="custom-tooltip">
                    <p>User: {payload[0].payload.user_id}</p>
                    <p>Stamp: {stamp}</p>
                </div>
            );
        }
        return null;
    };

    const handleChartChange = (event) => {
        setSelectedChart(event.target.value);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const convertToCSV = () => {
        setLoading(true);
        let data;
        switch (selectedChart) {
            case 'newUsers':
                data = newUsersData;
                break;
            case 'logons':
                data = logonsData;
                break;
            case 'badLogins':
                data = badLoginsData;
                break;
            case 'appStat':
                data = appStatData;
                break;
            case 'passChanges':
                data = passChangesData;
                break;
            default:
                data = [];
        }
        // Apply date filtering if start and end dates are selected
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            data = data.filter(entry => {
                const entryStamp = new Date(entry.stamp);
                return entryStamp >= start && entryStamp <= end;
            });
        }
        const header = Object.keys(data[0]);
        const rows = data.map(row => header.map(field => row[field]));
        const csvContent = [header.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${selectedChart.toLowerCase()}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoading(false);
    };

    return (
        <Card className="card">
            <Grid item sm={6} xs={12}>
                <Box p={4} height="100%">
                    <Fragment>
                        <select value={selectedChart} onChange={handleChartChange}>
                            <option value="newUsers">New Users Chart</option>
                            <option value="logons">Logons Chart</option>
                            <option value="badLogins">Bad Logins Chart</option>
                            <option value="appStat">App Stat Chart</option>
                            <option value="passChanges">Pass Changes Chart</option>
                        </select>
                        {selectedChart !== 'newUsers' && (
                            <Fragment>
                                <TextField
                                    id="start-date"
                                    label="Start Date"
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ mr: 2 }}
                                />
                                <TextField
                                    id="end-date"
                                    label="End Date"
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ mr: 2 }}
                                />
                            </Fragment>
                        )}
                        {selectedChart === 'newUsers' && (
                            <Fragment>
                                <h2>New Users Chart</h2>
                                <LineChart width={400} height={300} data={newUsersData.filter(entry => {
                                    const entryStamp = new Date(entry.stamp);
                                    return (!startDate || entryStamp >= new Date(startDate)) && (!endDate || entryStamp <= new Date(endDate));
                                })}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="user_id" />
                                    <YAxis dataKey="audit_id" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="audit_id" stroke="#8884d8" />
                                </LineChart>
                            </Fragment>
                        )}
                        {selectedChart === 'logons' && (
                            <Fragment>
                                <h2>Logons Chart</h2>
                                <BarChart width={400} height={300} data={logonsData.filter(entry => {
                                    const entryStamp = new Date(entry.stamp);
                                    return (!startDate || entryStamp >= new Date(startDate)) && (!endDate || entryStamp <= new Date(endDate));
                                })}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="stamp" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="user_id" fill="#82ca9d" />
                                </BarChart>
                            </Fragment>
                        )}
                        {selectedChart === 'badLogins' && (
                            <Fragment>
                                <h2>Bad Logins Chart</h2>
                                <BarChart width={400} height={300} data={badLoginsData.filter(entry => {
                                    const entryStamp = new Date(entry.stamp);
                                    return (!startDate || entryStamp >= new Date(startDate)) && (!endDate || entryStamp <= new Date(endDate));
                                })}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="stamp" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="login_id" fill="#ff7f0e" />
                                </BarChart>
                            </Fragment>
                        )}
                        {selectedChart === 'appStat' && (
                            <Fragment>
                                <h2>App Stat Chart</h2>
                                <LineChart width={400} height={300} data={appStatData.filter(entry => {
                                    const entryStamp = new Date(entry.date);
                                    return (!startDate || entryStamp >= new Date(startDate)) && (!endDate || entryStamp <= new Date(endDate));
                                })}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="driver" stroke="#82ca9d" />
                                    <Line type="monotone" dataKey="sponsor" stroke="#8884d8" />
                                </LineChart>
                            </Fragment>
                        )}
                        {selectedChart === 'passChanges' && (
                            <Fragment>
                                <h2>Pass Changes Chart</h2>
                                <BarChart width={400} height={300} data={passChangesData.filter(entry => {
                                    const entryStamp = new Date(entry.stamp);
                                    return (!startDate || entryStamp >= new Date(startDate)) && (!endDate || entryStamp <= new Date(endDate));
                                })}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="stamp" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="passchange_id" fill="#82ca9d" />
                                </BarChart>
                            </Fragment>
                        )}
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
                    </Fragment>
                </Box>
            </Grid>
        </Card>
    );
};

export default GetUserApps;
