import { Fragment, useState } from "react";
import { Grid, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import React from "react";
import API from "app/components/API/API";
import useAuth from "app/hooks/useAuth";
const { H1 } = require("app/components/Typography");

//const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

// const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const AboutEdit = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    // eslint-disable-next-line
    const [activity, setActivity] = useState('');

    const formInputChange = (formField, value) => {
        if (formField === "fname") {
            setFName(value);
        }
        if (formField === "lname") {
            setLName(value);
        }
        // if (formField === "activity") {
        //     setActivity(value);
        // }
    };

    const handleClick = () => {
        setLoading(true);
        try {
            API.post('edit_account', {
                user_id: user.id,
                fname:fname,
                lname:lname,
                // activity:activity,
            });
            navigate('/pages/accountInfo');
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const handleEmailClick = () => {
        setLoading(true);
        try {
            navigate('/session/changeEmail');
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <ContentBox className="acconut">
                <H1>Account Information Update</H1>
                <Grid item sm={6} xs={12}>
                    <ContentBox>
                        <div className='formfield'>
                            <TextField
                                value={fname}
                                onChange={(e) => { formInputChange("fname", e.target.value) }}
                                label="First Name"
                                sx={{ mb: 1.5 }}
                            />
                        </div>

                        <div className='formfield'>
                            <TextField
                                value={lname}
                                onChange={(e) => { formInputChange("lname", e.target.value) }}
                                label="Last Name"
                                sx={{ mb: 1.5 }}
                            />
                        </div>

                        {/* <div className='formfield'>
                            <TextField
                                value={activity}
                                onChange={(e) => { formInputChange("activity", e.target.value) }}
                                label="Account Activity (Enter 1 for active, 0 for Inactive)"
                                sx={{ mb: 1.5 }}
                            />
                        </div> */}

                        <div className='formfield'>
                            <Button type='submit' variant='contained' onClick={handleClick}>Submit</Button>
                        </div>

                        <div className='formfield'>
                            <Button type='submit' variant='contained' onClick={handleEmailClick}>
                                If you need to change your Email, click here
                                </Button>
                        </div>
                    </ContentBox>
                </Grid>
            </ContentBox>
        </Fragment>
    );
};

export default AboutEdit;