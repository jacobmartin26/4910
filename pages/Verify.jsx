//import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, TextField } from '@mui/material';
import { Box, styled } from '@mui/system';
//import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import React, { useContext } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import API from "app/components/API/API";
import AuthContext from 'app/contexts/JWTAuthContext';
//import Username from "app/components/API/Username";
//import API from "app/components/API/API";
//import {CognitoUserAttribute } from 'amazon-cognito-identity-js';
//import { CognitoUser } from 'amazon-cognito-identity-js';
import userpool from 'app/auth/userpool';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));


const ContentBox = styled(JustifyBox)(() => ({
  height: '100%',
  padding: '32px',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRegister = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 400,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
  },
}));

// inital login credentials
const initialValues = {
  code: '',
  email: '',
  remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email address').required('Email is required!'),
  code: Yup.string().required("Validation code is required!"),
});

const JwtRegister = () => {
  //const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const id = Number(user ? user.id : null);

  const handleFormSubmit = (values) => {
    setLoading(true);
    console.log("inside")
    try {
        API.post('update/sponsor', {
            fname: "fname",
            //licenseNum: values.licenseNum
          });
    //   register(values.code, values.email);
    //   console.log(values);
        
        const userData = {
        Username: values.email,
        Pool: userpool
        };
      
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmRegistration(values.code, true, (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(result);
        });
      
      navigate('/pages/About');
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  
  return (
    <JWTRegister>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <img
                width="100%"
                alt="Register"
                src="/assets/images/illustrations/posting_photo.svg"
              />
            </ContentBox>
          </Grid>
          
          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="email"
                      label="Email"
                      InputLabelProps={{shrink : true}}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="code"
                      label="Verification Code"
                      InputLabelProps={{shrink : true}}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.code}
                      onChange={handleChange}
                      helperText={touched.code && errors.code}
                      error={Boolean(errors.code && touched.code)}
                      sx={{ mb: 3 }}
                    />
                    
                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mb: 2, mt: 3 }}
                      onClick={() => handleFormSubmit()}
                    >
                      Submit
                    </LoadingButton>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTRegister>
  );
};

export default JwtRegister;
