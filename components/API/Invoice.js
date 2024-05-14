import React, { useEffect, useState } from 'react';
import API from "./API";
import { H3 } from 'app/components/Typography';
import { LoadingButton } from '@mui/lab';
import { Box, Table, TableHead, TableBody, TableRow, TableCell, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Card, Grid, TextField } from '@mui/material';
import { Fragment } from "react";
import { styled } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const GetUserApps = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const response = await API.get('/invoices');
                setInvoices(response.data.invoices);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    // Get unique company names
    const companyNames = Array.from(new Set(invoices.map(invoice => invoice.company_name)));

    // Handle company select change
    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
    };

    // Handle date range change
    const handleDateRangeChange = (newValue) => {
        setSelectedDateRange(newValue);
    };

    // Define the order of keys for rendering
    const tableHeaders = ['item_id', 'prod_id', 'prod_title', 'quantity', 'prod_cost', 'order_id', 'total_cost', 'stamp', 'status', 'company_name'];

    // Filter invoices by selected company and date range
    const filteredInvoices = invoices.filter(invoice => (
        (!selectedCompany || invoice.company_name === selectedCompany) &&
        (!selectedDateRange[0] || !selectedDateRange[1] || (invoice.stamp >= selectedDateRange[0] && invoice.stamp <= selectedDateRange[1]))
    ));

    // Calculate total cost
    const totalCost = filteredInvoices.reduce((acc, invoice) => acc + invoice.total_cost, 0);

    // Prepare data for line chart
    const chartData = filteredInvoices.map(invoice => ({
        stamp: invoice.stamp,
        total_cost: invoice.total_cost
    }));

    // Convert data to CSV format
    const convertToCSV = () => {
        const header = tableHeaders.map(header => header.replace('_', ' ').toUpperCase());
        const rows = filteredInvoices.map(invoice => tableHeaders.map(header => invoice[header.toLowerCase()]));
        const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoices_${selectedCompany}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="card">
            <Grid item sm={6} xs={12}>
                <Box p={4} height="100%">
                    <Fragment>
                        <ContentBox className="invoices">
                            <div>
                                <H3>Invoices</H3>
                                <FormControl fullWidth>
                                    <InputLabel id="company-select-label">Select Company</InputLabel>
                                    <Select
                                        labelId="company-select-label"
                                        id="company-select"
                                        value={selectedCompany}
                                        onChange={handleCompanyChange}
                                    >
                                        {companyNames.map((company, index) => (
                                            <MenuItem key={index} value={company}>{company}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateRangePicker
                                        label="Select Date Range"
                                        value={selectedDateRange}
                                        onChange={handleDateRangeChange}
                                        renderInput={(startProps, endProps) => (
                                            <Fragment>
                                                <TextField {...startProps} />
                                                <Box sx={{ mx: 2 }}> to </Box>
                                                <TextField {...endProps} />
                                            </Fragment>
                                        )}
                                    />
                                </LocalizationProvider>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {tableHeaders.map(header => (
                                                <TableCell key={header}>{header.replace('_', ' ').toUpperCase()}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredInvoices.map((invoice, index) => (
                                            <TableRow key={index}>
                                                {tableHeaders.map(header => (
                                                    <TableCell key={header}>
                                                        {header.toUpperCase() === 'QUANTITY' ? 1 : header.toUpperCase() === 'TOTAL COST' ? invoice[header.toLowerCase()].toFixed(2) : invoice[header.toLowerCase()]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Box mt={2}>
                                    <strong>Total Cost: {totalCost.toFixed(2)}</strong>
                                </Box>
                            </div>2
                            <div>
                                <H3>Invoice Chart</H3>
                                <LineChart width={600} height={300} data={chartData}>
                                    <XAxis dataKey="stamp" />
                                    <YAxis />
                                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="total_cost" stroke="#8884d8" />
                                </LineChart>
                                <Box mt={2}>
                                    <Button variant="contained" color="primary" onClick={convertToCSV}>Download as CSV</Button>
                                </Box>
                            </div>
                        </ContentBox>
                    </Fragment>
                </Box>
            </Grid>
        </Card>
    );
};

export default GetUserApps;
