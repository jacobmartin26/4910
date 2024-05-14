import { Fragment } from "react";
import { styled } from '@mui/material';
import CompanyData from "app/components/API/CompanyData";
import GetApps from "app/components/API/GetApps";
import { useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { LoadingButton } from '@mui/lab';
import { Card, Grid } from '@mui/material';
import { Formik } from 'formik';
import { Box } from '@mui/system';
import API from "app/components/API/API";
import AuthContext from 'app/contexts/JWTAuthContext';
const { H1 } = require("app/components/Typography");
const { H3 } = require("app/components/Typography");

function Apply() {
    
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);

    let selectedCompanyId = null;
    const handleCompanySelect = (companyId) => {
        console.log("Company ID:", companyId);
        //setSelectedCompanyId(companyId);
        selectedCompanyId = companyId;
    };
    
  
    const handleFormSubmit = () => {
        setLoading(true);
        //come back and change to driverApp.jsx
        API.post('add_app', {
            company_id : selectedCompanyId,
            driver_id : id,
            stat : 0,
          });
        try {
          navigate('/pages/DriverApps');
          setLoading(false);
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
      };
    
    return (
        <Card className="card">
          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
              >
                {({ handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Fragment>
                        <ContentBox className="companies">
                          <H1>Application Portal</H1>
                          <br/>
                          <H3> Your Applications </H3>
                              <div className="App">
                                <p> Below are your current applications. If status is 0, your application is incomplete. If status is 1, your application is compeleted. If status is 2, your application is pending. If status is 3, your application is accepted. If status is 4, your application has been denied.</p>
                                  <GetApps />
                              </div>
                            <H3>Apply to a Company!</H3>
                            <p> The following are companies that are available to apply to. Please select one company at a time.</p>
                            {/* <GetUserId /> */}
                            <div className="App">
                                <CompanyData onCompanySelect={handleCompanySelect} />
                            </div>
                            <LoadingButton
                                type="submit"
                                color="primary"
                                loading={loading}
                                variant="contained"
                                onClick={handleFormSubmit}
                                sx={{ mb: 2, mt: 3 }}
                                >
                                Apply Now!
                            </LoadingButton>
                        </ContentBox>
                    </Fragment>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
      </Card>
    );
};

export default Apply;
