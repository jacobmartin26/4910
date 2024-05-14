import { Fragment } from "react";
import { styled } from '@mui/material';
import AccountData from "app/components/API/AccountData";
//import useAuth from "app/hooks/useAuth";
const { H1 } = require("app/components/Typography");

function AccountInfo() {
    //const { user } = useAuth();
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));


    return (
        <Fragment>
            <ContentBox classname="accountInfo">
                <H1>Account Information</H1>
                <div className="App">
                    <AccountData />
                    {/* <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>ID: {user.id}</p>
                    <p>Role: {user.role}</p> */}
                    {/* <p>Points: {user.points}</p> */}
                </div>
            </ContentBox>
        </Fragment>
    );
};

export default AccountInfo;