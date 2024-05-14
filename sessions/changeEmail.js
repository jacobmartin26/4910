import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Card, TextField, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import React from "react";
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import API from "app/components/API/API";

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));
// eslint-disable-next-line
const ContentBox = styled(JustifyBox)(() => ({
    height: '100%',
    padding: '32px',
    background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTChangeEmail = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100vh !important',
    '& .card': {
        maxWidth: 800,
        minHeight: 400,
        margin: '1rem',
        display: 'flex',
        borderRadius: 12,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const initialValues = {
    currentEmail: '',
    newEmail: '',
    password: '',
};

const validationSchema = Yup.object().shape({
    currentEmail: Yup.string().email('Invalid Email address').required('Current Email is required!'),
    newEmail: Yup.string().email('Invalid Email address').required('New Email is required!'),
    password: Yup.string().required('Password is required!'),
});

const JwtChangeEmail = () => {
    // eslint-disable-next-line
    const theme = useTheme();
    const { changeEmail } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            // Call the function to change email in Cognito
            await changeEmail(values.currentEmail, values.password, values.newEmail);

            // Update email in Cognito attributes
            const attributeList = [];
            attributeList.push(
                new CognitoUserAttribute({
                    Name: 'email',
                    Value: values.newEmail,
                })
            );

            // Redirect to signin page if successful
            navigate('/session/signin');
        } catch (error) {
            // Handle errors
            console.error('Error updating user email:', error);
            console.error(error.message);
            throw error; // Rethrow the error to be caught by the calling function
        } finally {
            setLoading(false);
        }
    };

    return (
        <JWTChangeEmail>
            <Card className="card">
                <Typography variant="h5" gutterBottom align="center">Change Email</Typography> {/* Title */}
                <Box p={4} height="100%">
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            <form onSubmit={handleSubmit} style={{ width: '100%' }}> {/* Added width */}
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="text"
                                    name="currentEmail"
                                    label="Current Email"
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    onBlur={handleBlur}
                                    value={values.currentEmail}
                                    onChange={handleChange}
                                    helperText={touched.currentEmail && errors.currentEmail}
                                    error={Boolean(errors.currentEmail && touched.currentEmail)}
                                    sx={{ mb: 3 }}
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="text"
                                    name="newEmail"
                                    label="New Email"
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    onBlur={handleBlur}
                                    value={values.newEmail}
                                    onChange={handleChange}
                                    helperText={touched.newEmail && errors.newEmail}
                                    error={Boolean(errors.newEmail && touched.newEmail)}
                                    sx={{ mb: 3 }}
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="password"
                                    name="password"
                                    label="Password"
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    onBlur={handleBlur}
                                    value={values.password}
                                    onChange={handleChange}
                                    helperText={touched.password && errors.password}
                                    error={Boolean(errors.password && touched.password)}
                                    sx={{ mb: 3 }}
                                />
                                <LoadingButton
                                    type="submit"
                                    color="primary"
                                    loading={loading}
                                    variant="contained"
                                    sx={{ mb: 2, mt: 3 }}
                                >
                                    Change Email
                                </LoadingButton>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Card>
        </JWTChangeEmail>
    );
};

export default JwtChangeEmail;

