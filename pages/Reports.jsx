import React, { Fragment, useState } from "react";
import { styled } from '@mui/material';
import PointChangeReport from "app/components/API/PointChangeReport";
import { Card, Grid, Button } from '@mui/material';
import { Box } from '@mui/system';
import SaleBySpon from "app/components/API/SaleBySpon";
import SaleByDriver from "app/components/API/SaleByDriver";
import Invoice from "app/components/API/Invoice";
import Audit from "app/components/API/Audit";
//import GetUserApps from "path/to/GetUserApps"; // Import GetUserApps component
import { H1 } from "app/components/Typography";

function Reports() {
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));

    const [showPointChangeReport, setShowPointChangeReport] = useState(false);
    const [showSaleBySpon, setShowSaleBySpon] = useState(false);
    const [showSaleByDriver, setShowSaleByDriver] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [showAudit, setShowAudit] = useState(false); // State for showing/hiding Audit chart

    return (
        <Card className="card">
            <Grid item sm={6} xs={12}>
                <Box p={4} height="100%">
                    <Fragment>
                        <ContentBox className="companies">
                            <H1> Reports </H1>
                            <br />
                            <Button onClick={() => setShowPointChangeReport(!showPointChangeReport)}>
                                {showPointChangeReport ? "Hide Point Change Report" : "Show Point Change Report"}
                            </Button>
                            {showPointChangeReport && <PointChangeReport />}
                            <br />
                            <Button onClick={() => setShowSaleBySpon(!showSaleBySpon)}>
                                {showSaleBySpon ? "Hide Sale By Sponsor Report" : "Show Sale By Sponsor Report"}
                            </Button>
                            {showSaleBySpon && <SaleBySpon />}
                            <br />
                            <Button onClick={() => setShowSaleByDriver(!showSaleByDriver)}>
                                {showSaleByDriver ? "Hide Sale By Driver Report" : "Show Sale By Driver Report"}
                            </Button>
                            {showSaleByDriver && <SaleByDriver />}
                            <br />
                            <Button onClick={() => setShowInvoice(!showInvoice)}>
                                {showInvoice ? "Hide Invoice Report" : "Show Invoice Report"}
                            </Button>
                            {showInvoice && <Invoice />}
                            <Button onClick={() => setShowAudit(!showAudit)}> {/* Button for Audit chart */}
                                {showAudit ? "Hide Audit Chart" : "Show Audit Chart"}
                            </Button>
                            {showAudit && <Audit />} {/* Render GetUserApps component */}
                        </ContentBox>
                    </Fragment>
                </Box>
            </Grid>
        </Card>
    );
};

export default Reports;
