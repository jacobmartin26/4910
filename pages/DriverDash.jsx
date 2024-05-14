import { Fragment } from "react";
import { styled } from '@mui/material';
import PointData from "app/components/API/PointData";
const { H1, H3 } = require("app/components/Typography");
const { H2 } = require("app/components/Typography");


function DriverDash() {
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));


    return (
        <Fragment>
            <ContentBox classname="driverDash">
                <H1>Driver Dashboard</H1>
                <div classname="Points">
                    <H2>Your Points</H2>
                    <PointData />
                    <H2>Points History</H2>
                    <li>+100 Points: Driving within the speed limit</li>
                    <li>-99.9 Points: Running over a child</li>
                </div>
                <div className="Catalog">
                    <H2>Popular Catalog Items</H2>
                    <li>Happy Birthday (Vocal)</li>
                    <li>The Frog Song</li>
                    <li>Staying Alive (Instrumental)</li>
                    <H2>Recent Orders</H2>
                    <p>Happy Birthday (Vocal)</p>
                    <p>Order Status: Processing</p>
                </div>
                <div className="Contact">
                    <H3>Contact Sponsor</H3>
                    <p>Email: help@sponsoremail.com</p>
                    <p>Phone Number: 911-911-9911</p>
                </div>
                <div className="Contact">
                    <H3>Contact Admin</H3>
                    <p>Email: help@adminemail.com</p>
                    <p>Phone Number: 999-999-9999</p>
                </div>
            </ContentBox>
        </Fragment>
    );
};

export default DriverDash;