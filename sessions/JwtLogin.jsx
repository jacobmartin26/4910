// import { LoadingButton } from '@mui/lab';
import { Card, Button, Typography, Grid, TextField } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
// import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import API from "app/components/API/API";
//import { authenticate } from 'app/auth/services/authenticate';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '32px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100% !important',
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
// const initialValues = {
//   email: 'jason@ui-lib.com',
//   password: 'dummyPass',
//   remember: true,
// };

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  // eslint-disable-next-line
  const [loginErr, setLoginErr] = useState('');
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formInputChange = (formField, value) => {
    if (formField === "email") {
      setEmail(value);
    }
    if (formField === "password") {
      setPassword(value);
    }
  };

  // form field validation schema CHANGE WITH COGNITO
  const validationSchema = () => {
    return new Promise((resolve, reject) => {
      if (email === '' && password === '') {
        setEmailErr("Email is required");
        setPasswordErr("Password is required")
        resolve({ email: "Email is required", password: "Password is required" });
      }
      else if (email === '') {
        console.log("elseif 1 statement");
        setEmailErr("Email is Required")
        resolve({ email: "Email is Required", password: "" });
      }
      else if (password === '') {
        console.log("elseif 2 statement");
        setPasswordErr("Password is required")
        resolve({ email: "", password: "Password is required" });
      }
      else if (password.length < 6) {
        console.log("elseif 3 statement");
        setPasswordErr("must be 6 character")
        resolve({ email: "", password: "must be 6 character" });
      }
      else {
        console.log("else statement");
        resolve({ email: "", password: "" });
      }
    });
  };

  const handleClick =  () => {
    setLoading(true);
    setEmailErr("");
    setPasswordErr("");
    console.log("validating");
    validationSchema()
      .then(async (res) => {
        if (res.email === '' && res.password === '') {
          try {
            await login(email, password);
            // Call Flask route to log successful login
            await API.post('/log_login', { email, password });
            navigate('/');
          } catch (e) {
            // Call Flask route to log bad login attempt
            await API.post('/log_bad_login', { email, password });
            // setLoading(false);
          }
        }
      }, err => console.log(err))
      .catch(err => console.log(err));
    console.log("validated");
    setLoading(false);
  }

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              <div className="formfield">
                <TextField
                  value={email}
                  onChange={(e) => formInputChange("email", e.target.value)}
                  label="Email"
                  helperText={emailErr}
                  sx={{ mb: 3 }}
                />
              </div>
              
              <div className='formfield'>
                <TextField
                  value={password}
                  onChange={(e) => { formInputChange("password", e.target.value) }}
                  type={
                    showPassword ? "text" : "password"
                  }
                  label="Password"
                  helperText={passwordErr}
                  sx={{ mb: 1.5 }}
                />
                <br />
                <label for="check">Show Password</label>
                <input
                    id="check"
                    type="checkbox"
                    value={showPassword}
                    onChange={() =>
                        setShowPassword((prev) => !prev)
                      }
                  />
                  <br />
                  <br />
              </div>

              <FlexBox justifyContent="space-between">
                {/* <FlexBox gap={1}>
                  <Checkbox
                    size="small"
                    name="remember"
                    onChange={handleChange}
                    checked={values.remember}
                    sx={{ padding: 0 }}
                  />

                  <Paragraph>Remember Me</Paragraph>
                </FlexBox> */}

                <NavLink
                  to="/session/forgot-password"
                  style={{ color: theme.palette.primary.main }}
                >
                  Forgot password?
                </NavLink>
              </FlexBox>

              <div className='formfield'>
                <Button type='submit' variant='contained' onClick={handleClick}>Login</Button>
              </div>
              <Typography variant="body" sx={{color: 'error.main'}}>{loginErr}</Typography>

              <Paragraph>
                Don't have an account?
                <NavLink
                  to="/session/signup"
                  style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                >
                  Register
                </NavLink>
              </Paragraph>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot >
  );
};

export default JwtLogin;
