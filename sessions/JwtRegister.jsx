import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, TextField } from '@mui/material'; // Checkbox
import { Box, styled } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
// import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// import * as Yup from 'yup';
import React from "react";
import API from "app/components/API/API";
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
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

// form field validation schema
// const validationSchema = Yup.object().shape({
//   password: Yup.string()
//     .min(6, 'Password must be 6 character length')
//     // .matches(/^[0-9A-Za-z]*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?][0-9a-zA-Z]*$/, 'Need one special character')
//     .required('Password is required!'),
//   confirm_password: Yup.string().label('confirm password')
//     .required()
//     .oneOf([Yup.ref('password'), null], 'Passwords must match'),
//   email: Yup.string().email('Invalid Email address').required('Email is required!'),
//   fname: Yup.string().required("First name is required!"),
//   lname: Yup.string().required("Last name is required!"),
// });

const JwtRegister = () => {
  const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [address, setAddress] = useState("");
  const userType = 1;

  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [confirmPassErr, setConfirmPassErr] = useState("");
  const [dobErr, setDobErr] = useState("");
  const [fnameErr, setFnameErr] = useState("");
  const [lnameErr, setLnameErr] = useState("");
  const [addressErr, setAddressErr] = useState("");

      // inital login credentials
    const values = {
      driver: 1,
      sponsor: 2,
      admin: 3,
      remember: true,
    };

  const validationSchema = () => {
    return new Promise((resolve, reject) => {
      if (fname === '' && lname === '' && email === '' && dob === '' && address === '' && password === '' && confirmPass === '') {
        setFnameErr("First name is required")
        setLnameErr("Last name is required")
        setEmailErr("Email is required");
        setPasswordErr("Password is required")
        setConfirmPassErr("Password confirmation is required")
        setDobErr("Date of birth is required");
        setAddressErr("Address is required")

        resolve({ email: "Email is required", password: "Password is required", 
        confirmPass: "Password confirmation is required", fname: "First name is required",
        lname: "Last name is required", dob: "Date of birth is required", address:"Address is required"});
      }
      else if (email === '') {
        console.log("elseif 1 statement");
        setEmailErr("Email is Required")
        resolve({ email: "Email is Required", password: "", confirmPass:"", dob: "", fname: "", 
        lname: "", address:""});
      }
      else if (password === '') {
        console.log("elseif 2 statement");
        setPasswordErr("Password is required")
        resolve({email: "", password: "Password is required", confirmPass:"", dob: "", fname: "", 
        lname: "", address:""});
      }
      else if(confirmPass === ''){
        setConfirmPassErr("Password confirmation is required");
        resolve({ email: "", password: "", confirmPass: "Password confirmation is required", dob: "", fname: "", 
        lname: "", address:"" });
      }
      else if(confirmPass !== password){
        setConfirmPassErr("Passwords do not match");
        resolve({ email: "", password: "", confirmPass: "Passwords do not match", dob: "", fname: "", 
        lname: "", address:"" });
      }
      else if (password.length < 6) {
        console.log("elseif 3 statement");
        setPasswordErr("must be 6 character")
        resolve({ email: "", password: "must be 6 character", confirmPass:"",  dob: "", fname: "", 
        lname: "", address:"" });
      }
      else if(fname === ''){
        setFnameErr("First name is required")
        resolve({ email: "", password: "", confirmPass:"",  dob: "", fname: "First name is required", 
        lname: "", address:"" });
      }
      else if(lname === ''){
        setFnameErr("Last name is required")
        resolve({ email: "", password: "", confirmPass:"",  dob: "", fname: "", 
        lname: "Last name is required", address:"" });
      }
      else if(dob === ''){
        setFnameErr("Date of birth is required")
        resolve({ email: "", password: "", confirmPass:"",  dob: "Date of birth is required", fname: "", 
        lname: "", address:"" });
      }
      else if(address === ''){
        setFnameErr("Date of birth is required")
        resolve({ email: "", password: "", confirmPass:"",  dob: "", fname: "", 
        lname: "", address:"Address is required" });
      }
      else {
        console.log("else statement");
        resolve({ email: "", password: "", confirmPass: "", dob: "", fname: "", 
        lname: "", address:"" });
      }
    });
  };

  const formInputChange = (formField, value) => {
    if (formField === "fname") {
      setFname(value);
    }
    if (formField === "lname") {
      setLname(value);
    }
    if (formField === "email") {
      setEmail(value);
    }
    if (formField === "dob") {
      setDob(value);
    }
    if (formField === "address") {
      setAddress(value);
    }
    if (formField === "password") {
      setPassword(value);
    }
    if (formField === "confirmPass"){
      setConfirmPass(value);
    }
  };


  const handleFormSubmit = () => {
    setLoading(true);
    validationSchema()
      .then(async(res) => {
        if (res.fname === '' && res.lname === '' && res.email === '' 
        && res.dob === '' && res.address === '' && res.password === '' && res.confirmPass === ''){
          try {
            register(email, password, fname, lname, dob, values.userType, values.typeUser, address, values.licenseNum);
            console.log(values.email)
            console.log(fname)
            console.log(lname)
            //post users to the db
            API.post('add_user', {
              fname: fname,
              lname: lname,
              userType: 1,
              dob: dob,
              password: password,
              email: email,
              address: address,
              //licenseNum: values.licenseNum
            });
            //fname = fname.concat(' ');
            const attributeList = [];
            attributeList.push(
              new CognitoUserAttribute({
                Name: 'email',
                Value: email,
              })
            );
            attributeList.push(
              new CognitoUserAttribute({
                Name: 'birthdate',
                Value: dob,
              })
            );
            console.log(fname + ' ' + lname)
            const name = fname + ' ' + lname;
            attributeList.push(
              new CognitoUserAttribute({
                Name: 'name',
                Value: name,
              })
            );
            let username = email;
            //push user to cognito pool
            userpool.signUp(username, password, attributeList, null, (err, data) => {
              if (err) {
                console.log(err);
                alert("Couldnt sign up");
              } else {
                console.log(data);
                alert('User added successfully');
              }
            })
            navigate('/session/verify');
            setLoading(false);
          } catch (e) {
            console.log(e);
            setLoading(false);
          }
        }
      },  err => console.log(err))
      .catch(err => console.log(err));
        
  };

  return (
    <JWTRegister>
      <Card className="card">
        <Grid container>
           {/* <Grid item sm={6} xs={12}>
              <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
                <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
              </JustifyBox>
            </Grid> */}

          <Grid item sm={12} xs={15}>
            <ContentBox>
            <Grid container direction="column" justifyContent="flex-end"spacing={2}>
            {/* <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}> */}
                    {/* <input 
                      type="radio"
                      name="typeUser"
                      value={values.driver}
                      onChange={handleChange}
                    />
                    Driver
                    <input 
                      type="radio"
                      name="typeUser"
                      value={values.sponsor}
                      onChange={handleChange}
                    />
                    Sponsor
                    <input 
                      type="radio"
                      name="typeUser"
                      value={values.admin}
                      onChange={handleChange}
                    />
                    Admin<br />
                    <br /> */}
                    <div className="formfield">
                      <TextField
                        value={fname}
                        onChange={(e) => formInputChange("fname", e.target.value)}
                        label="First name"
                        helperText={fnameErr}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    
                    <div className='formfield'>
                      <TextField
                        value={lname}
                        onChange={(e) => formInputChange("lname", e.target.value)}
                        label="Last name"
                        helperText={lnameErr}
                        sx={{ mb: 2 }}
                      />
                    </div>

                    <div className="formfield">
                      <TextField
                        value={email}
                        onChange={(e) => formInputChange("email", e.target.value)}
                        label="Email"
                        helperText={emailErr}
                        sx={{ mb: 2 }}
                      />
                    </div>

                    <div className="formfield">
                      <TextField
                        value={dob}
                        type='date'
                        InputLabelProps={{shrink: true}}
                        onChange={(e) => formInputChange("dob", e.target.value)}
                        label="Date of Birth"
                        helperText={dobErr}
                        sx={{ mb: 2 }}
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
                        sx={{ mb: 2 }}
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
                   
                    <div className="formfield">
                      <TextField
                        value={confirmPass}
                        onChange={(e) => formInputChange("confirmPass", e.target.value)}
                        label="Confirm Password"
                        helperText={confirmPassErr}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    {/* {values.typeUser === '1' && ( */}
                    {/* <TextField
                      fullWidth
                      size="small"
                      name="licenseNum"
                      type="licenseNum"
                      label="License Number"
                      InputLabelProps={{shrink : true}}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.licenseNum}
                      onChange={handleChange}
                      helperText={touched.licenseNum && errors.licenseNum}
                      error={Boolean(errors.licenseNum && touched.licenseNum)}
                      sx={{ mb: 2 }}
                    /> */}
                    {/* )} */}
                    {/* {values.typeUser === '1' && ( */}
                    <div className="formfield">
                      <TextField
                        value={address}
                        onChange={(e) => formInputChange("address", e.target.value)}
                        label="Address"
                        helperText={addressErr}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    {/* )} */}
                    {/* {values.typeUser === '2' && (
                      <TextField
                      fullWidth
                      size="small"
                      name="sponsorOrg"
                      type="sponsorOrg"
                      label="Sponsor Organization"
                      InputLabelProps={{shrink : true}}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.sponsorOrg}
                      onChange={handleChange}
                      helperText={touched.sponsorOrg && errors.sponsorOrg}
                      error={Boolean(errors.sponsorOrg && touched.sponsorOrg)}
                      sx={{ mb: 2 }}
                    />
                    )} */}
                    {/* {values.typeUser === '3' && (
                      <TextField
                      fullWidth
                      size="small"
                      name="address"
                      type="address"
                      label="Address"
                      InputLabelProps={{shrink : true}}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.address}
                      onChange={handleChange}
                      helperText={touched.address && errors.address}
                      error={Boolean(errors.address && touched.address)}
                      sx={{ mb: 2 }}
                    />
                    )} */}
                    {/* <FlexBox gap={1} alignItems="center">
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
                    </FlexBox> */}

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      onClick={handleFormSubmit}
                      sx={{ mb: 2, mt: 3 }}
                    >
                      Register
                    </LoadingButton>

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Login
                      </NavLink>
                    </Paragraph>
                  {/*</form>
                 )}
              </Formik>
            </Box> */}
            </Grid>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRegister>
  );
};

export default JwtRegister;
