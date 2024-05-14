import { Fragment } from "react";
import { styled } from '@mui/material';
import GetAdminApps from "app/components/API/GetAdminApps";
import React, { useContext } from 'react';
import { Card, Grid } from '@mui/material';
import { Box } from '@mui/system';
import AuthContext from 'app/contexts/JWTAuthContext';

const { H1 } = require("app/components/Typography");

function About() {
    
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));
    
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);
    
    console.log(typeof(id));
    
    return (
        <Card className="card">
          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
                    <Fragment>
                        <ContentBox className="companies">
                            <H1>All Applications</H1>
                                <div className="Application">
                                    <GetAdminApps />
                                </div>
                        </ContentBox>
                    </Fragment>
            </Box>
          </Grid>
      </Card>
    );
};

export default About;