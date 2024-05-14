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
import React, { useContext } from 'react';
import API from "app/components/API/API";
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import userpool from 'app/auth/userpool';
import AuthContext from 'app/contexts/JWTAuthContext';


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
  const { user } = useContext(AuthContext);
  const id = Number(user ? user.id : null);
  

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
  };


  const handleFormSubmit = (values) => {
    setLoading(true);

    try {
      //register(values.email, values.password, values.fname, values.lname, values.dob, values.userType, values.typeUser, values.address, values.licenseNum);
      //console.log(values.email)
      console.log(fname)
      console.log(lname)
      //post users to the db
      API.post('add/sponsor/' + id, {
        fname: fname,
        lname: lname,
        userType: 2,
        dob: dob,
        password: password,
        email: email,
        address: address,
        //licenseNum: values.licenseNum
      });
      // await API.post('add/sponsor/' + id, {
      //   fname: fname,
      //   //licenseNum: values.licenseNum
      // });
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
      navigate('/pages/Verify');
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // let selectedCompanyId = null;
  //   const handleCompanySelect = (companyId) => {
  //       console.log("Company ID:", companyId);
  //       //setSelectedCompanyId(companyId);
  //       selectedCompanyId = companyId;
  //   };


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
                //validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="fname"
                      label="First Name"
                      id = "fname"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={fname}
                      onChange={(e) => formInputChange("fname", e.target.value)}
                      helperText={touched.fname && errors.fname}
                      error={Boolean(errors.fname && touched.fname)}
                      sx={{ mb: 3 }}
                    />
                    
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="lname"
                      label="Last Name"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={lname}
                      onChange={(e) => formInputChange("lname", e.target.value)}
                      helperText={touched.lanme && errors.lname}
                      error={Boolean(errors.lname && touched.lname)}
                      sx={{ mb: 3 }}
                    />
                    
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="email"
                      label="Email"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={email}
                      onChange={(e) => formInputChange("email", e.target.value)}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />
                    
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      name="dob"
                      label="Date of Birth"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={dob}
                      onChange={(e) => formInputChange("dob", e.target.value)}
                      helperText={touched.dob && errors.dob}
                      error={Boolean(errors.dob && touched.dob)}
                      sx={{ mb: 3 }}
                    />
                    
                    
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
                      onBlur={handleBlur}
                      value={password}
                      onChange={(e) => formInputChange("password", e.target.value)}
                      //component={setShowPassword}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: .5 }}
                    />
                    
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
                    
                    <TextField
                      fullWidth
                      size="small"
                      name="address"
                      type="address"
                      label="Address"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={address}
                      onChange={(e) => formInputChange("address", e.target.value)}
                      helperText={touched.address && errors.address}
                      error={Boolean(errors.address && touched.address)}
                      sx={{ mb: 2 }}
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
                      Register
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
