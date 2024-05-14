import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField } from '@mui/material';
import { Box, styled } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import React from "react";
import API from "app/components/API/API";
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
//import { AdminConfirmSignUp } from 'amazon-cognito-identity-js';
//import { CognitoIdentityServiceProvider } from 'aws-sdk';
import userpool from 'app/auth/userpool';
import CompanyData from "app/components/API/CompanyData";


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
  email: '',
  password: '',
  username: '',
  fname: '',
  lname: '',
  dob: '',
  userType: '',
  typeUser: '',
  address: '',
  licenseNum: '',
  driver: 1,
  sponsor: 2,
  admin: 3,
  remember: true,
};

// form field validation schema
// const validationSchema = Yup.object().shape({
//   password: Yup.string()
//     .min(6, 'Password must be 6 character length')
//     .matches(/^[0-9A-Za-z]*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?][0-9a-zA-Z]*$/, 'Need one special character')
//     .required('Password is required!'),
//   confirm_password: Yup.string().label('confirm password')
//     .required()
//     .oneOf([Yup.ref('password'), null], 'Passwords must match'),
//   email: Yup.string().email('Invalid Email address').required('Email is required!'),
//   fname: Yup.string().required("First name is required!"),
//   lname: Yup.string().required("Last name is required!"),
// });


