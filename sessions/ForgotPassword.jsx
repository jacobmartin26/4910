import React, { useState } from 'react';
import { Button, Card, Grid, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';

const FlexBox = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: theme.palette.background.default,
}));

const ContentBox = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetRequested, setResetRequested] = useState(false);

  // Initialize AWS Cognito
  const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const params = {
        ClientId: '2s53dnf63260p3emkb3ejbbbjm',
        Username: email,
      };
      await cognito.forgotPassword(params).promise();
      // Redirect to PasswordReset component
      setResetRequested(true);
    } catch (error) {
      console.error('Error initiating password reset:', error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const params = {
        ClientId: '2s53dnf63260p3emkb3ejbbbjm',
        ConfirmationCode: verificationCode,
        Password: newPassword,
        Username: email,
      };
      await cognito.confirmForgotPassword(params).promise();
      // Password reset successful, redirect to login or home page
      navigate('/session/signin');
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <FlexBox>
      <ContentBox container justifyContent="center">
        <Card className="card" sx={{ maxWidth: 400, borderRadius: 8, padding: 3 }}>
          <Grid item xs={12}>
            <form onSubmit={resetRequested ? handlePasswordReset : handleForgotPassword}>
              {resetRequested ? (
                <>
                  <TextField
                    type="text"
                    placeholder="Verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Verification Code"
                  />
                  <TextField
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="New Password"
                  />
                  <Button type="submit" fullWidth variant="contained" color="primary">
                    Confirm
                  </Button>
                </>
              ) : (
                <>
                  <TextField
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Email"
                  />
                  <Button type="submit" fullWidth variant="contained" color="primary">
                    Request Password Reset
                  </Button>
                </>
              )}
            </form>
            <Button fullWidth variant="outlined" color="primary" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
              Go Back
            </Button>
          </Grid>
        </Card>
      </ContentBox>
    </FlexBox>
  );
};

export default PasswordReset;
