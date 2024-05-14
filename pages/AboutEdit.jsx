import { Fragment, useState } from "react";
import { Grid, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import React from "react";
import API from "app/components/API/API";
const { H1 } = require("app/components/Typography");

//const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

// const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const AboutEdit = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const [prodDesc, setProdDesc] = useState('');
    const [prodName, setProdName] = useState('');
    const [sprint, setSprint] = useState('');
    const [teamNum, setTeamNum] = useState('');

    const formInputChange = (formField, value) => {
        if (formField === "prodDesc") {
            setProdDesc(value);
        }
        if (formField === "prodName") {
            setProdName(value);
        }
        if (formField === "sprint") {
            setSprint(value);
        }
        if (formField === "teamNum") {
            setTeamNum(value);
        }
    };

    const handleClick = () => {
        setLoading(true);
        try {
            API.post('edit_about', {
                prodDesc: prodDesc,
                prodName: prodName,
                sprint: sprint,
                teamNum: teamNum,
            });
            navigate('/pages/about');
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    //const myElement = "This is a test insert to see if I can add text through a const var call."
    return (
        <Fragment>
            <ContentBox className="about">
                <H1>About Page Information Update</H1>
                <Grid item sm={6} xs={12}>
                    <ContentBox>
                        <div className="formfield">
                            <TextField
                                value={prodDesc}
                                onChange={(e) => formInputChange("prodDesc", e.target.value)}
                                label="Product Description"
                                sx={{ mb: 1.5 }}
                            />
                        </div>

                        <div className='formfield'>
                            <TextField
                                value={prodName}
                                onChange={(e) => { formInputChange("prodName", e.target.value) }}
                                label="Product Name"
                                sx={{ mb: 1.5 }}
                            />
                        </div>

                        <div className='formfield'>
                            <TextField
                                value={sprint}
                                onChange={(e) => { formInputChange("sprint", e.target.value) }}
                                label="Sprint"
                                sx={{ mb: 1.5 }}
                            />
                        </div>

                        <div className='formfield'>
                            <TextField
                                value={teamNum}
                                onChange={(e) => { formInputChange("teamNum", e.target.value) }}
                                label="Team Number"
                                sx={{ mb: 1.5 }}
                            />
                        </div>

                        <div className='formfield'>
                            <Button type='submit' variant='contained' onClick={handleClick}>Submit</Button>
                        </div>
                    </ContentBox>
                </Grid>
            </ContentBox>
        </Fragment>
    );
};

export default AboutEdit;