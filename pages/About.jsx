import { Fragment, useState } from "react";
import { styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import React from "react";
import AboutData from "app/components/API/AboutData";
const { H1 } = require("app/components/Typography");

function About() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));

    const handleFormSubmit = () => {
        setLoading(true);
    
        try {
          navigate('/pages/aboutEdit');
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
                <H1>Who We Are</H1>
                <p>We are Tiger Truckers! Our goal is to give truckers the ability to be rewarded for their good driving habits.
                    We believe that the work done by truckers on a daily basis should be rewarded for staying safe on the roads.
                </p>
                <H1>Our History</H1>
                <p>Tiger Truckers was founded in 2024 by a group of students at Clemson University who always cared for the safety 
                    and reliability of truckers around the country. In an age where everyone is getting something delivered, we want to make sure our deliveries get to us safely while ensuring the safety of the truckers. Truckers are the reason we are able to get our packages delivered to us.</p>
                <H1>Version Information</H1>
                <div className="App">
                    <AboutData/>
                </div>
                <Formik
                onSubmit={handleFormSubmit}
                >
                    {({ handleSubmit }) =>(
                <form onSubmit={handleSubmit}>
                <LoadingButton
                        type="submit"
                        color="primary"
                        loading={loading}
                        variant="contained"
                            onClick={handleFormSubmit}
                        sx={{ mb: 2, mt: 3 }}
                        >
                        Edit Details
                </LoadingButton>
                </form>
                )}
                </Formik>
            </ContentBox>
        </Fragment>
    );
};

export default About;