import React, { useState } from 'react'
import { Button, TextField,Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { authenticate } from 'app/auth/services/authenticate';
// import userpool from 'app/auth/userpool';

// Box, styled, useTheme
// const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

// const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

// const ContentBox = styled(Box)(() => ({
//   height: '100%',
//   padding: '32px',
//   position: 'relative',
//   background: 'rgba(0, 0, 0, 0.01)',
// }));

// const Root = styled(JustifyBox)(() => ({
//   background: '#1A2038',
//   minHeight: '100% !important',
//   '& .card': {
//     maxWidth: 800,
//     minHeight: 400,
//     margin: '1rem',
//     display: 'flex',
//     borderRadius: 12,
//     alignItems: 'center',
//   },
// }));

const Login = () => {

  const Navigate = useNavigate();
  // const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [loginErr,setLoginErr]=useState('');

  const formInputChange = (formField, value) => {
    if (formField === "email") {
      setEmail(value);
    }
    if (formField === "password") {
      setPassword(value);
    }
  };

  const validation = () => {
    return new Promise((resolve, reject) => {
      if (email === '' && password === '') {
        setEmailErr("Email is Required");
        setPasswordErr("Password is required")
        resolve({ email: "Email is Required", password: "Password is required" });
      }
      else if (email === '') {
        setEmailErr("Email is Required")
        resolve({ email: "Email is Required", password: "" });
      }
      else if (password === '') {
        setPasswordErr("Password is required")
        resolve({ email: "", password: "Password is required" });
      }
      else if (password.length < 6) {
        setPasswordErr("must be 6 character")
        resolve({ email: "", password: "must be 6 character" });
      }
      else {
        resolve({ email: "", password: "" });
      }
    });
  };

  const handleClick = () => {
    setEmailErr("");
    setPasswordErr("");
    validation()
      .then((res) => {
        if (res.email === '' && res.password === '') {
          authenticate(email,password)
          .then((data)=>{
            setLoginErr('');
            Navigate('/pages/about');
          },(err)=>{
            console.log(err);
            setLoginErr(err.message)
          })
          .catch(err=>console.log(err))
        }
      }, err => console.log(err))
      .catch(err => console.log(err));
  }

  return (
    <div className="login">

      <div className='form'>
        <div className="formfield">
          <TextField
            value={email}
            onChange={(e) => formInputChange("email", e.target.value)}
            label="Email"
            helperText={emailErr}
          />
        </div>
        <div className='formfield'>
          <TextField
            value={password}
            onChange={(e) => { formInputChange("password", e.target.value) }}
            type="password"
            label="Password"
            helperText={passwordErr}
          />
        </div>
        <div className='formfield'>
          <Button type='submit' variant='contained' onClick={handleClick}>Login</Button>
        </div>
        <Typography variant="body">{loginErr}</Typography>
      </div>

    </div>
  )
}

export default Login