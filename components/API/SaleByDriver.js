import React, { useEffect, useState } from 'react';
import API from "./API";
import { H3 } from 'app/components/Typography';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import { Card, Grid, MenuItem, FormControl, InputLabel, Select } from '@mui/material'; // Added MenuItem, FormControl, InputLabel, Select
import { Fragment } from "react";
import { styled } from '@mui/material';

const GetUserApps = () => {
    const [saleBySpon, setSaleBySpon] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sponsorFilter, setSponsorFilter] = useState('');
    const [driverFilter, setDriverFilter] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [loading] = useState(false);
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await API.get('/sale/by/sponsor'); 
                setSaleBySpon(response.data.sales);
            } catch (error) {
                console.error('Error fetching sales by sponsor:', error);
            }
        };
        fetchSales();
    }, []);

    const handleSponsorChange = (event) => {
        setSponsorFilter(event.target.value);
    };

    const handleDriverChange = (event) => {
        setDriverFilter(event.target.value);
    };

    const sponsorList = [...new Set(saleBySpon.map(sale => sale.company_name))];
    const driverList = [...new Set(saleBySpon.map(sale => sale.driver))];

    const filterSales = () => {
        let filteredSales = saleBySpon;
        
        if (startDate && endDate) {
            filteredSales = filteredSales.filter(app => {
                const appDate = new Date(app.stamp);
                return appDate >= new Date(startDate) && appDate <= new Date(endDate);
            });
        }

        if (sponsorFilter) {
            filteredSales = filteredSales.filter(app => app.company_name.toLowerCase() === sponsorFilter.toLowerCase());
        }

        if (driverFilter) {
            filteredSales = filteredSales.filter(app => app.driver.toLowerCase() === driverFilter.toLowerCase());
        }

        return filteredSales;
    };

    const calculateTotal = (sales) => {
        return sales.reduce((total, app) => total + app.total_cost, 0);
    };

    const groupSalesByDriverForScatterChart = (salesData) => {
        const groupedSales = {};

        salesData.forEach(app => {
            if (!groupedSales[app.driver]) {
                groupedSales[app.driver] = [];
            }
            groupedSales[app.driver].push(app);
        });

        return Object.entries(groupedSales).map(([driver, sales]) => ({ driver, sales }));
    };

    const groupSalesByDateAndDriverForLineChart = (salesData) => {
        const groupedSales = {};

        salesData.forEach(app => {
            const appDate = new Date(app.stamp).toISOString().slice(0, 10);
            if (!groupedSales[appDate]) {
                groupedSales[appDate] = {};
            }
            if (!groupedSales[appDate][app.driver]) {
                groupedSales[appDate][app.driver] = 0;
            }
            groupedSales[appDate][app.driver] += app.total_cost;
        });

        const result = [];
        Object.entries(groupedSales).forEach(([date, drivers]) => {
            result.push({ date, ...drivers });
        });

        return result;
    };

    const filteredSales = filterSales();

    const convertToCSV = () => {
        const header = ['Day', 'Time Stamp', 'Company', 'Driver'];
        const rows = filteredSales.map(sale => [
            sale.stamp,
            sale.company_name,
            sale.total_cost,
            sale.driver
        ]);
        const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sales_data.csv');
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
                                <H3>Sale By Driver Report</H3>
                                <br/>
                                <div style={{ marginBottom: '10px' }}>
                                    <label>Start Date:</label>
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                
                                    <label style={{ marginLeft: '20px' }}>End Date: </label>
                                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="sponsor-select-label">Sponsor Name</InputLabel>
                                        <Select
                                            labelId="sponsor-select-label"
                                            id="sponsor-select"
                                            value={sponsorFilter}
                                            onChange={handleSponsorChange}
                                            label="Sponsor Name"
                                            style={{ width: 200 }}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            {sponsorList.map(sponsor => (
                                                <MenuItem key={sponsor} value={sponsor}>{sponsor}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="driver-select-label">Driver</InputLabel>
                                        <Select
                                            labelId="driver-select-label"
                                            id="driver-select"
                                            value={driverFilter}
                                            onChange={handleDriverChange}
                                            label="Driver"
                                            style={{ width: 200 }}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            {driverList.map(driver => (
                                                <MenuItem key={driver} value={driver}>{driver}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <br/>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={showDetails}
                                            onChange={() => setShowDetails(!showDetails)}
                                        />
                                        Show Details
                                    </label>
                                </div>
                                <br/>
                                <div>
                                    {showDetails ? (
                                        <ScatterChart width={800} height={400}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="stamp" type="category" />
                                            <YAxis dataKey="total_cost" />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                            <Legend />
                                            {groupSalesByDriverForScatterChart(filteredSales).map(({ driver, sales }, index) => (
                                                <Scatter key={index} name={driver} data={sales} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                                            ))}
                                        </ScatterChart>
                                    ) : (
                                        <LineChart width={800} height={400} data={groupSalesByDateAndDriverForLineChart(filteredSales)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            {Array.from(new Set(filteredSales.map(app => app.driver))).map((driver, index) => (
                                                <Line key={index} type="monotone" dataKey={driver} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} name={driver} />
                                            ))}
                                        </LineChart>
                                    )}
                                </div>
                                <br/>
                                <p>Total Sales: {calculateTotal(filteredSales)}</p>
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

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
                <p><strong>Company Name:</strong> {data.company_name}</p>
                <p><strong>Total Cost:</strong> {data.total_cost}</p>
                <p><strong>Stamp:</strong> {data.stamp}</p>
                <p><strong>Driver:</strong> {data.driver}</p>
            </div>
        );
    }
    return null;
};

export default GetUserApps;
