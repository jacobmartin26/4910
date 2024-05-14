import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Card, TextField, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import React from "react";
import { useNavigate } from 'react-router-dom';
import API from "app/components/API/API";

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(JustifyBox)(() => ({
    height: '100%',
    padding: '32px',
    background: 'rgba(0, 0, 0, 0.01)',
}));

const ChangePassword = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100vh !important',
    '& .card': {
        maxWidth: 800,
        minHeight: 400,
        margin: '1rem',
        display: 'flex',
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
    },
}));

const TitleBox = styled(Box)(() => ({
    width: '100%',
    marginBottom: '1rem',
}));

const initialValues = {
    oldPassword: '',
    newPassword: ''
};

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required!'),
    newPassword: Yup.string()
        .min(6, 'Password must be 6 character length')
        .matches(/^[0-9A-Za-z!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]*$/, 'Need at least one special character!')
        //.matches(/^[0-9A-Za-z]*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?][0-9a-zA-Z]*$/, 'Need one special character')
        .required('New Password is required!'),
});

const ChangePasswordForm = () => {
    const { user } = useAuth();
    const id = Number(user ? user.id : null);
    const theme = useTheme();
    const { changePassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            await changePassword(values.oldPassword, values.newPassword);
            console.log("old pass: ", values.oldPassword);
            let passMessage = "Changed Password";
            await API.post('/change_pass', {user_id: id, message: passMessage});
            console.log("Finished post and changed password");
            navigate('/session/signin');
            setLoading(false);
        } catch (error) {
            console.error('Password change failed:', error);
            setLoading(false);
        }
    };

    const handleBackToSignIn = () => {
        navigate('/session/signin'); // Navigate back to sign-in page using navigate function
    };

    return (
        <ChangePassword>
            <Card className="card">
                <TitleBox>
                    <Typography variant="h5" gutterBottom align="center">Change Password</Typography> {/* Title */}
                </TitleBox>
                <Box p={4} height="100%">
                    {success ? (
                        <>
                            <Typography variant="body1" gutterBottom align="center">Password changed successfully!</Typography>
                            <LoadingButton
                                onClick={handleBackToSignIn}
                                color="primary"
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Back to Sign In
                            </LoadingButton>
                        </>
                    ) : (
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
                                        type="password"
                                        name="oldPassword"
                                        label="Old Password"
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        value={values.oldPassword}
                                        onChange={handleChange}
                                        helperText={touched.oldPassword && errors.oldPassword}
                                        error={Boolean(errors.oldPassword && touched.oldPassword)}
                                        sx={{ mb: 3 }}
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="password"
                                        name="newPassword"
                                        label="New Password"
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        helperText={touched.newPassword && errors.newPassword}
                                        error={Boolean(errors.newPassword && touched.newPassword)}
                                        sx={{ mb: 3 }}
                                    />
                                    <LoadingButton
                                        type="submit"
                                        color="primary"
                                        loading={loading}
                                        variant="contained"
                                        sx={{ mb: 2 }}
                                    >
                                        Change Password
                                    </LoadingButton>
                                </form>
                            )}
                        </Formik>
                    )}
                </Box>
            </Card>
        </ChangePassword>
    );
};
export default ChangePasswordForm;