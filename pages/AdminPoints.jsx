import { Fragment } from "react";
import { styled } from '@mui/material';
import GetAdminPoints from "app/components/API/GetAdminPoints";
//import AddReason from "app/components/API/AddReason";
import React, { useContext } from 'react';
import { Card, Grid } from '@mui/material';
import { Box } from '@mui/system';
import AuthContext from 'app/contexts/JWTAuthContext';
//import { TextField } from '@mui/material';

const { H1 } = require("app/components/Typography");
//const { H3 } = require("app/components/Typography");

function Points() {
    
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));
    
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);
    //const [reason, setReason] = useState("");
    
    console.log(typeof(id));

    // const formInputChange = (formField, value) => {
    //     if (formField === "reason") {
    //       setReason(value);
    //     }
    //   };
    
    return (
        <Card className="card">
          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
                    <Fragment>
                        <ContentBox className="companies">
                            <H1>Points Portal</H1>
                            <br/>
                                <div className="Reasons">
                                    <GetAdminPoints />
                                </div>
                        </ContentBox>
                    </Fragment>
            </Box>
          </Grid>
      </Card>
    );
};

export default Points;