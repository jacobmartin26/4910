import SponPointChange from "app/components/API/SponPointChangeReport";
import Audit from "app/components/API/Audit";
import React, { Fragment, useState } from "react";
import { styled } from '@mui/material';
import { Card, Grid, Button } from '@mui/material';
import { Box } from '@mui/system';

//import GetUserApps from "path/to/GetUserApps"; // Import GetUserApps component
import { H1 } from "app/components/Typography";

function Reports() {
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));

    const [showPointChangeReport, setShowPointChangeReport] = useState(false);
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
                            {showPointChangeReport && <SponPointChange />}
                            <Button onClick={() => setShowAudit(!showAudit)}> 
                                {showAudit ? "Hide Audit Chart" : "Show Audit Chart"}
                            </Button>
                            {showAudit && <Audit />} 
                        </ContentBox>
                    </Fragment>
                </Box>
            </Grid>
        </Card>
    );
};

export default Reports;
