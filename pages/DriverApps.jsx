import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, TextField } from '@mui/material';
import { Box, styled } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import React, { useContext } from "react";
import API from "app/components/API/API";
import AuthContext from 'app/contexts/JWTAuthContext';
const { H3 } = require("app/components/Typography");



const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

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
  experience: '',
  name: '',
  why: '',
};

// form field validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!"),
  why: Yup.string().required("Reason why is required!"),
  experience: Yup.string().required("Years of experience is required!"),
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

    try {
      register(values.experience);
      console.log(values)
      API.post('update_app', {
        driver_id : id,
        stat : 2, //change status to pending
      });
      alert("Application submitted!");
      navigate('/pages/apply');
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  
  return (
    <JWTRegister>
      <Card className="card">
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
                      name="name"
                      label="Name"
                      InputLabelProps={{shrink : true}}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.name}
                      onChange={handleChange}
                      helperText={touched.name && errors.name}
                      error={Boolean(errors.name && touched.name)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="experience"
                      label="Years of experience"
                      InputLabelProps={{shrink : true}}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.fname}
                      onChange={handleChange}
                      helperText={touched.experience && errors.experience}
                      error={Boolean(errors.experience && touched.experience)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="why"
                      label="Why this company?"
                      InputLabelProps={{shrink : true}}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.fname}
                      onChange={handleChange}
                      helperText={touched.why && errors.why}
                      error={Boolean(errors.why && touched.why)}
                      sx={{ mb: 3 }}
                    />
                    <FlexBox gap={1} alignItems="center">
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={handleChange}
                        checked={values.remember}
                        sx={{ padding: 0 }}
                      />
                      
                      <Paragraph fontSize={13}>
                        I have read and agree to the terms of service.
                      </Paragraph>
                    </FlexBox>
                    
                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      onClick={handleFormSubmit}
                      sx={{ mb: 2, mt: 3 }}
                    >
                      Submit
                    </LoadingButton>
                  </form>
                )}
              </Formik>
            </Box>
          
       
      </Card>
    </JWTRegister>
  );
};

export default JwtRegister;
