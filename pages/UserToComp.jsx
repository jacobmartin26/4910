import React, { useState, useEffect } from 'react';
import API from 'app/components/API/API';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Box, styled, MenuItem, Select } from '@mui/material';
import { H2 } from "app/components/Typography";
import CompanyData from "app/components/API/CompanyData";
import { useNavigate } from 'react-router-dom';


const JWTRegister = styled(Box)(() => ({
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

const JwtRegister = () => {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await API.get('/Users');
      const users = response.data.users.filter(user => user.userType === 1); // Filter out only drivers
      setDrivers(users);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleDriverChange = (event) => {
    setSelectedDriver(event.target.value);
    console.log("Selected Driver ID:", event.target.value);
  };

  const handleFormSubmit = () => {
    setLoading(true);

    console.log("Submitting...");

    API.post('add/driver/admin', {
        user_id: selectedDriver,
        company_id: selectedCompanyId,       
    })
    .then(() => {
      alert("User was added to company!");
      setLoading(false);
    })
    .catch(error => {
      console.error('Error adding user to company:', error);
      setLoading(false);
    });
    try {
        navigate('/pages/adminDash');
    } catch (e) {
        console.log(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <JWTRegister>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            {/* Left side content */}
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box p={2} height="100%">
              <form onSubmit={handleFormSubmit}>
                <H2>Select a Driver</H2>
                <Select
                  value={selectedDriver}
                  onChange={handleDriverChange}
                  fullWidth
                  sx={{ mb: 2, width: '80%' }} // Set width to 80%
                >
                  {drivers.map(driver => (
                    <MenuItem key={driver.user_id} value={driver.user_id}>
                      {`${driver.fname} ${driver.lname} (id: ${driver.user_id})`} {/* Display name and ID */}
                    </MenuItem>
                  ))}
                </Select>

                <H2>Select a Company</H2>
                <CompanyData
                  onCompanySelect={(companyId) => setSelectedCompanyId(companyId)}
                />

                <LoadingButton
                  type="submit"
                  color="primary"
                  loading={loading}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Submit
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