const JwtRegister = () => {
  //const theme = useTheme();
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
  const [address, setAddress] = useState("");
  const [userType, setUserType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

 
  const validationSchema = () => {
    return new Promise((resolve, reject) => {
      if (email === '' && password === '') {
        setEmailErr("Email is required");
        setPasswordErr("Password is required")
        resolve({ email: "Email is required", password: "Password is required" });
        setLoading(false)
      }
      else if (email === '') {
        console.log("elseif 1 statement");
        setEmailErr("Email is Required")
        resolve({ email: "Email is Required", password: "" });
        setLoading(false)
      }
      else if (password === '') {
        console.log("elseif 2 statement");
        setPasswordErr("Password is required")
        resolve({ email: "", password: "Password is required" });
        setLoading(false)
      }
      else if (password.length < 6) {
        console.log("elseif 3 statement");
        setPasswordErr("must be 6 character")
        resolve({ email: "", password: "must be 6 character" });
        setLoading(false)
      }
      else {
        console.log("else statement");
        resolve({ email: "", password: "" });
        setLoading(false)
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
    if (formField === "companyName") {
      setCompanyName(value);
    }
    if (formField === "companyEmail") {
      setCompanyEmail(value);
    }
  };


  const handleFormSubmit = (values) => {
    setLoading(true);

    setEmailErr("");
    setPasswordErr("");
    console.log("validating");
    validationSchema()
      .then(async (res) => {
        if (res.email === '' && res.password === '' || userType === '4') {
          try {
            try {
              register(values.email, values.password, values.fname, values.lname, values.dob, values.userType, values.typeUser, values.address, values.licenseNum);
              console.log(values.email)
              console.log(fname)
              console.log(lname)
              console.log("kept going")
            //post users to the db
              if(userType === '1'){
              API.post('add_user', {
                fname: fname,
                lname: lname,
                userType: userType,
                dob: dob,
                password: password,
                email: email,
                address: address,
                //licenseNum: values.licenseNum
              });
            }
            if(userType === '2'){
              API.post('admin/add/sponsor', {
                fname: fname,
                lname: lname,
                userType: userType,
                dob: dob,
                password: password,
                email: email,
                address: address,
                company: selectedCompanyId,
                //licenseNum: values.licenseNum
              });
            }
            if(userType === '3'){
              API.post('add_user', {
                fname: fname,
                lname: lname,
                userType: userType,
                dob: dob,
                password: password,
                email: email,
                address: address,
                //licenseNum: values.licenseNum
              });
            }
            if(userType === '4'){
              API.post('add_company', {
                name: companyName,
                email: companyEmail,
              });
            }
            if (userType !== '4') {
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
              const name = fname + ' ' + lname;
              attributeList.push(
                new CognitoUserAttribute({
                  Name: 'name',
                  Value: name,
                })
              );
        
              let username = email;
              // Sign up the user
              userpool.signUp(username, password, attributeList, null, async (err, data) => {
                if (err) {
                  console.log(err);
                  alert("Could not sign up");
                } else {
                  console.log(data);
                  alert('User added successfully');
        
                  // Confirm the user after successful signup
                  // try {
                  //   const cognitoUser = new CognitoUser({ Username: username, Pool: userpool });
                  //   await AdminConfirmSignUp(username);
                  //   console.log("User confirmed successfully");
                  // } catch (error) {
                  //   console.error("Error confirming user:", error);
                  // }
                }
              });
            }
              if(userType !== '4'){
                navigate('/pages/Verify');
              } else{
                navigate('/pages/AdminDash');
              }
              
              setLoading(false);
            } catch (e) {
              console.log(e);
              setLoading(false);
            }
          } catch (e) {
            console.log("error")
            setLoading(false);
          }
        }
      }, err => console.log(err))
      .catch(err => console.log(err));

    // try {
    //   register(values.email, values.password, values.fname, values.lname, values.dob, values.userType, values.typeUser, values.address, values.licenseNum);
    //   console.log(values.email)
    //   console.log(fname)
    //   console.log(lname)
    //   console.log("kept going")
    // //post users to the db
    //   if(userType === '1'){
    //   API.post('add_user', {
    //     fname: fname,
    //     lname: lname,
    //     userType: userType,
    //     dob: dob,
    //     password: password,
    //     email: email,
    //     address: address,
    //     //licenseNum: values.licenseNum
    //   });
    // }
    // if(userType === '2'){
    //   API.post('admin/add/sponsor', {
    //     fname: fname,
    //     lname: lname,
    //     userType: userType,
    //     dob: dob,
    //     password: password,
    //     email: email,
    //     address: address,
    //     company: selectedCompanyId,
    //     //licenseNum: values.licenseNum
    //   });
    // }
    // if(userType === '3'){
    //   API.post('add_user', {
    //     fname: fname,
    //     lname: lname,
    //     userType: userType,
    //     dob: dob,
    //     password: password,
    //     email: email,
    //     address: address,
    //     //licenseNum: values.licenseNum
    //   });
    // }
    // if(userType === '4'){
    //   API.post('add_company', {
    //     name: companyName,
    //     email: companyEmail,
    //   });
    // }
    // if (userType !== '4') {
    //   const attributeList = [];
    //   attributeList.push(
    //     new CognitoUserAttribute({
    //       Name: 'email',
    //       Value: email,
    //     })
    //   );
    //   attributeList.push(
    //     new CognitoUserAttribute({
    //       Name: 'birthdate',
    //       Value: dob,
    //     })
    //   );
    //   const name = fname + ' ' + lname;
    //   attributeList.push(
    //     new CognitoUserAttribute({
    //       Name: 'name',
    //       Value: name,
    //     })
    //   );

    //   let username = email;
    //   // Sign up the user
    //   userpool.signUp(username, password, attributeList, null, async (err, data) => {
    //     if (err) {
    //       console.log(err);
    //       alert("Could not sign up");
    //     } else {
    //       console.log(data);
    //       alert('User added successfully');

    //       // Confirm the user after successful signup
    //       // try {
    //       //   const cognitoUser = new CognitoUser({ Username: username, Pool: userpool });
    //       //   await AdminConfirmSignUp(username);
    //       //   console.log("User confirmed successfully");
    //       // } catch (error) {
    //       //   console.error("Error confirming user:", error);
    //       // }
    //     }
    //   });
    // }
    
    //   navigate('/pages/Verify');
    //   setLoading(false);
    // } catch (e) {
    //   console.log(e);
    //   setLoading(false);
    // }
  };

  const handleOptionChange = (event) => {
    setUserType(event.target.value);
    console.log(event.target.value);
  };
  let selectedCompanyId = null;
    const handleCompanySelect = (companyId) => {
        console.log("Company ID:", companyId);
        //setSelectedCompanyId(companyId);
        selectedCompanyId = companyId;
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
              
                
                  <form onSubmit={handleFormSubmit}>
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
                    <input
                             type="radio"
                             id="driver"
                             name="role"
                             value="1"
                             checked={userType === "1"}
                             onChange={handleOptionChange}
                         />
                         <label htmlFor="driver">Driver</label>

                         <input
                             type="radio"
                             id="sponsor"
                             name="role"
                             value="2"
                             checked={userType === "2"}
                             onChange={handleOptionChange}
                         />
                         <label htmlFor="sponsor">Sponsor</label>

                         <input
                             type="radio"
                             id="admin"
                             name="role"
                             value="3"
                             checked={userType === "3"}
                             onChange={handleOptionChange}
                         />
                         <label htmlFor="admin">Admin</label>

                         <input
                             type="radio"
                             id="organization"
                             name="role"
                             value="4"
                             checked={userType === "4"}
                             onChange={handleOptionChange}
                         />
                         <label htmlFor="organization">Organization</label>
                    <br/>
                    <br/>
                    {userType !== '4' && (
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="fname"
                      label="First Name"
                      id = "fname"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      //onBlur={handleBlur}
                      value={fname}
                      onChange={(e) => formInputChange("fname", e.target.value)}
                      //helperText={touched.fname && errors.fname}
                      //error={Boolean(errors.fname && touched.fname)}
                      sx={{ mb: 3 }}
                    />
                    )}
                    {userType !== '4' && (
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="lname"
                      label="Last Name"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      //onBlur={handleBlur}
                      value={lname}
                      onChange={(e) => formInputChange("lname", e.target.value)}
                      //helperText={touched.lanme && errors.lname}
                      //error={Boolean(errors.lname && touched.lname)}
                      sx={{ mb: 3 }}
                    />
                    )}
                    {userType !== '4' && (
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="email"
                      label="Email"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      //onBlur={handleBlur}
                      value={email}
                      onChange={(e) => formInputChange("email", e.target.value)}
                      helperText={emailErr}
                      //error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />
                    )}
                    {userType !== '4' && (
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      name="dob"
                      label="Date of Birth"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      //onBlur={handleBlur}
                      value={dob}
                      onChange={(e) => formInputChange("dob", e.target.value)}
                      //helperText={touched.dob && errors.dob}
                      //error={Boolean(errors.dob && touched.dob)}
                      sx={{ mb: 3 }}
                    />
                    )}
                    {userType !== '4' && (
                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      label="Password"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      //onBlur={handleBlur}
                      value={password}
                      onChange={(e) => formInputChange("password", e.target.value)}
                      //component={setShowPassword}
                      helperText={passwordErr}
                      //error={Boolean(errors.password && touched.password)}
                      sx={{ mb: .5 }}
                    />
                    )}
                    {userType !== '4' && (
                   <FlexBox gap={1} alignItems="center">
                      <Checkbox
                        size="small"
                        name="showPassword"
                        onChange={() =>
                          setShowPassword((prev) => !prev)
                        }
                        value={showPassword}
                        sx={{ mb: 1  }}
                      />

                      <Paragraph fontSize={13}>
                        Show Password
                      </Paragraph>
                    
                    </FlexBox>
                    )}
                    
                    {userType === '4' && (
                      <TextField
                        fullWidth
                        size="small"
                        name="companyName" // Change name according to your form structure
                        type="text"
                        label="Company Name"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        //onBlur={handleBlur}
                        value={companyName} // Change value according to your form structure
                        onChange={(e) => formInputChange("companyName", e.target.value)}
                        //helperText={touched.companyName && errors.companyName} // Change according to your form structure
                        //error={Boolean(errors.companyName && touched.companyName)} // Change according to your form structure
                        sx={{ mb: 2 }}
                      />
                    )}
                    {userType === '4' && (
                      <TextField
                        fullWidth
                        size="small"
                        name="companyEmail" // Change name according to your form structure
                        type="text"
                        label="Company Email"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        //onBlur={handleBlur}
                        value={companyEmail} // Change value according to your form structure
                        onChange={(e) => formInputChange("companyEmail", e.target.value)}
                        //helperText={touched.companyEmail && errors.companyEmail} // Change according to your form structure
                        //error={Boolean(errors.companyEmail && touched.companyEmail)} // Change according to your form structure
                        sx={{ mb: 2 }}
                      />
                    )}
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
                    {userType !== '4' && (
                    <TextField
                      fullWidth
                      size="small"
                      name="address"
                      type="address"
                      label="Address"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      //onBlur={handleBlur}
                      value={address}
                      onChange={(e) => formInputChange("address", e.target.value)}
                      //helperText={touched.address && errors.address}
                      //error={Boolean(errors.address && touched.address)}
                      sx={{ mb: 2 }}
                    />
                    )}
                    {userType === '2' && (
                      <CompanyData onCompanySelect={handleCompanySelect} />
                    )}
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
                    <FlexBox gap={1} alignItems="center">
                      <Checkbox
                        size="small"
                        name="remember"
                        //onChange={handleChange}
                        //checked={values.remember}
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
                      Register
                    </LoadingButton>
                  </form>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTRegister>
  );
};

export default JwtRegister;
