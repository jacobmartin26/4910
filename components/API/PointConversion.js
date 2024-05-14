import React, { useState, useContext } from 'react';
import API from "./API";
import AuthContext from 'app/contexts/JWTAuthContext';
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const { H2 } = require("app/components/Typography");
const { H3 } = require("app/components/Typography");

const GetUserApps = () => {
    const [points, setPoints] = useState([]);
    const [money, setMoney] = useState(null);
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = (values) => {
        setLoading(true);
            console.log(money)
            console.log(points)
            API.post('/point/conversion/' + id, {
                money : money,
                points : points
              });
        
        setLoading(false)
        navigate('/pages/sponsorDash');
      };

      const formInputChange = (formField, value) => {
        if (formField === "points") {
          setPoints(value);
        }
        if (formField === "money"){
            setMoney(value);
        }
      };

    return (
        <div>
            <H2>Set Point to Money Conversion</H2>
                <div>
                    <H3>Points</H3>
                    <TextField
                        value={points}
                        onChange={(e) => formInputChange("points", e.target.value)}
                        label="Points Value"
                        //   helperText={pointsErr}
                        sx={{ mb: 3 }}
                    />
                    <H3>Money</H3>
                    <TextField
                        value={money}
                        onChange={(e) => formInputChange("money", e.target.value)}
                        label="Money Value"
                        //   helperText={pointsErr}
                        sx={{ mb: 3 }}
                    />
                </div>
            <div>
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
            </div>
        </div>
    );
};

export default GetUserApps;