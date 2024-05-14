import React, { useEffect, useState } from "react";
import { LoadingButton } from '@mui/lab';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import API from "./API";
import useAuth from "app/hooks/useAuth";
// import userpool from 'app/auth/userpool';

// const user = userpool.getCurrentUser();
// const email = user.username;

const AccountData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await API.get('User/' + user.id);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching reasons:', error);
            }
        };
        fetchData();
    }, [user.id]);

    const role = (() =>{
        if(data[3] === 1){
            return 'Driver';
        }else if (data[3] === 2){
            return 'Sponsor';
        }else if(data[3] === 3){
            return 'Admin';
        }else return 'Unknown';
    });


    const activeAccount = (() =>{
        if(data[6] === 1){
            return 'Active';
        }else{
            return 'Inactive';
        }
    });

    const handleFormSubmit = () => {
        setLoading(true);
    
        try {
          navigate('/pages/accountEdit');
          setLoading(false);
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
      };

    return (
        <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>ID: {user.id}</p>
            <p>Role: {role()}</p> 
            <p>Account Activity: {activeAccount()}</p>
            <Formik
                onSubmit={handleFormSubmit}
                >
                    {({ handleSubmit }) =>(
                <form onSubmit={handleSubmit}>
                <LoadingButton
                        type="submit"
                        color="primary"
                        loading={loading}
                        variant="contained"
                            onClick={handleFormSubmit}
                        sx={{ mb: 2, mt: 3 }}
                        >
                        Edit Details
                </LoadingButton>
                </form>
                )}
                </Formik>
        </div>
    );
}

export default AccountData;